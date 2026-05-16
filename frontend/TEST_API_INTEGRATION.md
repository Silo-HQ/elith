# Frontend API Integration Testing

## Quick Test Commands (Browser Console)

Open http://localhost:3000 and paste these commands in the browser console:

### Test 1: Check API Connection
```javascript
// Test basic connectivity
fetch('/api/models')
  .then(r => r.json())
  .then(data => {
    console.log('✅ API Connected');
    console.log('Available models:', data.available);
    console.log('Configured models:', data.configured);
  })
  .catch(err => console.error('❌ API Error:', err));
```

### Test 2: Test Repository Scan
```javascript
// Test scan endpoint
fetch('/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repo_path: '.',
    vault_path: './obsidian-template'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Scan Complete');
  console.log('Files loaded:', data.loaded_files.length, '/', data.total_files);
  console.log('Vault notes:', data.vault_notes.length);
  console.log('Tokens saved:', data.tokens_saved);
  console.log('Sample files:', data.loaded_files.slice(0, 5));
})
.catch(err => console.error('❌ Scan Error:', err));
```

### Test 3: Test Execute + SSE Streaming
```javascript
// Test execution and streaming
async function testExecution() {
  try {
    // Start execution
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'lmstudio',
        operation: 'explain',
        repo_path: '.',
        prompt: 'Explain the main architecture of this project'
      })
    });
    
    const { session_id } = await response.json();
    console.log('✅ Execution started, session:', session_id);
    
    // Stream output
    const eventSource = new EventSource(`/api/stream/${session_id}`);
    
    eventSource.onopen = () => {
      console.log('✅ SSE Connected');
    };
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 Stream event:', data.type);
      
      if (data.type === 'output') {
        console.log('  Model:', data.model);
        console.log('  Content:', data.content);
      } else if (data.type === 'done') {
        console.log('✅ Execution complete');
        eventSource.close();
      } else if (data.type === 'error') {
        console.error('❌ Execution error:', data.error);
        eventSource.close();
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('❌ SSE Error:', error);
      eventSource.close();
    };
    
    // Store session_id for later
    window.testSessionId = session_id;
    console.log('Session ID stored in window.testSessionId');
    
  } catch (err) {
    console.error('❌ Execution Error:', err);
  }
}

// Run the test
testExecution();
```

### Test 4: Test Results Fetch
```javascript
// Fetch results (use session_id from previous test)
if (window.testSessionId) {
  fetch(`/api/results/${window.testSessionId}`)
    .then(r => r.json())
    .then(data => {
      console.log('✅ Results fetched');
      console.log('Files changed:', data.files_changed?.length || 0);
      console.log('Models used:', data.models_used?.length || 0);
      console.log('Time taken:', data.time_taken);
      console.log('Bob report:', data.bob_report_path);
    })
    .catch(err => console.error('❌ Results Error:', err));
} else {
  console.log('⚠️ No session ID available. Run Test 3 first.');
}
```

### Test 5: Test All Operations
```javascript
// Test all 4 operations
const operations = ['explain', 'architect', 'test-gen', 'refactor'];

async function testAllOperations() {
  for (const op of operations) {
    console.log(`\n🧪 Testing operation: ${op}`);
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'lmstudio',
          operation: op,
          repo_path: '.',
          prompt: `Test ${op} operation`
        })
      });
      
      const { session_id } = await response.json();
      console.log(`✅ ${op}: Session ${session_id} started`);
      
    } catch (err) {
      console.error(`❌ ${op}: Failed -`, err);
    }
    
    // Wait 1 second between operations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testAllOperations();
```

### Test 6: Monitor SSE Connection
```javascript
// Monitor SSE connection health
function monitorSSE(sessionId) {
  const eventSource = new EventSource(`/api/stream/${sessionId}`);
  let messageCount = 0;
  let startTime = Date.now();
  
  eventSource.onopen = () => {
    console.log('✅ SSE Connection opened');
  };
  
  eventSource.onmessage = (event) => {
    messageCount++;
    const data = JSON.parse(event.data);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`📨 Message ${messageCount} (${elapsed}s):`, data.type);
    
    if (data.type === 'done') {
      console.log(`✅ Stream complete: ${messageCount} messages in ${elapsed}s`);
      eventSource.close();
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('❌ SSE Error after', messageCount, 'messages');
    eventSource.close();
  };
  
  return eventSource;
}

// Usage: monitorSSE('your-session-id')
```

---

## UI Testing Checklist

### Landing Page
- [ ] Enter repository path
- [ ] Toggle Obsidian vault input
- [ ] Select/deselect models (Bob always active)
- [ ] Click "Start Session"
- [ ] Verify loading indicator appears
- [ ] Verify navigation to workspace on success
- [ ] Verify error message on failure

### Workspace Page
- [ ] Context preview shows loaded files
- [ ] File count matches scan results
- [ ] Vault notes displayed (if vault provided)
- [ ] Token savings shown

### Execution Page
- [ ] Auto-starts execution on mount
- [ ] Shows active models
- [ ] Live output streams in real-time
- [ ] Progress bar updates
- [ ] Auto-navigates to results when done

### Results Page
- [ ] Shows files changed
- [ ] Shows "why" explanation
- [ ] Shows models used with roles
- [ ] Shows context efficiency metrics
- [ ] Bob report path displayed (if available)
- [ ] "New Task" button works

### Proposals Page
- [ ] Shows architecture proposals (if architect operation)
- [ ] Proposal cards display correctly
- [ ] "Implement" button works

### Settings Page
- [ ] Shows available models
- [ ] Shows configured models with green indicator
- [ ] API key inputs work
- [ ] Save button works
- [ ] Success message appears

---

## Expected Behavior

### Successful Flow
1. Landing → Scan API called → Context loaded
2. Workspace → Context displayed
3. Execution → SSE streaming → Live output
4. Results → Results fetched → Metrics shown

### Error Scenarios
1. Invalid repo path → Error message on Landing
2. API down → Error message with retry option
3. SSE connection lost → Error event, graceful close
4. Missing session ID → "No results" message

---

## Performance Expectations

- Scan: < 1 second for small repos
- Execute: < 100ms to start
- SSE: < 10ms latency per event
- Results: < 50ms to fetch

---

## Browser Console Shortcuts

```javascript
// Quick access to API service
const api = {
  scan: (path) => fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_path: path })
  }).then(r => r.json()),
  
  models: () => fetch('/api/models').then(r => r.json()),
  
  execute: (model, op, path) => fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, operation: op, repo_path: path })
  }).then(r => r.json())
};

// Usage:
// api.scan('.').then(console.log)
// api.models().then(console.log)
// api.execute('lmstudio', 'explain', '.').then(console.log)
```

---

*Use these tests to verify the frontend-backend integration is working correctly.*