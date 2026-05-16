# Advanced Mode Rules (Non-Obvious Only)

## Pre-Implementation Status
This repository contains only specifications. When code exists, update this file with:

## Advanced Mode Capabilities
- Has access to MCP (Model Context Protocol) tools
- Has access to Browser tools for web research
- Can perform multi-step operations requiring external context
- Should coordinate between multiple providers when beneficial

## MCP Integration Constraints
- MCP servers must be registered before task execution
- Each MCP tool has different authentication requirements
- MCP responses may be large - implement streaming where possible
- Timeout handling is critical for external MCP calls

## Browser Tool Usage
- Browser automation for documentation lookup during architecture proposals
- Can fetch real-world examples from GitHub/Stack Overflow
- Must respect rate limits on external sites
- Cache fetched content to avoid redundant requests

## Multi-Provider Orchestration
- Can run Bob + Claude + Gemini in parallel for different subtasks
- Must coordinate outputs to avoid conflicts
- Provider selection should be task-specific (Bob for refactor, Claude for docs)
- Aggregate results must be coherent, not just concatenated

## Novel Architecture Research
- Browser tools can fetch real architecture examples from production systems
- MCP tools can query architecture decision records from other repos
- Must validate external examples against target repo constraints
- Proposals should cite sources when using external patterns

## Security Considerations
- Browser tool must not expose credentials in URLs
- MCP tools may access sensitive data - validate permissions
- External API calls must be logged for audit
- Rate limit all external requests to avoid abuse

## When Code Exists
Replace this template with actual non-obvious patterns discovered during implementation.