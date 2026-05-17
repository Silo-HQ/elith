# Changelog

All notable changes to Elith will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Auto-update check command (planned)
- Delta updates for faster updates (planned)

## [0.1.0] - 2026-05-17

### Added
- Initial release of Elith
- Multi-provider support (Claude, OpenRouter, LMStudio, Bob)
- Interactive TUI with real-time streaming
- Backend service with FastAPI
- Service management commands (`elith service start/stop/status/restart`)
- Auto-start backend functionality
- Multiple installation methods:
  - Homebrew formula
  - npm/pnpm/bun global package
  - Curl installer
  - Manual installation
- Context engine for repo scanning
- Obsidian vault integration
- 12 core skills:
  - read_file
  - write_file
  - list_files
  - search_code
  - git_diff
  - git_commit
  - run_tests
  - find_references
  - analyze_dependencies
  - explain_function
  - install_package
  - read_logs
- Session logging to `bob-reports/`
- Configuration management via `~/.elith/config.toml`
- Health check endpoint at `/health`
- SSE streaming at `/api/stream/{session_id}`

### Changed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- API key management via environment variables
- Secure credential storage in config

## Version History

- **0.1.0** (2026-05-17) - Initial release

---

## Release Notes Format

Each release should include:

### Added
- New features
- New capabilities
- New commands

### Changed
- Changes to existing functionality
- Performance improvements
- UI/UX updates

### Deprecated
- Features marked for removal
- Old APIs being phased out

### Removed
- Deleted features
- Removed dependencies

### Fixed
- Bug fixes
- Error corrections
- Documentation fixes

### Security
- Security patches
- Vulnerability fixes
- Dependency updates

---

## Upcoming Releases

### [0.2.0] - Planned

**Focus**: Enhanced Provider Support & Auto-Updates

#### Planned Features
- OpenAI provider support
- Gemini provider support
- Ollama provider support
- Auto-update check command
- Auto-update install command
- Version comparison in TUI
- Update notifications
- WebSocket streaming (alternative to SSE)
- Improved error messages
- Better logging system

#### Breaking Changes
- None (backward compatible)

### [1.0.0] - Planned

**Focus**: Production Ready & Stability

#### Planned Features
- Stable API
- Complete documentation
- Migration tools
- Rollback support
- Delta updates
- systemd/launchd integration
- Windows support
- Plugin system
- Custom skill creation
- Multi-language support

#### Breaking Changes
- Config format v2 (migration provided)
- API endpoint restructure (migration provided)
- Deprecated features removed

---

## Contributing to Changelog

When making changes:

1. Add entry under `[Unreleased]` section
2. Use appropriate category (Added/Changed/Fixed/etc.)
3. Write clear, user-focused descriptions
4. Link to issues/PRs when relevant
5. Before release, move entries to new version section

Example:
```markdown
## [Unreleased]

### Added
- New `elith update` command for auto-updates (#123)
- Support for custom skill plugins (#124)

### Fixed
- Backend crash on port conflict (#125)
- Memory leak in context engine (#126)
```

---

## Links

- [GitHub Repository](https://github.com/Silo-HQ/elith)
- [Documentation](https://elith.silohq.tech/docs)
- [Issue Tracker](https://github.com/Silo-HQ/elith/issues)
- [Release Notes](https://github.com/Silo-HQ/elith/releases)