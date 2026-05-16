"""Scan endpoint for repository and vault analysis."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..context_engine.repo_scanner import RepoScanner
from ..context_engine.vault_reader import VaultReader
from ..models.task_packet import TaskPacket

router = APIRouter()


class ScanRequest(BaseModel):
    """Request model for scan endpoint."""
    repo_path: str
    vault_path: Optional[str] = None


@router.post("/scan")
async def scan_repository(request: ScanRequest) -> TaskPacket:
    """
    Scan repository and vault to build task packet.
    
    Returns file list, vault notes, and metadata.
    """
    try:
        scanner = RepoScanner(request.repo_path)
        files = scanner.scan()
        
        vault_reader = VaultReader(request.vault_path)
        notes = vault_reader.read_notes()
        
        return TaskPacket(
            repo_path=request.repo_path,
            vault_path=request.vault_path,
            files=files,
            vault_notes=notes,
            total_files=len(files)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

# Made with Bob
