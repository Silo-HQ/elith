"""
DocumentViewer widget - Rich markdown viewer with syntax highlighting
"""

from textual.widgets import Static
from textual.containers import VerticalScroll
from rich.markdown import Markdown
from rich.syntax import Syntax
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from typing import Optional
import re


class DocumentViewer(VerticalScroll):
    """
    Advanced markdown viewer with:
    - Syntax highlighting for code blocks
    - Formatted tables
    - Collapsible sections
    - Rich text rendering
    """
    
    DEFAULT_CSS = """
    DocumentViewer {
        background: #0F0F0F;
        border: solid #27272A;
        padding: 1 2;
        scrollbar-gutter: stable;
    }
    
    DocumentViewer:focus {
        border: solid #A855F7;
    }
    
    DocumentViewer Static {
        background: transparent;
    }
    
    DocumentViewer .markdown-heading {
        color: #A855F7;
        text-style: bold;
        margin: 1 0;
    }
    
    DocumentViewer .markdown-code {
        background: #1A1A1A;
        border: solid #27272A;
        padding: 1;
        margin: 1 0;
    }
    
    DocumentViewer .markdown-table {
        border: solid #27272A;
        margin: 1 0;
    }
    
    DocumentViewer .markdown-list {
        margin: 0 0 0 2;
    }
    """
    
    def __init__(self, content: str = "", **kwargs):
        super().__init__(**kwargs)
        self._content = content
        self._rendered_content = None
    
    def on_mount(self) -> None:
        """Render content when mounted"""
        if self._content:
            self.render_markdown(self._content)
    
    async def update_content(self, content: str) -> None:
        """Update the displayed content"""
        self._content = content
        self.render_markdown(content)
    
    def render_markdown(self, content: str) -> None:
        """Render markdown content with rich formatting"""
        # Clear existing content
        self.remove_children()
        
        # Parse and render markdown
        try:
            # Use Rich's Markdown renderer
            md = Markdown(content, code_theme="monokai", hyperlinks=True)
            self.mount(Static(md))
            
        except Exception as e:
            # Fallback to plain text if markdown parsing fails
            error_text = Text()
            error_text.append("Error rendering markdown:\n", style="bold red")
            error_text.append(str(e), style="red")
            error_text.append("\n\nRaw content:\n", style="bold yellow")
            error_text.append(content)
            self.mount(Static(error_text))
    
    def render_sections(self, content: str) -> None:
        """
        Alternative rendering method that breaks content into sections
        Useful for very large documents
        """
        # Split by headers
        sections = re.split(r'^(#{1,6}\s+.+)$', content, flags=re.MULTILINE)
        
        for i, section in enumerate(sections):
            if not section.strip():
                continue
            
            # Check if it's a header
            if section.startswith('#'):
                level = len(section) - len(section.lstrip('#'))
                title = section.lstrip('#').strip()
                
                # Create styled header
                header_text = Text()
                header_text.append("  " * (level - 1))  # Indent based on level
                header_text.append(title, style=f"bold #A855F7")
                
                self.mount(Static(header_text, classes="markdown-heading"))
            else:
                # Regular content
                md = Markdown(section, code_theme="monokai")
                self.mount(Static(md))
    
    def extract_code_blocks(self, content: str) -> list:
        """Extract code blocks for syntax highlighting"""
        pattern = r'```(\w+)?\n(.*?)```'
        matches = re.findall(pattern, content, re.DOTALL)
        return [(lang or "text", code) for lang, code in matches]
    
    def render_code_block(self, code: str, language: str = "python") -> Static:
        """Render a single code block with syntax highlighting"""
        try:
            syntax = Syntax(
                code,
                language,
                theme="monokai",
                line_numbers=True,
                word_wrap=False,
                background_color="#1A1A1A"
            )
            return Static(syntax, classes="markdown-code")
        except Exception:
            # Fallback to plain text
            return Static(code, classes="markdown-code")
    
    def render_table(self, rows: list) -> Static:
        """Render a markdown table"""
        if not rows:
            return Static("")
        
        table = Table(
            show_header=True,
            header_style="bold #A855F7",
            border_style="#27272A",
            box=None
        )
        
        # Add columns from first row
        for cell in rows[0]:
            table.add_column(cell.strip())
        
        # Add data rows
        for row in rows[1:]:
            table.add_row(*[cell.strip() for cell in row])
        
        return Static(table, classes="markdown-table")
    
    def scroll_to_top(self) -> None:
        """Scroll to the top of the document"""
        self.scroll_home(animate=True)
    
    def scroll_to_bottom(self) -> None:
        """Scroll to the bottom of the document"""
        self.scroll_end(animate=True)
    
    def search(self, query: str) -> list:
        """Search for text in the document"""
        # TODO: Implement search functionality
        # Return list of line numbers where query is found
        pass
    
    def get_content(self) -> str:
        """Get the raw content"""
        return self._content

# Made with Bob
