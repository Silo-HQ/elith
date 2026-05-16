# LM Studio Integration Guide

## Overview

Elith now supports LM Studio for running local LLMs with repository skills. LM Studio provides an OpenAI-compatible API that works seamlessly with Elith's skill system.

## Prerequisites

1. **Install LM Studio**
   - Download from: https://lmstudio.ai/
   - Install and launch the application

2. **Load a Model**
   - In LM Studio, go to the "Discover" tab
   - Download a model that supports tool calling (recommended):
     - `mistral-nemo-instruct` (12B)
     - `llama-3.1-8b-instruct`
     - `hermes-2-pro-mistral` (7B)
   - Load the model in the "Chat" tab

3. **Start Local Server**
   - In LM Studio, go to "Local Server" tab
   - Click "Start Server"
   - Default endpoint: `http://localhost:1234`
   - Verify it's running (green indicator)

## Usage

### Basic Example

```python
from backend.providers.lmstudio_provider import LMStudioProvider

# Initialize provider (no API key needed - runs locally!)
provider = LMStudioProvider(
    repo_path=".",
    base_url="http://localhost:1234/v1",  # Default LM Studio endpoint
    model="local-model"  # LM Studio auto-uses loaded model
)

# Use it like any other provider
for chunk in provider.run("List the files in backend/skills and explain what they do", ""):
    print(chunk, end="", flush=True)
```

### Advanced Configuration

```python
# Custom endpoint (if you changed LM Studio port)
provider = LMStudioProvider(
    repo_path="/path/to/your/repo",
    base_url="http://localhost:5000/v1",
    model="mistral-nemo-instruct"
)

# Complex task with context
context = "This is a Python project using FastAPI"
task = "Read the main.py file and suggest improvements"

for chunk in provider.run(task, context):
    print(chunk, end="", flush=True)
```

## Features

### ✅ Supported
- All 12 Elith repository skills
- Tool calling (function calling)
- Streaming responses
- Local execution (no API costs!)
- Privacy (data never leaves your machine)

### 🔧 Configuration
- **Endpoint**: Default `http://localhost:1234/v1`
- **Model**: Auto-selected from loaded model in LM Studio
- **Timeout**: 120 seconds per request
- **Max Iterations**: 10 tool calling loops (prevents infinite loops)

## Recommended Models

### Best for Tool Calling
1. **Mistral Nemo Instruct** (12B)
   - Excellent tool calling support
   - Good balance of speed and quality
   - Recommended for most use cases

2. **Llama 3.1 8B Instruct**
   - Native tool calling support
   - Fast inference
   - Good for quick tasks

3. **Hermes 2 Pro Mistral** (7B)
   - Optimized for function calling
   - Lightweight
   - Good for resource-constrained systems

### Model Settings in LM Studio
- **Temperature**: 0.7 (default)
- **Max Tokens**: 4096
- **Context Length**: 8192+ recommended
- **GPU Layers**: Max your GPU can handle

## Example Tasks

### 1. Code Analysis
```python
provider = LMStudioProvider(".")
for chunk in provider.run("Analyze the skills in backend/skills/ and summarize their purposes", ""):
    print(chunk, end="", flush=True)
```

### 2. Code Search
```python
for chunk in provider.run("Find all classes that inherit from BaseSkill", ""):
    print(chunk, end="", flush=True)
```

### 3. Git Operations
```python
for chunk in provider.run("Show me what changed in the last commit", ""):
    print(chunk, end="", flush=True)
```

### 4. Testing
```python
for chunk in provider.run("Run the tests and tell me if they pass", ""):
    print(chunk, end="", flush=True)
```

## Troubleshooting

### "Cannot connect to LM Studio"
- **Solution**: Make sure LM Studio is running and the local server is started
- Check the endpoint: `http://localhost:1234/v1/models` should return model info

### "No response from LM Studio"
- **Solution**: Ensure a model is loaded in LM Studio
- Try reloading the model
- Check LM Studio logs for errors

### "Tool calling not working"
- **Solution**: Use a model that supports tool calling (see recommended models)
- Update to latest LM Studio version
- Check model settings (temperature, max tokens)

### Slow responses
- **Solution**: 
  - Increase GPU layers in LM Studio settings
  - Use a smaller model
  - Reduce context length
  - Close other GPU-intensive applications

## Comparison: LM Studio vs Cloud Providers

| Feature | LM Studio | Claude | OpenAI |
|---------|-----------|--------|--------|
| Cost | Free | Pay per token | Pay per token |
| Privacy | 100% local | Cloud | Cloud |
| Speed | GPU-dependent | Fast | Fast |
| Quality | Model-dependent | Excellent | Excellent |
| Setup | Download model | API key | API key |
| Internet | Not required | Required | Required |

## Performance Tips

1. **Use GPU acceleration**
   - Enable in LM Studio settings
   - Maximize GPU layers

2. **Choose appropriate model size**
   - 7B models: Fast, good for simple tasks
   - 12B models: Balanced, recommended
   - 30B+ models: Best quality, slower

3. **Optimize context**
   - Keep prompts focused
   - Use specific file paths
   - Limit recursive operations

4. **Monitor resources**
   - Watch GPU memory usage
   - Close unnecessary applications
   - Consider model quantization (Q4, Q5)

## Integration with Elith

LM Studio provider works seamlessly with all Elith features:

```python
# Works with model router
from backend.router.model_router import ModelRouter

router = ModelRouter(".", {
    "LMSTUDIO_ENABLED": True,
    "LMSTUDIO_URL": "http://localhost:1234/v1"
})

# Use like any provider
for chunk in router.run("lmstudio", "Explain this codebase", ""):
    print(chunk, end="", flush=True)
```

## Benefits of Local LLMs

1. **Privacy**: Code never leaves your machine
2. **Cost**: No API fees
3. **Offline**: Works without internet
4. **Control**: Full control over model and settings
5. **Experimentation**: Try different models freely

## Next Steps

1. Install LM Studio
2. Download a recommended model
3. Start the local server
4. Run the example code
5. Explore with your own repositories!

---

*LM Studio Integration - Elith - IBM Bob Hackathon 2026*