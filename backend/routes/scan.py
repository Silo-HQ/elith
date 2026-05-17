"""Scan endpoint for repository and vault analysis."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader

router = APIRouter()


class ScanRequest(BaseModel):
    """Request model for scan endpoint."""
    repo_path: str
    vault_path: Optional[str] = None


class ScanResponse(BaseModel):
    """Response model for scan endpoint matching frontend expectations."""
    loaded_files: List[str]
    total_files: int
    vault_notes: List[str]
    tokens_saved: int


@router.post("/scan")
async def scan_repository(request: ScanRequest) -> ScanResponse:
    """
    Scan repository and vault to build task packet.
    
    Returns file list, vault notes, and metadata.
    """
    try:
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        # Calculate approximate tokens saved by smart selection
        # Rough estimate: 4 chars per token, we're loading ~6 files instead of all
        total_chars = sum(f.size for f in files)
        loaded_chars = sum(f.size for f in files[:6])  # Approximate smart selection
        tokens_saved = (total_chars - loaded_chars) // 4
        
        return ScanResponse(
            loaded_files=[f.path for f in files[:20]],  # Return first 20 for preview
            total_files=len(files),
            vault_notes=[n.filename for n in notes],
            tokens_saved=max(0, tokens_saved)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

# Made with Bob
