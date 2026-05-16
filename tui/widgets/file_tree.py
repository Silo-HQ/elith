"""
FileTree widget - Interactive file system navigator
"""

from textual.widgets import Tree
from textual.widgets.tree import TreeNode
from pathlib import Path
from typing import Optional


class FileTree(Tree):
    """
    Interactive file tree navigator with:
    - Directory expansion/collapse
    - File type icons
    - Syntax highlighting
    - Quick navigation
    """
    
    DEFAULT_CSS = """
    FileTree {
        background: #0F0F0F;
        border: solid #27272A;
        padding: 1;
        scrollbar-gutter: stable;
    }
    
    FileTree:focus {
        border: solid #A855F7;
    }
    
    FileTree > .tree--label {
        color: #E4E4E7;
    }
    
    FileTree > .tree--guides {
        color: #27272A;
    }
    
    FileTree > .tree--cursor {
        background: #27272A;
        color: #A855F7;
    }
    
    FileTree .directory {
        color: #60A5FA;
        text-style: bold;
    }
    
    FileTree .file {
        color: #E4E4E7;
    }
    
    FileTree .python-file {
        color: #3B82F6;
    }
    
    FileTree .javascript-file {
        color: #FBBF24;
    }
    
    FileTree .typescript-file {
        color: #3B82F6;
    }
    
    FileTree .markdown-file {
        color: #10B981;
    }
    
    FileTree .json-file {
        color: #F59E0B;
    }
    
    FileTree .hidden-file {
        color: #71717A;
    }
    """
    
    # File type icons (using emoji for compatibility)
    ICONS = {
        "directory": "📁",
        "python": "🐍",
        "javascript": "📜",
        "typescript": "📘",
        "markdown": "📝",
        "json": "📋",
        "yaml": "⚙️",
        "toml": "⚙️",
        "txt": "📄",
        "log": "📊",
        "default": "📄",
        "hidden": "👁️",
    }
    
    def __init__(self, root_path: str, **kwargs):
        super().__init__(label=Path(root_path).name, **kwargs)
        self.root_path = Path(root_path)
        self.show_root = True
        self.guide_depth = 4
        
    def on_mount(self) -> None:
        """Load the file tree when mounted"""
        self.load_directory(self.root, self.root_path)
    
    def load_directory(self, node: TreeNode, path: Path) -> None:
        """Load directory contents into tree node"""
        try:
            # Get all items in directory
            items = sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
            
            for item in items:
                # Skip certain directories
                if item.name in {'.git', '__pycache__', 'node_modules', '.venv', 'venv', '.mypy_cache'}:
                    continue
                
                # Skip hidden files (optional)
                if item.name.startswith('.') and item.name not in {'.env', '.gitignore'}:
                    continue
                
                # Get icon and label
                icon = self.get_icon(item)
                label = f"{icon} {item.name}"
                
                # Add node
                if item.is_dir():
                    # Add directory node (can be expanded)
                    child_node = node.add(label, data={"path": item, "type": "directory"})
                    child_node.allow_expand = True
                else:
                    # Add file node
                    node.add_leaf(label, data={"path": item, "type": "file"})
                    
        except PermissionError:
            node.add_leaf("⚠️ Permission denied", data=None)
        except Exception as e:
            node.add_leaf(f"⚠️ Error: {e}", data=None)
    
    def on_tree_node_expanded(self, event: Tree.NodeExpanded) -> None:
        """Load directory contents when node is expanded"""
        node = event.node
        
        # Check if already loaded
        if node.children:
            return
        
        # Get path from node data
        data = node.data
        if data and data.get("type") == "directory":
            path = data["path"]
            self.load_directory(node, path)
    
    def on_tree_node_selected(self, event: Tree.NodeSelected) -> None:
        """Handle file/directory selection"""
        node = event.node
        data = node.data
        
        if not data:
            return
        
        path = data["path"]
        file_type = data["type"]
        
        # Emit custom event for parent to handle
        self.post_message(self.FileSelected(path, file_type))
    
    def get_icon(self, path: Path) -> str:
        """Get icon for file/directory"""
        if path.is_dir():
            return self.ICONS["directory"]
        
        # Check file extension
        suffix = path.suffix.lower()
        
        if suffix == ".py":
            return self.ICONS["python"]
        elif suffix in {".js", ".jsx"}:
            return self.ICONS["javascript"]
        elif suffix in {".ts", ".tsx"}:
            return self.ICONS["typescript"]
        elif suffix in {".md", ".markdown"}:
            return self.ICONS["markdown"]
        elif suffix == ".json":
            return self.ICONS["json"]
        elif suffix in {".yml", ".yaml"}:
            return self.ICONS["yaml"]
        elif suffix == ".toml":
            return self.ICONS["toml"]
        elif suffix == ".txt":
            return self.ICONS["txt"]
        elif suffix == ".log":
            return self.ICONS["log"]
        elif path.name.startswith("."):
            return self.ICONS["hidden"]
        else:
            return self.ICONS["default"]
    
    def get_file_class(self, path: Path) -> str:
        """Get CSS class for file type"""
        if path.is_dir():
            return "directory"
        
        suffix = path.suffix.lower()
        
        if suffix == ".py":
            return "python-file"
        elif suffix in {".js", ".jsx"}:
            return "javascript-file"
        elif suffix in {".ts", ".tsx"}:
            return "typescript-file"
        elif suffix in {".md", ".markdown"}:
            return "markdown-file"
        elif suffix == ".json":
            return "json-file"
        elif path.name.startswith("."):
            return "hidden-file"
        else:
            return "file"
    
    def refresh_tree(self) -> None:
        """Refresh the entire tree"""
        self.clear()
        self.root.label = Path(self.root_path).name
        self.load_directory(self.root, self.root_path)
    
    def expand_to_path(self, target_path: Path) -> None:
        """Expand tree to show a specific path"""
        # TODO: Implement path expansion
        pass
    
    def search_files(self, query: str) -> list:
        """Search for files matching query"""
        # TODO: Implement file search
        pass
    
    class FileSelected(Tree.NodeSelected):
        """Custom event when a file is selected"""
        def __init__(self, path: Path, file_type: str):
            super().__init__(None)
            self.path = path
            self.file_type = file_type

# Made with Bob
