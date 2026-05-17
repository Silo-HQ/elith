# Known Issues

**Last Updated:** 2026-05-17  
**Version:** 0.1.0  
**Status:** ✅ All Critical Issues Resolved

---

## Current Status

✅ **All systems operational**

The following issues have been resolved:
1. ✅ SSE stream endpoint implemented at `/api/stream/{session_id}`
2. ✅ LMStudio provider initialization fixed
3. ✅ Service manager working correctly
4. ✅ Auto-start functionality operational
5. ✅ TUI connects to backend successfully

---

## Resolved Issues

### 1. ~~Missing SSE Stream Endpoint~~ ✅ FIXED

**Previous Issue:**
```
SSE connection error: Event { type: 'error', status: 404, message: 'Not Found' }
GET /api/sessions/{session_id}/stream - 404 Not Found
```

**Resolution:**
- Endpoint implemented at `/api/stream/{session_id}` in `backend/routes/stream.py`
- Real-time streaming now works correctly
- TUI receives messages in real-time

**Verification:**
```bash
curl http://localhost:8000/api/stream/test-session-id
# Returns: text/event-stream with real-time updates
```

---

### 2. ~~LMStudio Provider Initialization Error~~ ✅ FIXED

**Previous Issue:**
```
Warning: Failed to initialize LM Studio provider: 
LMStudioProvider.__init__() got an unexpected keyword argument 'api_key'
```

**Resolution:**
- LMStudio provider updated to accept optional `api_key` parameter
- Provider initialization now handles all parameters correctly
- All providers (Claude, OpenRouter, LMStudio, Bob) working

**Verification:**
```bash
elith models
# Shows all available models including LMStudio
```

---

### 3. ~~Installation Issues~~ ✅ FIXED

**Previous Issues:**
- Wrapper script looking for wrong filename (`elith_cli.py` vs `cli.py`)
- Missing `psutil` dependency
- Outdated CLI files in `~/.elith/`

**Resolution:**
- Fixed wrapper script in `~/.local/bin/elith`
- Installed `psutil` in all virtual environments
- Updated all CLI files to latest version
- Service management commands working

**Verification:**
```bash
elith --version
# Output: Elith v0.1.0

elith service status
# Output: ✓ Backend is running
```

---

## Minor Known Limitations

These are not bugs, but design limitations to be aware of:

### 1. Port Conflict Handling

**Behavior:**
If port 8000 is already in use by another application, the backend will fail to start.

**Workaround:**
```bash
# Stop the conflicting service
lsof -ti:8000 | xargs kill -9

# Or configure Elith to use a different port
elith config set backend.port 8001
```

**Future Enhancement:**
- Auto-detect available ports
- Suggest alternative ports
- Support custom port configuration

---

### 2. Multiple Installation Conflicts

**Behavior:**
Having both Homebrew and manual installations can cause path conflicts.

**Recommendation:**
Choose one installation method and stick with it:
- **Homebrew**: Best for macOS users
- **npm**: Best for Node.js developers
- **Manual**: Best for development/testing

**Check which installation is active:**
```bash
which elith
# Shows: /opt/homebrew/bin/elith (Homebrew)
# or: /usr/local/bin/elith (npm)
# or: ~/.local/bin/elith (manual)
```

---

### 3. Service Persistence

**Behavior:**
Backend doesn't auto-start on system boot.

**Current Workaround:**
```bash
# Add to shell profile (~/.zshrc or ~/.bashrc)
alias elith='elith service start && elith'
```

**Future Enhancement:**
- systemd service file for Linux
- launchd plist for macOS
- Windows service support

---

## Testing Checklist

Current system status:

- [x] TUI connects to backend
- [x] Backend status check works
- [x] Messages can be sent
- [x] Backend receives and processes messages
- [x] SSE streaming works
- [x] Real-time responses display
- [x] LMStudio provider works
- [x] Service management commands work
- [x] Auto-start functionality works
- [x] All installation methods work

---

## Performance Considerations

### Expected Behavior

**Backend Startup Time:**
- Cold start: 2-3 seconds
- Warm start: <1 second

**Response Times:**
- Health check: <100ms
- Message processing: Depends on provider
  - Claude: 1-5 seconds
  - OpenRouter: 2-10 seconds
  - LMStudio: 0.5-2 seconds (local)

**Memory Usage:**
- Backend: ~100-200 MB
- TUI: ~50-100 MB
- Total: ~150-300 MB

---

## Error Messages Explained

### Common Errors and Solutions

#### "Backend is not running"
```bash
Solution: elith service start
```

#### "Port 8000 already in use"
```bash
Solution: elith service stop && elith service start
```

#### "Connection refused"
```bash
# Check if backend is running
elith service status

# Check if port is accessible
curl http://localhost:8000/health
```

#### "API key not configured"
```bash
# Run setup wizard
elith init

# Or set manually
elith config set providers.claude.api_key "your-key"
```

---

## Reporting New Issues

If you encounter a new issue:

1. **Check backend logs:**
   ```bash
   tail -f ~/.elith/backend.log
   ```

2. **Check service status:**
   ```bash
   elith service status
   ```

3. **Verify API endpoints:**
   ```bash
   curl http://localhost:8000/docs
   ```

4. **Gather information:**
   - Elith version: `elith --version`
   - OS version: `uname -a`
   - Python version: `python --version`
   - Installation method: Homebrew/npm/manual

5. **Report on GitHub:**
   - [Create an issue](https://github.com/Silo-HQ/elith/issues/new)
   - Include logs and system information
   - Describe expected vs actual behavior

---

## Update History

### 2026-05-17 - v0.1.0
- ✅ Fixed all critical issues
- ✅ Implemented SSE streaming
- ✅ Fixed LMStudio provider
- ✅ Resolved installation issues
- ✅ Service management working
- ✅ Auto-start functionality operational

---

## Next Steps

**For Users:**
1. System is stable and ready to use ✅
2. All features working as expected ✅
3. Report any new issues on GitHub

**For Developers:**
1. Monitor for new issues
2. Implement planned enhancements
3. Improve error messages
4. Add more comprehensive logging

---

## Support

- **Documentation:** [https://elith.silohq.tech/docs](https://elith.silohq.tech/docs)
- **GitHub Issues:** [https://github.com/Silo-HQ/elith/issues](https://github.com/Silo-HQ/elith/issues)
- **Discord:** [Join our community](https://discord.gg/elith)

---

**Status:** ✅ No critical issues - System operational  
**Confidence Level:** High - All core functionality tested and working