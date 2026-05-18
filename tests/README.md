# Tests

This directory contains all test files for the Elith project.

## Running Tests

### Python Tests
Run all Python tests:
```bash
python -m pytest tests/
```

Run individual test files:
```bash
python -m pytest tests/test_context_engine.py
python -m pytest tests/test_detection.py
python -m pytest tests/test_history.py
python -m pytest tests/test_wizard.py
```

### Shell Tests
Run shell tests:
```bash
bash tests/test_cli.sh
bash tests/test_multi_agent.sh
bash tests/test_opencode_compatibility.sh
```

## Test Files

- `test_context_engine.py` - Tests for context engine functionality
- `test_detection.py` - Tests for detection mechanisms
- `test_history.py` - Tests for session history
- `test_wizard.py` - Tests for setup wizard
- `test_cli.sh` - CLI integration tests
- `test_multi_agent.sh` - Multi-agent system tests
- `test_opencode_compatibility.sh` - OpenCode compatibility tests