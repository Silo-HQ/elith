# backend/skills/__init__.py

"""
Elith Skills Registry

All 12 repository skills that can be exposed to LLMs as tools.
"""

from .read_file import ReadFileSkill
from .write_file import WriteFileSkill
from .list_files import ListFilesSkill
from .search_code import SearchCodeSkill
from .git_diff import GitDiffSkill
from .git_commit import GitCommitSkill
from .run_tests import RunTestsSkill
from .find_references import FindReferencesSkill
from .analyze_dependencies import AnalyzeDependenciesSkill
from .explain_function import ExplainFunctionSkill
from .install_package import InstallPackageSkill
from .read_logs import ReadLogsSkill

# All skills available to providers
ALL_SKILLS = [
    ReadFileSkill(),
    WriteFileSkill(),
    ListFilesSkill(),
    SearchCodeSkill(),
    GitDiffSkill(),
    GitCommitSkill(),
    RunTestsSkill(),
    FindReferencesSkill(),
    AnalyzeDependenciesSkill(),
    ExplainFunctionSkill(),
    InstallPackageSkill(),
    ReadLogsSkill(),
]

# Skill lookup map
SKILL_MAP = {s.name: s for s in ALL_SKILLS}

__all__ = [
    'ALL_SKILLS',
    'SKILL_MAP',
    'ReadFileSkill',
    'WriteFileSkill',
    'ListFilesSkill',
    'SearchCodeSkill',
    'GitDiffSkill',
    'GitCommitSkill',
    'RunTestsSkill',
    'FindReferencesSkill',
    'AnalyzeDependenciesSkill',
    'ExplainFunctionSkill',
    'InstallPackageSkill',
    'ReadLogsSkill',
]

# Made with Bob
