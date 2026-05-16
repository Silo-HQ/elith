import os
import subprocess

def run_command(cmd):
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    else:
        print(result.stdout)
    return result.returncode

def get_commit_message(file_path, is_deletion=False):
    basename = os.path.basename(file_path)
    if is_deletion:
        if "bob-reports" in file_path:
            return f"chore(bob): remove old session report {basename}"
        return f"chore: remove {basename}"
    
    if "tui-ts/src" in file_path:
        return f"feat(tui): add {basename} to TypeScript TUI implementation"
    if "tui/components" in file_path:
        return f"feat(tui): add {basename} component"
    if "docs/_session" in file_path:
        return f"docs(bob): add session report {basename}"
    if file_path.startswith("bob-reports/") and file_path.endswith(".png"):
        return f"docs(bob): add screenshot {basename}"
    if file_path.startswith("bob-reports/") and file_path.endswith(".md"):
        return f"docs(bob): add task report {basename}"
    if file_path.endswith(".md"):
        return f"docs: add {basename} documentation"
    if file_path == "run_hermes_tui.sh":
        return "feat(tui): add hermes tui runner script"
    if "tui-ts" in file_path:
        return f"chore(tui): add {basename} for TypeScript TUI"
    
    return f"chore: add {basename}"

def main():
    # Get modified/deleted files
    result = subprocess.run(["git", "ls-files", "--deleted", "--modified"], capture_output=True, text=True)
    modified_files = result.stdout.splitlines()

    # Get untracked files
    result = subprocess.run(["git", "ls-files", "--others", "--exclude-standard"], capture_output=True, text=True)
    untracked_files = result.stdout.splitlines()

    # Combine and deduplicate
    all_files = sorted(list(set(modified_files + untracked_files)))

    # Identify deleted files
    result = subprocess.run(["git", "ls-files", "--deleted"], capture_output=True, text=True)
    deleted_files = set(result.stdout.splitlines())

    for file_path in all_files:
        if not file_path:
            continue
        
        is_deletion = file_path in deleted_files
        msg = get_commit_message(file_path, is_deletion)
        
        if is_deletion:
            run_command(["git", "rm", file_path])
        else:
            run_command(["git", "add", file_path])
        
        run_command(["git", "commit", "-m", msg])

    # Push
    run_command(["git", "push", "origin", "feature/main/tui"])

if __name__ == "__main__":
    main()
