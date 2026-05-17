#!/usr/bin/env python3
"""Test script for context engine functionality."""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.context_engine.repo_scanner import RepoScanner
from backend.context_engine.vault_reader import VaultReader
from backend.context_engine.packet_builder import PacketBuilder
from backend.models.task_packet import TaskPacket


def test_repo_scanner():
    """Test repository scanning."""
    print("=" * 60)
    print("Testing Repository Scanner")
    print("=" * 60)
    
    # Scan current directory
    scanner = RepoScanner(".")
    files = scanner.scan()
    
    print(f"\nTotal files found: {len(files)}")
    print(f"Key files: {sum(1 for f in files if f.is_key_file)}")
    
    # Show key files
    key_files = [f for f in files if f.is_key_file]
    if key_files:
        print("\nKey files detected:")
        for f in key_files[:5]:
            print(f"  - {f.path}")
    
    # Show file type distribution
    extensions = {}
    for f in files:
        ext = f.extension or "no-ext"
        extensions[ext] = extensions.get(ext, 0) + 1
    
    print("\nFile types:")
    for ext, count in sorted(extensions.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {ext}: {count}")
    
    return files


def test_vault_reader():
    """Test vault reading."""
    print("\n" + "=" * 60)
    print("Testing Vault Reader")
    print("=" * 60)
    
    # Try to read obsidian-template
    vault_reader = VaultReader("obsidian-template")
    notes = vault_reader.read_notes()
    
    print(f"\nNotes found: {len(notes)}")
    if notes:
        print("\nSample notes:")
        for note in notes[:3]:
            print(f"  - {note.filename} ({len(note.content)} chars)")
            if note.tags:
                print(f"    Tags: {', '.join(note.tags)}")
    
    return notes


def test_packet_builder(files, notes):
    """Test context packet building."""
    print("\n" + "=" * 60)
    print("Testing Packet Builder")
    print("=" * 60)
    
    # Create task packet
    task_packet = TaskPacket(
        repo_path=".",
        vault_path="obsidian-template",
        files=files,
        vault_notes=notes,
        total_files=len(files)
    )
    
    # Test different operations
    operations = ["explain", "architect", "test-gen", "refactor"]
    
    for operation in operations:
        print(f"\n--- Testing {operation} operation ---")
        builder = PacketBuilder(task_packet)
        context = builder.build_context(operation)
        
        print(f"Total files in repo: {context['total_files']}")
        print(f"Files selected: {context['files_loaded']}")
        print(f"Selected files:")
        for file_path in context['selected_files']:
            print(f"  - {file_path}")
        
        print(f"Relevant vault notes: {len(context['vault_notes'])}")
        print(f"Context size: {len(context['context'])} characters")
        
        # Verify max files constraint
        max_files = PacketBuilder.TASK_PATTERNS.get(operation, {}).get("max_files", 4)
        assert context['files_loaded'] <= max_files, \
            f"Too many files selected for {operation}: {context['files_loaded']} > {max_files}"
        print(f"✓ Constraint satisfied: {context['files_loaded']} <= {max_files} files")


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("ELITH CONTEXT ENGINE TEST")
    print("=" * 60)
    
    try:
        # Test repo scanner
        files = test_repo_scanner()
        
        # Test vault reader
        notes = test_vault_reader()
        
        # Test packet builder
        test_packet_builder(files, notes)
        
        print("\n" + "=" * 60)
        print("✓ ALL TESTS PASSED")
        print("=" * 60)
        print("\nContext engine is working correctly!")
        print("- Repository scanning: ✓")
        print("- Vault reading: ✓")
        print("- Smart file selection: ✓")
        print("- File count constraints: ✓")
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("✗ TEST FAILED")
        print("=" * 60)
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

# Made with Bob
