**User:**

<task>Command 'init' (see below for command content)
</task>

<command name="init">
Description: Analyze codebase and create concise AGENTS.md files for AI assistants

<task>
Please analyze this codebase and create an AGENTS.md file containing:
1. Build/lint/test commands - especially for running a single test
2. Code style guidelines including imports, formatting, types, naming conventions, error handling, etc.
</task>

<initialization>
  <purpose>
    Create (or update) a concise AGENTS.md file that enables immediate productivity for AI assistants.
    Focus ONLY on project-specific, non-obvious information that you had to discover by reading files.
    
    CRITICAL: Only include information that is:
    - Non-obvious (couldn't be guessed from standard practices)
    - Project-specific (not generic to the framework/language)
    - Discovered by reading files (config files, code patterns, custom utilities)
    - Essential for avoiding mistakes or following project conventions
    
    Usage notes:
    - The file you create will be given to agentic coding agents (such as yourself) that operate in this repository
    - Keep the main AGENTS.md concise - aim for about 20 lines, but use more if the project complexity requires it
    - If there's already an AGENTS.md, improve it
    - If there are Claude Code rules (in CLAUDE.md), Cursor rules (in .cursor/rules/ or .cursorrules), or Copilot rules (in .github/copilot-instructions.md), make sure to include them
    - Be sure to prefix the file with: "# AGENTS.md\n\nThis file provides guidance to agents when working with code in this repository."
  </purpose>
  
  <todo_list_creation>
    If the update_todo_list tool is available, create a todo list with these focused analysis steps:
    
    1. Check for existing AGENTS.md files
       CRITICAL - Check these EXACT paths IN THE PROJECT ROOT:
       - AGENTS.md (in project root directory)
       - .bob/rules-code/AGENTS.md (relative to project root)
       - .bob/rules-advanced/AGENTS.md (relative to project root)
       - .bob/rules-ask/AGENTS.md (relative to project root)
       - .bob/rules-plan/AGENTS.md (relative to project root)
       
       IMPORTANT: All paths are relative to the project/workspace root, NOT system root!
       
       If ANY of these exist:
       - Read them thoroughly
       - CRITICALLY EVALUATE: Remove ALL obvious information
       - DELETE entries that are standard practice or framework defaults
       - REMOVE anything that could be guessed without reading files
       - Only KEEP truly non-obvious, project-specific discoveries
       - Then add any new non-obvious patterns you discover
       
       Also check for other AI assistant rules:
       - .cursorrules, CLAUDE.md, .roorules
       - .cursor/rules/, .github/copilot-instructions.md
    
    2. Identify stack
       - Language, framework, build tools
       - Package manager and dependencies
    
    3. Extract commands
       - Build, test, lint, run
       - Critical directory-specific commands
    
    4. Map core architecture
       - Main components and flow
       - Key entry points
    
    5. Document critical patterns
       - Project-specific utilities (that you discovered by reading code)
       - Non-standard approaches (that differ from typical patterns)
       - Custom conventions (that aren't obvious from file structure)
    
    6. Extract code style
       - From config files only
       - Key conventions
    
    7. Testing specifics
       - Framework and run commands
       - Directory requirements
    
    8. Compile/Update AGENTS.md files
       - If files exist: AGGRESSIVELY clean them up
         * DELETE all obvious information (even if it was there before)
         * REMOVE standard practices, framework defaults, common patterns
         * STRIP OUT anything derivable from file structure or names
         * ONLY KEEP truly non-obvious discoveries
         * Then add newly discovered non-obvious patterns
         * Result should be SHORTER and MORE FOCUSED than before
       - If creating new: Follow the non-obvious-only principle
       - Create mode-specific files in .bob/rules-*/ directories (IN PROJECT ROOT)
       
    Note: If update_todo_list is not available, proceed with the analysis workflow directly without creating a todo list.
  </todo_list_creation>
</initialization>

<analysis_workflow>
  Follow the comprehensive analysis workflow to:
  
  1. **Discovery Phase**:
     CRITICAL - First check for existing AGENTS.md files at these EXACT locations IN PROJECT ROOT:
     - AGENTS.md (in project/workspace root)
     - .bob/rules-code/AGENTS.md (relative to project root)
     - .bob/rules-advanced/AGENTS.md (relative to project root)
     - .bob/rules-ask/AGENTS.md (relative to project root)
     - .bob/rules-plan/AGENTS.md (relative to project root)
     
     IMPORTANT: The .roo folder should be created in the PROJECT ROOT, not system root!
     
     If found, perform CRITICAL analysis:
     - What information is OBVIOUS and must be DELETED?
     - What violates the non-obvious-only principle?
     - What would an experienced developer already know?
     - DELETE first, then consider what to add
     - The file should get SHORTER, not longer
     
     Also find other AI assistant rules and documentation
     
  2. **Project Identification**: Identify language, stack, and build system
  3. **Command Extraction**: Extract and verify essential commands
  4. **Architecture Mapping**: Create visual flow diagrams of core processes
  5. **Component Analysis**: Document key components and their interactions
  6. **Pattern Analysis**: Identify project-specific patterns and conventions
  7. **Code Style Extraction**: Extract formatting and naming conventions
  8. **Security & Performance**: Document critical patterns if relevant
  9. **Testing Discovery**: Understand testing setup and practices
  10. **Example Extraction**: Find real examples from the codebase
</analysis_workflow>

<output_structure>
  <main_file>
    Create or deeply improve AGENTS.md with ONLY non-obvious information:
    
    If AGENTS.md exists:
    - FIRST: Delete ALL obvious information
    - REMOVE: Standard commands, framework defaults, common patterns
    - STRIP: Anything that doesn't require file reading to know
    - EVALUATE: Each line - would an experienced dev be surprised?
    - If not surprised, DELETE IT
    - THEN: Add only truly non-obvious new discoveries
    - Goal: File should be SHORTER and MORE VALUABLE
    
    Content should include:
    - Header: "# AGENTS.md\n\nThis file provides guidance to agents when working with code in this repository."
    - Build/lint/test commands - ONLY if they differ from standard package.json scripts
    - Code style - ONLY project-specific rules not covered by linter configs
    - Custom utilities or patterns discovered by reading the code
    - Non-standard directory structures or file organizations
    - Project-specific conventions that violate typical practices
    - Critical gotchas that would cause errors if not followed
    
    EXCLUDE obvious information like:
    - Standard npm/yarn commands visible in package.json
    - Framework defaults (e.g., "React uses JSX")
    - Common patterns (e.g., "tests go in __tests__ folders")
    - Information derivable from file extensions or directory names
    
    Keep it concise (aim for ~20 lines, but expand as needed for complex projects).
    Include existing AI assistant rules from CLAUDE.md, Cursor rules (.cursor/rules/ or .cursorrules), or Copilot rules (.github/copilot-instructions.md).
  </main_file>
  
  <mode_specific_files>
    Create or deeply improve mode-specific AGENTS.md files IN THE PROJECT ROOT.
    
    CRITICAL: For each of these paths (RELATIVE TO PROJECT ROOT), check if the file exists FIRST:
    - .bob/rules-code/AGENTS.md (create .roo in project root, not system root!)
    - .bob/rules-advanced/AGENTS.md (relative to project root)
    - .bob/rules-ask/AGENTS.md (relative to project root)
    - .bob/rules-plan/AGENTS.md (relative to project root)
    
    IMPORTANT: The .roo directory must be created in the current project/workspace root directory,
    NOT at the system root (/) or home directory. All paths are relative to where the project is located.
    
    If files exist:
    - AGGRESSIVELY DELETE obvious information
    - Remove EVERYTHING that's standard practice
    - Strip out framework defaults and common patterns
    - Each remaining line must be surprising/non-obvious
    - Only then add new non-obvious discoveries
    - Files should become SHORTER, not longer
    
    Example structure (ALL IN PROJECT ROOT):
    ```
    project-root/
    ├── AGENTS.md                    # General project guidance
    ├── .bob/                        # IN PROJECT ROOT, NOT SYSTEM ROOT!
    │   ├── rules-code/
    │   │   └── AGENTS.md           # Code mode specific instructions
    │   ├── rules-advanced/
    │   │   └── AGENTS.md           # Advanced mode specific instructions
    │   ├── rules-ask/
    │   │   └── AGENTS.md           # Ask mode specific instructions
    │   └── rules-plan/
    │       └── AGENTS.md           # Plan mode specific instructions
    ├── src/
    ├── package.json
    └── ... other project files
    ```
    
    .bob/rules-code/AGENTS.md - ONLY non-obvious coding rules discovered by reading files:
    - Custom utilities that replace standard approaches
    - Non-standard patterns unique to this project
    - Hidden dependencies or coupling between components
    - Required import orders or naming conventions not enforced by linters
    - No access to tools like MCP and Browser
    
    Example of non-obvious rules worth documenting:
    ```
    # Project Coding Rules (Non-Obvious Only)
    - Always use safeWriteJson() from src/utils/ instead of JSON.stringify for file writes (prevents corruption)
    - API retry mechanism in src/api/providers/utils/ is mandatory (not optional as it appears)
    - Database queries MUST use the query builder in packages/evals/src/db/queries/ (raw SQL will fail)
    - Provider interface in packages/types/src/ has undocumented required methods
    - Test files must be in same directory as source for vitest to work (not in separate test folder)
    ```
    
    .bob/rules-advanced/AGENTS.md - ONLY non-obvious advanced coding rules discoveries:
    - Custom utilities that replace standard approaches
    - Non-standard patterns unique to this project
    - Hidden dependencies or coupling between components
    - Required import orders or naming conventions not enforced by linters
    - Access to tools like MCP and Browser
    
    Example of non-obvious rules worth documenting:
    ```
    # Project Coding Rules (Non-Obvious Only)
    - Always use safeWriteJson() from src/utils/ instead of JSON.stringify for file writes (prevents corruption)
    - API retry mechanism in src/api/providers/utils/ is mandatory (not optional as it appears)
    - Database queries MUST use the query builder in packages/evals/src/db/queries/ (raw SQL will fail)
    - Provider interface in packages/types/src/ has undocumented required methods
    - Test files must be in same directory as source for vitest to work (not in separate test folder)
    ```
    
    .bob/rules-ask/AGENTS.md - ONLY non-obvious documentation context:
    - Hidden or misnamed documentation
    - Counterintuitive code organization
    - Misleading folder names or structures
    - Important context not evident from file structure
    
    Example of non-obvious documentation rules worth documenting:
    ```
    # Project Documentation Rules (Non-Obvious Only)
    - "src/" contains VSCode extension code, not source for web apps (counterintuitive)
    - Provider examples in src/api/providers/ are the canonical reference (docs are outdated)
    - UI runs in VSCode webview with restrictions (no localStorage, limited APIs)
    - Package.json scripts must be run from specific directories, not root
    - Locales in root are for extension, webview-ui/src/i18n for UI (two separate systems)
    ```
    
    .bob/rules-plan/AGENTS.md - ONLY non-obvious architectural constraints:
    - Hidden coupling between components
    - Undocumented architectural decisions
    - Non-standard patterns that must be followed
    - Performance bottlenecks discovered through investigation
    
    Example of non-obvious architecture rules worth documenting:
    ```
    # Project Architecture Rules (Non-Obvious Only)
    - Providers MUST be stateless - hidden caching layer assumes this
    - Webview and extension communicate through specific IPC channel patterns only
    - Database migrations cannot be rolled back - forward-only by design
    - React hooks required because external state libraries break webview isolation
    - Monorepo packages have circular dependency on types package (intentional)
    ```
  </mode_specific_files>
</output_structure>

<quality_criteria>
  - ONLY include non-obvious information discovered by reading files
  - Exclude anything that could be guessed from standard practices
  - Focus on gotchas, hidden requirements, and counterintuitive patterns
  - Include specific file paths when referencing custom utilities
  - Be extremely concise - if it's obvious, don't include it
  - Every line should prevent a potential mistake or confusion
  - Test: Would an experienced developer be surprised by this information?
  - If updating existing files: DELETE obvious info first, files should get SHORTER
  - Measure success: Is the file more concise and valuable than before?
</quality_criteria>

Remember: The goal is to create documentation that enables AI assistants to be immediately productive in this codebase, focusing on project-specific knowledge that isn't obvious from the code structure alone.
</command>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:22:57.057Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>


# Current Workspace Directory (/Volumes/DataVault/Projects/elith) Files
agent.md
docs/
docs/ELITH_AGENT_SKILLS.md
docs/ELITH_EXECUTION_STRATEGY.md
docs/ELITH_PROJECT_SPEC_backup.md
docs/ELITH_PROJECT_SPEC.md
docs/ELITH_TUI_SPEC.md
docs/ELITH_UX_SPEC.md
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll analyze this codebase to create comprehensive AGENTS.md files. Let me start by gathering information about the project structure and existing documentation.

<update_todo_list>
<todos>
[ ] Check for existing AGENTS.md files in project root and .bob directories
[ ] Identify project stack, language, and build tools
[ ] Analyze documentation files to understand project architecture
[ ] Extract build/test/lint commands from configuration files
[ ] Identify code style patterns and conventions
[ ] Document non-obvious project-specific patterns
[ ] Create/update main AGENTS.md file
[ ] Create/update mode-specific AGENTS.md files in .bob directories
</todos>
</update_todo_list>

<read_file>
<args>
  <file>
    <path>agent.md</path>
  </file>
</args>
</read_file>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:09.859Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.04

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Pending |
| 2 | Identify project stack, language, and build tools | Pending |
| 3 | Analyze documentation files to understand project architecture | Pending |
| 4 | Extract build/test/lint commands from configuration files | Pending |
| 5 | Identify code style patterns and conventions | Pending |
| 6 | Document non-obvious project-specific patterns | Pending |
| 7 | Create/update main AGENTS.md file | Pending |
| 8 | Create/update mode-specific AGENTS.md files in .bob directories | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>agent.md</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 'agent.md'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>agent.md</path>
<content lines="1-528">
  1 | # ELITH — System Agent Configuration
  2 | 
  3 | ## Identity
  4 | 
  5 | Project: Elith
  6 | 
  7 | Tagline:
  8 | Smarter context. Faster shipping.
  9 | 
 10 | Elith is a Bob-centered developer workflow system designed to improve AI-assisted software engineering through:
 11 | 
 12 | - intelligent context selection
 13 | - structured engineering memory
 14 | - repository-aware execution
 15 | - production-oriented code generation
 16 | 
 17 | Elith is NOT another AI coding assistant.
 18 | 
 19 | Elith is a workflow intelligence layer that improves how repository-aware AI systems operate.
 20 | 
 21 | IBM Bob remains the core AI development partner.
 22 | 
 23 | ---
 24 | 
 25 | # Mission
 26 | 
 27 | The mission of Elith is to help developers:
 28 | 
 29 | - reduce context overload
 30 | - reduce AI-generated rework
 31 | - accelerate repository-safe implementation
 32 | - improve software delivery confidence
 33 | - ship faster with cleaner outputs
 34 | 
 35 | Every implementation decision should reinforce:
 36 | - focus
 37 | - clarity
 38 | - workflow intelligence
 39 | - repository quality
 40 | - engineering productivity
 41 | 
 42 | ---
 43 | 
 44 | # Core Product Philosophy
 45 | 
 46 | AI-assisted development fails when:
 47 | - context windows are polluted
 48 | - repositories lack structured memory
 49 | - generated output requires excessive cleanup
 50 | - engineering intent is lost across conversations
 51 | 
 52 | Elith solves this by:
 53 | - treating context quality as a first-class problem
 54 | - selecting only task-relevant project memory
 55 | - routing focused execution into IBM Bob
 56 | - improving repo outcomes instead of only generating code
 57 | 
 58 | Core principle:
 59 | 
 60 | "Only the current task should decide what gets loaded."
 61 | 
 62 | ---
 63 | 
 64 | # Product Structure
 65 | 
 66 | ## Main System
 67 | 
 68 | ### Elith
 69 | Workflow intelligence and context orchestration layer.
 70 | 
 71 | Responsibilities:
 72 | - task routing
 73 | - context selection
 74 | - workflow coordination
 75 | - repository execution preparation
 76 | 
 77 | ---
 78 | 
 79 | ## Memory Layer
 80 | 
 81 | ### Obsidian Project Memory
 82 | 
 83 | Purpose:
 84 | Long-term engineering memory.
 85 | 
 86 | Contains:
 87 | - architecture notes
 88 | - engineering decisions
 89 | - coding standards
 90 | - unresolved issues
 91 | - bug notes
 92 | - module summaries
 93 | - workflow documentation
 94 | - task briefs
 95 | 
 96 | Obsidian must be treated as:
 97 | structured engineering memory.
 98 | 
 99 | Not:
100 | generic vector storage.
101 | 
102 | ---
103 | 
104 | ## Execution Layer
105 | 
106 | ### BobRepo Surgeon
107 | 
108 | Purpose:
109 | Repository execution wrapper around IBM Bob.
110 | 
111 | Responsibilities:
112 | - convert focused task packets into repo operations
113 | - coordinate repository-safe implementation
114 | - reduce unnecessary repository modifications
115 | - improve implementation precision
116 | 
117 | Supported workflow types:
118 | - refactor-module
119 | - generate-tests
120 | - improve-documentation
121 | - harden-service
122 | - explain-architecture
123 | - review-implementation
124 | - reduce-complexity
125 | - generate-api-docs
126 | 
127 | All operations must be:
128 | - scoped
129 | - explainable
130 | - reviewable
131 | - production-oriented
132 | 
133 | Never perform uncontrolled large-scale repository changes.
134 | 
135 | ---
136 | 
137 | ## Core AI Partner
138 | 
139 | ### IBM Bob IDE
140 | 
141 | IBM Bob is the:
142 | - primary repository-aware AI partner
143 | - implementation engine
144 | - explanation engine
145 | - transformation engine
146 | 
147 | Bob responsibilities:
148 | - repo understanding
149 | - safe code modification
150 | - documentation generation
151 | - test generation
152 | - implementation planning
153 | - repository reviews
154 | - architectural reasoning
155 | 
156 | IBM Bob must remain:
157 | - central
158 | - visible
159 | - meaningful
160 | - demonstrable
161 | 
162 | Never present Bob as optional.
163 | 
164 | Elith enhances Bob workflows.
165 | Elith does not replace Bob.
166 | 
167 | ---
168 | 
169 | # Hackathon Alignment
170 | 
171 | The project must visibly demonstrate:
172 | - IBM Bob IDE usage
173 | - repository-aware workflows
174 | - test generation
175 | - documentation generation
176 | - repository understanding
177 | - repetitive workflow reduction
178 | - production-safe improvements
179 | 
180 | The system must align with the IBM Bob Hackathon theme:
181 | 
182 | "Turn idea into impact faster."
183 | 
184 | ---
185 | 
186 | # Demo Philosophy
187 | 
188 | The demo should immediately communicate:
189 | 
190 | less context → better execution → faster shipping
191 | 
192 | The audience must clearly see:
193 | - context reduction
194 | - workflow orchestration
195 | - repository-aware execution
196 | - visible engineering outcomes
197 | 
198 | ---
199 | 
200 | # Recommended Demo Flow
201 | 
202 | 1. Open a messy or partially documented repository
203 | 2. Show Obsidian engineering memory
204 | 3. Display architecture notes and unresolved issues
205 | 4. Select a real engineering task
206 | 5. Generate focused context packet
207 | 6. Route task into BobRepo Surgeon
208 | 7. Use IBM Bob IDE for repository execution
209 | 8. Generate tests/docs/refactors
210 | 9. Show clean repository improvements
211 | 10. Export Bob task sessions as proof
212 | 
213 | The "smarter" aspect must be visible through:
214 | context reduction.
215 | 
216 | The "faster" aspect must be visible through:
217 | reduced cleanup and focused repository execution.
218 | 
219 | ---
220 | 
221 | # Engineering Priorities
222 | 
223 | Priority order:
224 | 1. visible workflow intelligence
225 | 2. focused context orchestration
226 | 3. repository-safe execution
227 | 4. demo clarity
228 | 5. maintainability
229 | 6. performance
230 | 7. scalability
231 | 
232 | Avoid:
233 | - unnecessary infrastructure
234 | - speculative systems
235 | - overbuilt architecture
236 | - fake autonomous behavior
237 | 
238 | Hackathon success depends on:
239 | clarity and execution quality.
240 | 
241 | ---
242 | 
243 | # MVP Scope Rules
244 | 
245 | The MVP should focus ONLY on:
246 | - Obsidian integration
247 | - context selection
248 | - task packet generation
249 | - Bob workflow triggering
250 | - visible repository improvements
251 | 
252 | Preferred visible outcomes:
253 | - generated tests
254 | - improved docs
255 | - safer refactors
256 | - architecture explanations
257 | - repository cleanup
258 | 
259 | Avoid:
260 | - building a full autonomous platform
261 | - excessive orchestration complexity
262 | - enterprise-scale infrastructure
263 | - unnecessary agent systems
264 | 
265 | A compact and convincing workflow is preferred over a large unfinished platform.
266 | 
267 | ---
268 | 
269 | # Context Management Rules
270 | 
271 | Context is expensive.
272 | 
273 | Always:
274 | - minimize irrelevant information
275 | - maximize relevance density
276 | - reduce token waste
277 | - improve reasoning precision
278 | 
279 | Never:
280 | - inject full repositories unnecessarily
281 | - overload active context windows
282 | - send unrelated engineering history
283 | 
284 | Prefer:
285 | focused task packets.
286 | 
287 | ---
288 | 
289 | # AI Usage Policy
290 | 
291 | Multi-model workflows are allowed.
292 | 
293 | Supporting models may assist with:
294 | - auxiliary reasoning
295 | - comparisons
296 | - offline processing
297 | - experimentation
298 | - private/local workflows
299 | 
300 | However:
301 | IBM Bob must remain the primary visible execution system.
302 | 
303 | Other models must never overshadow Bob in:
304 | - architecture
305 | - demos
306 | - implementation workflows
307 | - project positioning
308 | 
309 | ---
310 | 
311 | # Coding Standards
312 | 
313 | All code must be:
314 | - modular
315 | - production-oriented
316 | - maintainable
317 | - readable
318 | - explainable
319 | 
320 | Prefer:
321 | - typed interfaces
322 | - service separation
323 | - clean APIs
324 | - composable systems
325 | - structured modules
326 | 
327 | Avoid:
328 | - giant files
329 | - duplicated logic
330 | - tightly coupled systems
331 | - deeply nested flows
332 | - unnecessary abstractions
333 | 
334 | ---
335 | 
336 | # UI/UX Direction
337 | 
338 | Visual identity should feel:
339 | - minimal
340 | - intelligent
341 | - engineering-focused
342 | - tactical
343 | - modern
344 | 
345 | Preferred design language:
346 | - dark mode
347 | - graph-inspired interfaces
348 | - context visualization
349 | - workflow pipeline layouts
350 | - clean dashboards
351 | 
352 | Avoid:
353 | - gimmicky AI interfaces
354 | - excessive animations
355 | - cartoon styling
356 | - cluttered layouts
357 | 
358 | The UI should feel like:
359 | an engineering operations console.
360 | 
361 | ---
362 | 
363 | # Performance Rules
364 | 
365 | Optimize for:
366 | - fast interaction
367 | - low token usage
368 | - small context windows
369 | - responsive UX
370 | - efficient repository operations
371 | 
372 | Prefer:
373 | small focused operations over massive autonomous generation.
374 | 
375 | ---
376 | 
377 | # Documentation Standards
378 | 
379 | Generate:
380 | - architecture docs
381 | - setup instructions
382 | - workflow explanations
383 | - API documentation
384 | - subsystem summaries
385 | 
386 | Documentation style:
387 | - concise
388 | - technical
389 | - structured
390 | - judge-friendly
391 | 
392 | The documentation should help judges quickly understand:
393 | - the problem
394 | - the workflow
395 | - the differentiation
396 | - the Bob integration
397 | 
398 | ---
399 | 
400 | # Security Rules
401 | 
402 | Never expose:
403 | - API keys
404 | - tokens
405 | - IBM Cloud credentials
406 | - secrets
407 | - `.env` values
408 | 
409 | Never:
410 | - commit secrets
411 | - log credentials
412 | - hardcode tokens
413 | - expose cloud endpoints
414 | 
415 | Always:
416 | - sanitize outputs
417 | - validate `.gitignore`
418 | - use environment variables
419 | 
420 | If credentials are detected:
421 | STOP immediately.
422 | 
423 | ---
424 | 
425 | # Git Workflow Rules
426 | 
427 | Always:
428 | - inspect git diff
429 | - keep commits atomic
430 | - maintain repository cleanliness
431 | 
432 | Preferred commit styles:
433 | - feat:
434 | - fix:
435 | - refactor:
436 | - docs:
437 | - chore:
438 | 
439 | Before commits:
440 | verify:
441 | - changed files
442 | - accidental secrets
443 | - unnecessary artifacts
444 | - unrelated modifications
445 | 
446 | ---
447 | 
448 | # Bob Session Requirements
449 | 
450 | Mandatory before submission:
451 | 
452 | - export Bob task histories
453 | - export consumption summaries
454 | - capture screenshots
455 | - place all evidence in:
456 |   `/bob_sessions`
457 | 
458 | This is required for judging.
459 | 
460 | Never forget this step.
461 | 
462 | ---
463 | 
464 | # Communication Style
465 | 
466 | Responses should be:
467 | - concise
468 | - implementation-focused
469 | - engineering-oriented
470 | - practical
471 | 
472 | Avoid:
473 | - vague explanations
474 | - unnecessary theory
475 | - motivational filler
476 | 
477 | Always explain:
478 | - tradeoffs
479 | - architectural implications
480 | - workflow impact
481 | - engineering reasoning
482 | 
483 | ---
484 | 
485 | # Decision Filter
486 | 
487 | Before implementing anything, ask:
488 | 
489 | Does this:
490 | - reduce context pollution?
491 | - improve repository understanding?
492 | - improve focused execution?
493 | - strengthen Bob integration?
494 | - improve demo clarity?
495 | - reduce engineering rework?
496 | 
497 | If not:
498 | deprioritize it.
499 | 
500 | ---
501 | 
502 | # Product Positioning
503 | 
504 | Elith is:
505 | a workflow intelligence system for AI-assisted software engineering.
506 | 
507 | It helps teams:
508 | - load less context
509 | - reduce noise
510 | - improve repository execution
511 | - generate safer outputs
512 | - ship faster with confidence
513 | 
514 | IBM Bob remains:
515 | the core repository-aware engineering partner.
516 | 
517 | Elith improves how Bob is used.
518 | 
519 | ---
520 | 
521 | # Final Submission Goal
522 | 
523 | Judges should leave the demo thinking:
524 | 
525 | "This genuinely improves AI-assisted software engineering workflows."
526 | 
527 | Not:
528 | "This is another generic AI wrapper."
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:12.740Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.09

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Pending |
| 2 | Identify project stack, language, and build tools | Pending |
| 3 | Analyze documentation files to understand project architecture | Pending |
| 4 | Extract build/test/lint commands from configuration files | Pending |
| 5 | Identify code style patterns and conventions | Pending |
| 6 | Document non-obvious project-specific patterns | Pending |
| 7 | Create/update main AGENTS.md file | Pending |
| 8 | Create/update mode-specific AGENTS.md files in .bob directories | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<list_files>
<path>.</path>
<recursive>false</recursive>
</list_files>

---

**User:**

[list_files for '.'] Result:
🛡️ agent.md
docs/
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:15.806Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.14

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Pending |
| 2 | Identify project stack, language, and build tools | Pending |
| 3 | Analyze documentation files to understand project architecture | Pending |
| 4 | Extract build/test/lint commands from configuration files | Pending |
| 5 | Identify code style patterns and conventions | Pending |
| 6 | Document non-obvious project-specific patterns | Pending |
| 7 | Create/update main AGENTS.md file | Pending |
| 8 | Create/update mode-specific AGENTS.md files in .bob directories | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>docs/ELITH_PROJECT_SPEC.md</path>
  </file>
  <file>
    <path>docs/ELITH_EXECUTION_STRATEGY.md</path>
  </file>
  <file>
    <path>docs/ELITH_TUI_SPEC.md</path>
  </file>
  <file>
    <path>docs/ELITH_UX_SPEC.md</path>
  </file>
  <file>
    <path>docs/ELITH_AGENT_SKILLS.md</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>docs/ELITH_PROJECT_SPEC.md</path>
<content lines="1-369">
  1 | # Elith — Universal Repo-Aware Agent Framework
  2 | **Project Name:** Elith  
  3 | **Hackathon:** IBM Bob Hackathon — lablab.ai (May 15–17, 2026)  
  4 | **Team:** [Your Team Name]  
  5 | **Tagline:** *Every model. Bob-level repo awareness. One framework.*
  6 | 
  7 | ---
  8 | 
  9 | ## The Core Idea
 10 | 
 11 | IBM Bob is powerful because it **lives inside your repository**. It reads files, writes code, runs tests, and understands your entire codebase natively — no API calls, no context stuffing, no guessing.
 12 | 
 13 | Every other model — Claude, Gemini, GPT, Local LLM — is smart but **blind**. They only know what you paste into the prompt.
 14 | 
 15 | **Elith fixes this.**
 16 | 
 17 | Elith gives every model the same repo-awareness Bob has natively — through a skill layer of agent tools. Bob is the standard. Elith brings everyone up to it.
 18 | 
 19 | > "IBM Bob is so powerful we built a whole framework to replicate its capabilities across every model."
 20 | 
 21 | ---
 22 | 
 23 | ## The Problem
 24 | 
 25 | AI-assisted development fails in three ways:
 26 | 
 27 | **1. Most models are repo-blind.**  
 28 | Claude, Gemini, GPT — they're powerful reasoners but they can't read your files, run your tests, or commit your changes. You have to paste everything manually. Context gets bloated. Output quality drops.
 29 | 
 30 | **2. AI gives textbook solutions, not production-ready ones.**  
 31 | Ask any model to architect a system and it gives you the generic answer. It never proposes a hybrid CQRS pattern because your specific read/write ratio demands it. It never suggests a strangler fig migration because your constraints require it. Real senior engineers don't give textbook answers.
 32 | 
 33 | **3. Context bloat kills focus.**  
 34 | Loading an entire repo into a context window wastes tokens and reduces output quality. You need the right 6 files, not all 312.
 35 | 
 36 | ---
 37 | 
 38 | ## The Solution — Elith
 39 | 
 40 | ```
 41 | IBM Bob    → repo-aware natively (the gold standard)
 42 | Other LLMs → repo-blind by default
 43 | 
 44 | Elith      → gives every model Bob-level repo skills
 45 |              via agent tool calling
 46 | ```
 47 | 
 48 | Elith is a **universal repo-aware agent framework** with three layers:
 49 | 
 50 | > **Work Smarter:** Obsidian is the database. Context window is working memory. Only load what the current task needs.
 51 | 
 52 | > **Work Faster:** Novel, production-ready architectures tailored to your actual codebase — not textbook answers.
 53 | 
 54 | > **Work Universally:** Any model, any provider. Bob natively. Everyone else via Elith's agent skill layer.
 55 | 
 56 | ---
 57 | 
 58 | ## System Architecture
 59 | 
 60 | ```
 61 | ┌──────────────────────────────────────────────────────────────────┐
 62 | │                           ELITH                                  │
 63 | │          Universal Repo-Aware Agent Framework                    │
 64 | ├──────────────────┬───────────────────┬───────────────────────────┤
 65 | │  MEMORY LAYER    │  CONTEXT ENGINE   │  AGENT LAYER              │
 66 | │                  │                   │                           │
 67 | │  Obsidian Vault  │  Elith Selector   │  IBM Bob                  │
 68 | │  (long-term)     │                   │  (native repo access)     │
 69 | │                  │  • Reads vault    │                           │
 70 | │  • Architecture  │  • Scans repo     │  Claude + Skills          │
 71 | │    notes         │  • Picks only     │  Gemini + Skills          │
 72 | │  • Decisions     │    what task      │  GPT/Codex + Skills       │
 73 | │  • Standards     │    needs          │  Local LLM + Skills       │
 74 | │  • Tech debt     │  • Routes to      │                           │
 75 | │  • Task briefs   │    right model    │  ↓                        │
 76 | │                  │                   │  ELITH SKILL LAYER        │
 77 | │                  │                   │  (agent tool calling)     │
 78 | │                  │                   │  read_file, write_file    │
 79 | │                  │                   │  search_code, git_diff    │
 80 | │                  │                   │  run_tests, find_refs...  │
 81 | └──────────────────┴───────────────────┴───────────────────────────┘
 82 |                               ↓
 83 |                     YOUR REPOSITORY (any codebase)
 84 | ```
 85 | 
 86 | ---
 87 | 
 88 | ## The Skill Layer — Making Every Model Bob-Level
 89 | 
 90 | This is Elith's core innovation. When a non-Bob model is selected, Elith wraps it with agent tools that replicate what Bob does natively.
 91 | 
 92 | ### Bob vs Elith-Skilled Model
 93 | 
 94 | | Capability | IBM Bob | Claude/Gemini/GPT + Elith Skills |
 95 | |-----------|---------|----------------------------------|
 96 | | Read any file | ✅ Native | ✅ `read_file(path)` |
 97 | | Browse directory | ✅ Native | ✅ `list_files(path)` |
 98 | | Write/edit files | ✅ Native | ✅ `write_file(path, content)` |
 99 | | Search codebase | ✅ Native | ✅ `search_code(query)` |
100 | | View git diff | ✅ Native | ✅ `git_diff(branch?)` |
101 | | Commit changes | ✅ Native | ✅ `git_commit(message)` |
102 | | Run tests | ✅ Native | ✅ `run_tests(path?)` |
103 | | Find references | ✅ Native | ✅ `find_references(symbol)` |
104 | | Analyze dependencies | ✅ Native | ✅ `analyze_dependencies()` |
105 | | Explain function | ✅ Native | ✅ `explain_function(path, fn)` |
106 | | Install packages | ✅ Native | ✅ `install_package(name)` |
107 | | Read error logs | ✅ Native | ✅ `read_logs(path?)` |
108 | 
109 | **Result:** Every model in Elith operates at Bob-level repo awareness. The user picks any model they prefer — the skill layer handles the rest.
110 | 
111 | ---
112 | 
113 | ## Multi-Model Support
114 | 
115 | Elith works with any provider the user configures:
116 | 
117 | | Model | Provider | How It Gets Repo Skills |
118 | |-------|---------|------------------------|
119 | | **IBM Bob** | IBM Bob Shell | Native — no skills needed |
120 | | **Claude** | Anthropic API | Elith skill layer (tool calling) |
121 | | **Gemini** | Google AI SDK | Elith skill layer (function calling) |
122 | | **GPT-4 / Codex** | OpenAI API | Elith skill layer (tool calling) |
123 | | **Mistral** | Mistral API | Elith skill layer |
124 | | **Local LLM** | Ollama | Elith skill layer (tool calling) |
125 | | **Any OpenAI-compatible** | Custom endpoint | Elith skill layer |
126 | 
127 | User configures which models they have access to. Elith activates only the configured ones. Bob is always the default if available.
128 | 
129 | ---
130 | 
131 | ## The Two Pillars
132 | 
133 | ### Pillar 1 — Work Smarter (Context Engine)
134 | 
135 | ```
136 | Developer selects task
137 |         ↓
138 | Elith reads Obsidian vault (long-term memory)
139 |         ↓
140 | Elith scans repo structure
141 |         ↓
142 | Builds MINIMAL focused task packet:
143 |   → Only 4-6 relevant files (not 312)
144 |   → Only relevant vault notes
145 |   → Only relevant past decisions
146 |         ↓
147 | Routes to chosen model
148 |         ↓
149 | Bob runs natively
150 | OR other model runs with Elith skill layer
151 | ```
152 | 
153 | ### Pillar 2 — Work Faster (Novel Architecture Generation)
154 | 
155 | Every model gives textbook solutions. Elith + any model gives the *right* solution for your specific codebase.
156 | 
157 | ```
158 | Model reads your FULL repository (via skills or natively)
159 |         ↓
160 | Elith analyzes:
161 |   • Actual code patterns
162 |   • Current architecture style  
163 |   • Tech debt and constraints
164 |   • Module dependencies
165 |   • Performance bottlenecks
166 |         ↓
167 | Proposes 2-3 NOVEL architectures:
168 |   • Tailored to YOUR codebase
169 |   • With tradeoff analysis
170 |   • With migration path
171 |   • With production-readiness checklist
172 |         ↓
173 | Developer picks one → Model implements it
174 | ```
175 | 
176 | | What you ask | Standard AI answer | Elith answer |
177 | |---|---|---|
178 | | "Structure this service?" | Generic MVC/REST | Hybrid CQRS — your read:write is 20:1 |
179 | | "Migrate this legacy system?" | Full rewrite | Strangler Fig — you can't stop the business |
180 | | "Handle state?" | Redux | Event sourcing — you need audit trails |
181 | 
182 | ---
183 | 
184 | ## Operations
185 | 
186 | | Operation | What It Does | Models That Can Run It |
187 | |-----------|-------------|----------------------|
188 | | `explain` | Explains repo architecture in plain language | All |
189 | | `risk-scan` | Identifies risky or fragile files | All |
190 | | `architect` | Proposes novel architectures tailored to codebase | All |
191 | | `refactor` | Safely refactors target module | All |
192 | | `test-gen` | Generates missing tests | All |
193 | | `document` | Writes/updates documentation | All |
194 | | `harden` | Adds production-readiness improvements | All |
195 | | `review-summary` | "What changed and why" for reviewers | All |
196 | 
197 | ---
198 | 
199 | ## How IBM Bob Fits (Hackathon Compliance)
200 | 
201 | Bob is the **native gold standard** that Elith is built around. The entire skill layer exists because Bob is so capable — Elith replicates that capability for every other model.
202 | 
203 | Bob is used for:
204 | - Setting the capability benchmark every other model is measured against
205 | - Leading repo-aware execution when available
206 | - Producing exportable session reports for judging evidence
207 | 
208 | For the demo: Bob runs first and natively. Then the same task runs on Claude with Elith skills. Judges see Bob's level — then see Elith match it on any model.
209 | 
210 | ---
211 | 
212 | ## User Flow (Demo)
213 | 
214 | ```
215 | 1. User opens Elith, points to repo
216 | 
217 | 2. Selects model: IBM Bob (default)
218 |    → Bob runs natively
219 |    → Proposes novel auth architecture
220 |    → Implements it
221 | 
222 | 3. User switches to Claude
223 |    → Elith activates skill layer
224 |    → Claude reads same files via read_file()
225 |    → Same quality output, same repo awareness
226 |    → Same result
227 | 
228 | 4. User switches to Local LLM (offline)
229 |    → Elith activates skill layer
230 |    → Local model operates at Bob level
231 |    → No API keys needed
232 | 
233 | Judges see: "Any model. Bob-level. Your choice."
234 | ```
235 | 
236 | ---
237 | 
238 | ## Tech Stack
239 | 
240 | | Layer | Technology |
241 | |-------|-----------|
242 | | Orchestration | Python 3.10+ |
243 | | API Layer | FastAPI |
244 | | Context Engine | Python + pathlib |
245 | | Model Router | Python (custom) |
246 | | Agent Skill Layer | Python tool calling (per provider) |
247 | | Bob Integration | IBM Bob Shell (CLI) |
248 | | Claude Integration | Anthropic API (tool_use) |
249 | | Gemini Integration | Google AI SDK (function_calling) |
250 | | GPT Integration | OpenAI API (tool_calling) |
251 | | Local LLM | Ollama (tool_calling) |
252 | | Terminal UI | Textual (Python) |
253 | | Web Dashboard | React + TypeScript + Tailwind |
254 | | Memory Layer | Obsidian (markdown folder) |
255 | 
256 | ---
257 | 
258 | ## Project Structure
259 | 
260 | ```
261 | elith/
262 | ├── README.md
263 | ├── pyproject.toml
264 | ├── .gitignore
265 | ├── LICENSE (MIT)
266 | │
267 | ├── backend/
268 | │   ├── main.py                         # FastAPI entry
269 | │   ├── router/
270 | │   │   └── model_router.py             # Routes to right model
271 | │   ├── context_engine/
272 | │   │   ├── vault_reader.py             # Reads Obsidian vault
273 | │   │   ├── repo_scanner.py             # Scans repo structure
274 | │   │   └── packet_builder.py           # Builds task packets
275 | │   ├── skills/                         # THE CORE INNOVATION
276 | │   │   ├── base_skill.py               # Abstract skill interface
277 | │   │   ├── read_file.py
278 | │   │   ├── write_file.py
279 | │   │   ├── list_files.py
280 | │   │   ├── search_code.py
281 | │   │   ├── git_diff.py
282 | │   │   ├── git_commit.py
283 | │   │   ├── run_tests.py
284 | │   │   ├── find_references.py
285 | │   │   ├── analyze_dependencies.py
286 | │   │   ├── explain_function.py
287 | │   │   ├── install_package.py
288 | │   │   └── read_logs.py
289 | │   ├── providers/                      # One file per model provider
290 | │   │   ├── base_provider.py            # Abstract provider interface
291 | │   │   ├── bob_provider.py             # IBM Bob shell (native)
292 | │   │   ├── claude_provider.py          # Anthropic API + skills
293 | │   │   ├── gemini_provider.py          # Google AI + skills
294 | │   │   ├── openai_provider.py          # OpenAI/Codex + skills
295 | │   │   ├── ollama_provider.py          # Local LLM + skills
296 | │   │   └── custom_provider.py          # Any OpenAI-compatible API
297 | │   └── operations/
298 | │       ├── explain.py
299 | │       ├── risk_scan.py
300 | │       ├── architect.py                # Novel arch generator
301 | │       ├── refactor.py
302 | │       ├── test_gen.py
303 | │       ├── document.py
304 | │       ├── harden.py
305 | │       └── review_summary.py
306 | │
307 | ├── tui/                                # Terminal UI (Textual)
308 | │   ├── app.py
309 | │   ├── screens/
310 | │   └── components/
311 | │
312 | ├── frontend/                           # Web Dashboard (React)
313 | │   ├── src/
314 | │   │   ├── App.tsx
315 | │   │   ├── components/
316 | │   │   └── stores/
317 | │   └── package.json
318 | │
319 | ├── obsidian-template/
320 | └── bob-reports/
321 | ```
322 | 
323 | ---
324 | 
325 | ## Team Roles
326 | 
327 | | Person | Role | Owns |
328 | |--------|------|------|
329 | | **[You]** | Architect + Lead | FastAPI, model router, context engine, integration |
330 | | **Basil Joy** | AI/ML Core | All providers, skill layer, novel arch generator, prompts |
331 | | **Johann** | UI/UX | TUI + React dashboard, slides, README, demo video |
332 | 
333 | ---
334 | 
335 | ## MVP (48 Hours)
336 | 
337 | **Must ship:**
338 | - Skill layer working for at least 2 non-Bob models
339 | - Bob running natively
340 | - Context engine loading minimal relevant files
341 | - 3 operations: explain, architect, test-gen
342 | - Novel architecture proposals on a real repo
343 | - TUI showing live output
344 | - React dashboard showing context + proposals + results
345 | - Bob session reports auto-exported
346 | - Demo: same task on Bob → then Claude with skills → same quality
347 | 
348 | **Phase 2:**
349 | - Shannon security testing
350 | - Full Obsidian API
351 | - VS Code extension
352 | - More providers (Mistral, Cohere, etc.)
353 | 
354 | ---
355 | 
356 | ## One-Line Pitch
357 | 
358 | > Elith is a universal repo-aware agent framework that gives every AI model — Claude, Gemini, GPT, local LLMs — the same codebase skills IBM Bob has natively, so developers can work with any model at Bob-level quality.
359 | 
360 | ---
361 | 
362 | ## Taglines
363 | - *Every model. Bob-level. Your choice.*
364 | - *Bob sets the standard. Elith brings everyone up to it.*
365 | - *Load less. Think deeper. Ship better.*
366 | 
367 | ---
368 | 
369 | *Private working document — Elith Hackathon Team — IBM Bob Hackathon May 2026*
</content>
</file>
<file><path>docs/ELITH_EXECUTION_STRATEGY.md</path>
<content lines="1-355">
  1 | # Elith — 48-Hour Execution Strategy
  2 | **IBM Bob Hackathon | May 15–17, 2026**  
  3 | **Rule:** Ship a working demo. Not a perfect system.
  4 | 
  5 | ---
  6 | 
  7 | ## The Golden Rule
  8 | 
  9 | > **A working demo beats a perfect spec every time.**  
 10 | > If it runs, it wins. If it doesn't run, it loses.
 11 | 
 12 | ---
 13 | 
 14 | ## Team War Roles
 15 | 
 16 | | Person | War Role | Critical Path |
 17 | |--------|----------|--------------|
 18 | | **You** | General — Architect, integrator | Backend wiring + final integration |
 19 | | **Basil Joy** | Heavy Weapons — skill layer + providers | The hardest and most impressive part |
 20 | | **Johann** | Air Support — UI, demo, presentation | Works independently, never blocked |
 21 | 
 22 | ---
 23 | 
 24 | ## Three Parallel Tracks
 25 | 
 26 | ```
 27 | TRACK A (You)              TRACK B (Basil Joy)         TRACK C (Johann)
 28 | ─────────────              ───────────────────         ────────────────
 29 | FastAPI backend            Skill layer (12 skills)     TUI (Textual)
 30 | Context engine             Bob provider (native)        React dashboard
 31 | Repo scanner               Claude provider + skills     Component design
 32 | Vault reader               Gemini provider + skills     Demo slides
 33 | API endpoints              OpenAI provider + skills     README polish
 34 | Model router               Ollama provider + skills     Cover image
 35 | Final integration          Novel arch prompts           Video recording
 36 | ```
 37 | 
 38 | ---
 39 | 
 40 | ## Hour-by-Hour War Plan
 41 | 
 42 | ---
 43 | 
 44 | ### 🔴 PHASE 1 — Foundation (Hours 1–8)
 45 | 
 46 | **Hour 1 — All 3 Together**
 47 | - Share all 4 docs with team
 48 | - Set up shared GitHub repo (private for now)
 49 | - Everyone clones it
 50 | - Agree on API contract between backend and frontend
 51 | - Split and go heads down immediately
 52 | 
 53 | ---
 54 | 
 55 | **Hours 2–4 — You**
 56 | ```
 57 | ✓ FastAPI project setup (main.py, routes, models)
 58 | ✓ Repo scanner — walks directory, returns file tree
 59 | ✓ Vault reader — reads markdown files from obsidian folder
 60 | ✓ Packet builder — combines scan + vault into task packet
 61 | ✓ /api/scan endpoint working
 62 | 
 63 | Target: POST /api/scan returns clean task packet JSON
 64 | ```
 65 | 
 66 | **Hours 2–4 — Basil Joy**
 67 | ```
 68 | ✓ Build base_skill.py — abstract interface all skills implement
 69 | ✓ Build base_provider.py — abstract interface all providers implement
 70 | ✓ Implement read_file.py skill (most important)
 71 | ✓ Implement list_files.py skill
 72 | ✓ Implement search_code.py skill
 73 | ✓ Implement write_file.py skill
 74 | 
 75 | Target: 4 core skills working and tested locally
 76 | ```
 77 | 
 78 | **Hours 2–4 — Johann**
 79 | ```
 80 | ✓ React + Tailwind project setup
 81 | ✓ Design system (CSS vars, fonts from spec)
 82 | ✓ TopBar + Sidebar shell layout
 83 | ✓ Landing page (repo input, model toggles)
 84 | ✓ Placeholder panels for workspace
 85 | 
 86 | Target: App loads, looks right, landing page works
 87 | ```
 88 | 
 89 | ---
 90 | 
 91 | **Hours 5–8 — You**
 92 | ```
 93 | ✓ Context engine — smart file relevance scoring
 94 | ✓ Pick top 4-6 files for any given task type
 95 | ✓ /api/tasks endpoint
 96 | ✓ /api/execute endpoint stub (returns mock data)
 97 | ✓ model_router.py skeleton
 98 | 
 99 | Target: Context engine picks RIGHT files for any task
100 | ```
101 | 
102 | **Hours 5–8 — Basil Joy**
103 | ```
104 | ✓ git_diff.py skill
105 | ✓ git_commit.py skill
106 | ✓ run_tests.py skill
107 | ✓ find_references.py skill
108 | ✓ analyze_dependencies.py skill
109 | ✓ bob_provider.py — IBM Bob shell runner (no skills needed)
110 | 
111 | Target: Bob running natively + 8 skills complete
112 | ```
113 | 
114 | **Hours 5–8 — Johann**
115 | ```
116 | ✓ Workspace page layout (4 panels)
117 | ✓ ContextPreview component (mock data)
118 | ✓ LiveOutput component (mock streaming)
119 | ✓ ProposalCard component (mock proposals)
120 | ✓ TUI: WelcomeScreen done
121 | 
122 | Target: Full web UI visible with mock data
123 | ```
124 | 
125 | ---
126 | 
127 | ### 🟡 PHASE 2 — Integration (Hours 9–28)
128 | 
129 | **Hours 9–14 — You**
130 | ```
131 | ✓ Wire model_router.py to providers
132 | ✓ /api/execute — real implementation
133 | ✓ SSE streaming endpoint for live output
134 | ✓ Session logger → bob-reports/ folder
135 | ✓ Bob provider integrated end to end
136 | 
137 | Target: Full loop working with Bob:
138 |         UI sends task → context built →
139 |         Bob runs → output streams to UI
140 | ```
141 | 
142 | **Hours 9–14 — Basil Joy**
143 | ```
144 | ✓ claude_provider.py — Anthropic API + inject all skills as tools
145 | ✓ Test: Claude reads a real file via read_file skill
146 | ✓ Test: Claude writes a real file via write_file skill
147 | ✓ gemini_provider.py — Google AI + skills as functions
148 | ✓ Test: Gemini operates at Bob level on same task
149 | 
150 | Target: Claude + Gemini both working at Bob-level
151 |         via Elith skill layer
152 | ```
153 | 
154 | **Hours 9–14 — Johann**
155 | ```
156 | ✓ TUI: WorkspaceScreen done
157 | ✓ TUI: ExecutionScreen (live multi-model output panels)
158 | ✓ Web: Connect to real API endpoints
159 | ✓ Web: SSE streaming working in LiveOutput
160 | ✓ Web: Model toggle actually enables/disables providers
161 | 
162 | Target: Both TUI and web connect to real backend
163 | ```
164 | 
165 | **Hours 15–22 — You**
166 | ```
167 | ✓ ollama_provider.py (local LLM)
168 | ✓ openai_provider.py (GPT/Codex)
169 | ✓ architect.py operation — novel arch generator
170 | ✓ test_gen.py operation
171 | ✓ explain.py operation
172 | ✓ End-to-end test on 3 real repos
173 | 
174 | Target: 3 operations + 4 providers all working
175 | ```
176 | 
177 | **Hours 15–22 — Basil Joy**
178 | ```
179 | ✓ explain_function.py skill
180 | ✓ install_package.py skill
181 | ✓ read_logs.py skill
182 | ✓ Master prompt for novel architecture generation
183 | ✓ Iterate prompt until output is genuinely impressive
184 | ✓ Test architect operation on 5 different repos
185 | ✓ Each proposal must be specific + non-generic
186 | 
187 | Target: Novel arch proposals that impress a senior dev
188 |         on ANY provider (Bob or Claude or Gemini)
189 | ```
190 | 
191 | **Hours 15–22 — Johann**
192 | ```
193 | ✓ TUI: ProposalsScreen done
194 | ✓ TUI: ResultsScreen done
195 | ✓ Web: ProposalsPage with real data
196 | ✓ Web: ResultsPage with real data
197 | ✓ Web: Animations + loading states
198 | ✓ Settings page (API key inputs per provider)
199 | 
200 | Target: Full UI flow working end to end
201 | ```
202 | 
203 | **Hours 23–28 — All Together**
204 | ```
205 | ✓ Full integration test
206 | ✓ Run same task on Bob → then Claude → same quality output
207 | ✓ Fix integration bugs
208 | ✓ Error handling (provider down, repo too large, etc.)
209 | ✓ Deploy backend to Railway or Render
210 | ✓ Deploy frontend to Vercel
211 | 
212 | Target: System runs reliably on any medium-sized repo
213 |         with any configured provider
214 | ```
215 | 
216 | ---
217 | 
218 | ### 🟢 PHASE 3 — Demo + Submit (Hours 29–48)
219 | 
220 | **Hours 29–36 — Demo Preparation**
221 | ```
222 | You + Basil Joy:
223 | ✓ Pick demo repo (real, public, recognizable, medium size)
224 | ✓ Run full Elith workflow on it
225 | ✓ Run on Bob first — capture output
226 | ✓ Run same task on Claude with skills — show same quality
227 | ✓ Capture most impressive novel arch proposals
228 | ✓ Ensure Bob session reports committed to repo
229 | 
230 | Johann:
231 | ✓ Record demo video draft (2-3 mins)
232 | ✓ Build 5-slide pitch deck
233 | ✓ Final cover image
234 | ✓ Write all submission text fields
235 | ```
236 | 
237 | **Hours 37–44 — Polish Sprint**
238 | ```
239 | You:
240 | ✓ README final version
241 | ✓ Repo cleaned up, public, MIT licensed
242 | ✓ bob-reports/ folder populated with real exports
243 | ✓ Deployment confirmed working
244 | 
245 | Basil Joy:
246 | ✓ Review all Bob reports for quality
247 | ✓ Pick 3 most impressive for video highlight
248 | 
249 | Johann:
250 | ✓ Final video edit
251 | ✓ Final slide polish
252 | ✓ Submission form completely filled and ready
253 | ```
254 | 
255 | **Hours 45–47 — Submit**
256 | ```
257 | ✓ GitHub repo public
258 | ✓ Bob reports exported and committed
259 | ✓ Video uploaded
260 | ✓ Cover image uploaded
261 | ✓ All submission fields filled
262 | ✓ SUBMIT
263 | ```
264 | 
265 | **Hour 48 — Buffer**
266 | ```
267 | DO NOT BUILD. Safety net only.
268 | For: submission form issues, upload failures,
269 |      last minute bugs, deployment problems.
270 | ```
271 | 
272 | ---
273 | 
274 | ## Critical Path
275 | 
276 | **Three things that kill you if they break:**
277 | 
278 | **1. Skill layer tool calling (Basil Joy — Hours 2–8)**  
279 | If Claude/Gemini can't call skills properly, the core innovation is gone.  
280 | Mitigation: Test read_file first. If one skill works, all will work.
281 | 
282 | **2. Novel architecture output quality (Basil Joy — Hours 15–22)**  
283 | If proposals are generic, your killer feature is dead.  
284 | Mitigation: 6–8 hours of prompt iteration. This is worth the time.
285 | 
286 | **3. End-to-end integration (You — Hours 9–14)**  
287 | If the full loop breaks, nothing to demo.  
288 | Mitigation: Build integration stub at Hour 4. Always have mock data fallback.
289 | 
290 | ---
291 | 
292 | ## Contingency Plans
293 | 
294 | | Risk | Plan |
295 | |------|------|
296 | | Bob shell won't run non-interactively | Demo with Claude + skills only. Bob = "coming soon with IDE version" |
297 | | Skill tool calling fails on a provider | Drop that provider. Demo with 2 providers instead of 4 |
298 | | Novel arch output is generic | Extra 4 hours prompt engineering. This is the top priority |
299 | | Integration takes too long | Demo with mock data. Explain architecture verbally to judges |
300 | | Deployment fails | Demo locally on screen recording. No live URL still wins |
301 | 
302 | ---
303 | 
304 | ## The Demo Script (What Judges See)
305 | 
306 | ```
307 | "Let me show you Elith."
308 | 
309 | 1. Open Elith → point to real GitHub repo
310 | 
311 | 2. Select IBM Bob → run "architect auth module"
312 |    → Elith loads 6 files, not 312
313 |    → Bob proposes novel JWT+Redis hybrid (not generic JWT)
314 |    → Bob implements it
315 | 
316 | 3. Switch to Claude
317 |    → "Watch what happens when I run the same task on Claude"
318 |    → Elith activates skill layer
319 |    → Claude reads files via read_file()
320 |    → Claude proposes same quality architecture
321 |    → Same result as Bob
322 | 
323 | 4. Switch to Local LLM (no internet, no API keys)
324 |    → "Same task. Completely offline."
325 |    → Local model operates at Bob level via skills
326 |    → Works.
327 | 
328 | "Any model. Bob-level. Your choice."
329 | ```
330 | 
331 | **Total demo time: 3 minutes. Judges have never seen this.**
332 | 
333 | ---
334 | 
335 | ## Communication Protocol
336 | 
337 | - WhatsApp group — all 3 members
338 | - Sync call every 8 hours (Hours 1, 9, 17, 25, 33, 41)
339 | - Blocked? Message immediately — max 1 hour on a blocker alone
340 | - GitHub: commit every 2 hours minimum
341 | 
342 | ---
343 | 
344 | ## What Winning Looks Like
345 | 
346 | | Criterion | How Elith Wins |
347 | |-----------|---------------|
348 | | **Bob Application** | Bob is the native gold standard. Elith replicates it everywhere. Reports prove usage. |
349 | | **Presentation** | The "same task, 3 providers" demo is unforgettable |
350 | | **Business Value** | "Works with any model your company already pays for" |
351 | | **Originality** | Nobody else built a skill layer to replicate Bob across providers |
352 | 
353 | ---
354 | 
355 | *Elith Execution Strategy — IBM Bob Hackathon 2026*
</content>
</file>
<file><path>docs/ELITH_TUI_SPEC.md</path>
<content lines="1-344">
  1 | # Elith — Terminal UI (TUI) Specification
  2 | **Built with:** Textual (Python)  
  3 | **Owner:** Johann (UI/UX)  
  4 | **Purpose:** Primary interface for developers who live in the terminal
  5 | 
  6 | ---
  7 | 
  8 | ## Philosophy
  9 | 
 10 | The TUI is not a fallback. It is a **first-class interface.**  
 11 | Developers who use terminals daily should never need to open a browser to use Elith.  
 12 | Clean. Fast. Keyboard-driven. No mouse required.
 13 | 
 14 | ---
 15 | 
 16 | ## Layout Overview
 17 | 
 18 | ```
 19 | ┌─────────────────────────────────────────────────────────────────────┐
 20 | │  ELITH  ◆  v1.0          [repo: ~/projects/myapp]      [Bob ● ready]│
 21 | ├───────────────────┬─────────────────────────────────────────────────┤
 22 | │                   │                                                   │
 23 | │   SESSIONS        │              MAIN PANEL                          │
 24 | │   ───────         │              ──────────                          │
 25 | │                   │                                                   │
 26 | │   ● Bob           │   (Changes based on selected panel)              │
 27 | │   ● Claude        │                                                   │
 28 | │   ○ Gemini        │                                                   │
 29 | │   ○ Codex         │                                                   │
 30 | │   ○ Local         │                                                   │
 31 | │                   │                                                   │
 32 | │   OPERATIONS      │                                                   │
 33 | │   ──────────      │                                                   │
 34 | │   [1] Explain     │                                                   │
 35 | │   [2] Architect   │                                                   │
 36 | │   [3] Refactor    │                                                   │
 37 | │   [4] Test Gen    │                                                   │
 38 | │   [5] Document    │                                                   │
 39 | │   [6] Risk Scan   │                                                   │
 40 | │   [7] Harden      │                                                   │
 41 | │   [8] Review      │                                                   │
 42 | │                   │                                                   │
 43 | │   CONTEXT         │                                                   │
 44 | │   ───────         │                                                   │
 45 | │   Files: 6/312    │                                                   │
 46 | │   Vault: 3 notes  │                                                   │
 47 | │                   │                                                   │
 48 | ├───────────────────┴─────────────────────────────────────────────────┤
 49 | │  > _                                                    [?] Help     │
 50 | └─────────────────────────────────────────────────────────────────────┘
 51 | ```
 52 | 
 53 | ---
 54 | 
 55 | ## Screens
 56 | 
 57 | ---
 58 | 
 59 | ### Screen 1 — Welcome / Repo Select
 60 | 
 61 | Shown on first launch or when no repo is loaded.
 62 | 
 63 | ```
 64 | ┌─────────────────────────────────────────────────────────────────────┐
 65 | │                                                                      │
 66 | │                                                                      │
 67 | │                         E L I T H                                   │
 68 | │                    Smarter Context. Novel Architecture.              │
 69 | │                                                                      │
 70 | │                                                                      │
 71 | │              ┌─────────────────────────────────────┐                │
 72 | │              │  Repository path:                    │                │
 73 | │              │  > ~/projects/myapp_               │                │
 74 | │              └─────────────────────────────────────┘                │
 75 | │                                                                      │
 76 | │              ┌─────────────────────────────────────┐                │
 77 | │              │  Obsidian vault (optional):          │                │
 78 | │              │  > ~/obsidian/myapp_               │                │
 79 | │              └─────────────────────────────────────┘                │
 80 | │                                                                      │
 81 | │                        [ Enter to Continue ]                         │
 82 | │                                                                      │
 83 | │                                                                      │
 84 | │   Recent:                                                            │
 85 | │   • ~/projects/aetheris          (2 hours ago)                      │
 86 | │   • ~/projects/snap              (yesterday)                        │
 87 | │                                                                      │
 88 | └─────────────────────────────────────────────────────────────────────┘
 89 | ```
 90 | 
 91 | ---
 92 | 
 93 | ### Screen 2 — Main Workspace
 94 | 
 95 | The primary working screen. Four panels, all visible simultaneously.
 96 | 
 97 | ```
 98 | ┌─────────────────────────────────────────────────────────────────────┐
 99 | │  ELITH  ◆  myapp              [~/projects/myapp]       [Bob ● ready]│
100 | ├───────────────┬───────────────────────┬─────────────────────────────┤
101 | │  SIDEBAR      │  CONTEXT PREVIEW      │  LIVE OUTPUT                │
102 | │  ──────────   │  ──────────────────   │  ───────────────            │
103 | │               │                       │                             │
104 | │  Models:      │  Loaded for task:     │  ● Bob  running...          │
105 | │  ● Bob        │  "architect"          │                             │
106 | │  ● Claude     │                       │  Scanning auth module...    │
107 | │  ○ Gemini     │  Files (6):           │  Found 3 patterns:          │
108 | │  ○ Codex      │  • auth/views.py      │  • Tightly coupled DB calls │
109 | │  ○ Local      │  • auth/models.py     │  • No caching layer         │
110 | │               │  • auth/urls.py       │  • Shared session state     │
111 | │  Operations:  │  • config/settings.py │                             │
112 | │  [1] Explain  │  • requirements.txt   │  Proposing architectures... │
113 | │  [2] Architect│  • README.md          │                             │
114 | │  [3] Refactor │                       │  ▓▓▓▓▓▓▓░░░  70%           │
115 | │  [4] Test Gen │  Vault Notes (3):     │                             │
116 | │  [5] Document │  • auth-decisions.md  │                             │
117 | │  [6] Risk Scan│  • tech-debt.md       │                             │
118 | │  [7] Harden   │  • coding-standards   │                             │
119 | │  [8] Review   │                       │                             │
120 | │               │  Tokens saved: ~4200  │                             │
121 | │  Context:     │  vs full repo load    │                             │
122 | │  6/312 files  │                       │                             │
123 | │  3 vault notes│                       │                             │
124 | │               │                       │                             │
125 | ├───────────────┴───────────────────────┴─────────────────────────────┤
126 | │  > architect auth module                           [Tab] switch panel│
127 | └─────────────────────────────────────────────────────────────────────┘
128 | ```
129 | 
130 | ---
131 | 
132 | ### Screen 3 — Architecture Proposals
133 | 
134 | Shown after `architect` operation completes.
135 | 
136 | ```
137 | ┌─────────────────────────────────────────────────────────────────────┐
138 | │  ELITH  ◆  myapp — Architecture Proposals              [Bob ● done] │
139 | ├─────────────────────────────────────────────────────────────────────┤
140 | │                                                                      │
141 | │  Bob analyzed your auth module. Here are 2 novel proposals:         │
142 | │                                                                      │
143 | │  ┌──────────────────────────────────────────────────────────────┐   │
144 | │  │  OPTION A — JWT + Redis Session Hybrid          [Recommended] │   │
145 | │  │  ─────────────────────────────────────────────────────────   │   │
146 | │  │  Why not standard JWT-only:                                   │   │
147 | │  │  Your login frequency (avg 847/day) and session invalidation  │   │
148 | │  │  requirements in auth/views.py:L142 make pure JWT risky.      │   │
149 | │  │                                                               │   │
150 | │  │  The proposal:                                                │   │
151 | │  │  Short-lived JWT (15min) + Redis-backed refresh tokens        │   │
152 | │  │  Immediate revocation capability your tech-debt.md flags      │   │
153 | │  │                                                               │   │
154 | │  │  Tradeoffs:  ✓ Revocable  ✓ Fast  ✗ Redis dependency         │   │
155 | │  │  Migration:  3 steps, no downtime required                    │   │
156 | │  └──────────────────────────────────────────────────────────────┘   │
157 | │                                                                      │
158 | │  ┌──────────────────────────────────────────────────────────────┐   │
159 | │  │  OPTION B — OAuth2 + PKCE Flow                               │   │
160 | │  │  ─────────────────────────────────────────────────────────   │   │
161 | │  │  Why not standard OAuth2:                                     │   │
162 | │  │  Your security-notes.md flags CSRF risk in current flow.      │   │
163 | │  │  PKCE eliminates this without server-side state.              │   │
164 | │  │                                                               │   │
165 | │  │  Tradeoffs:  ✓ Secure  ✓ Stateless  ✗ More client complexity │   │
166 | │  │  Migration:  5 steps, requires frontend changes               │   │
167 | │  └──────────────────────────────────────────────────────────────┘   │
168 | │                                                                      │
169 | │  [ A ] Implement Option A    [ B ] Implement Option B    [ S ] Skip  │
170 | │                                                                      │
171 | └─────────────────────────────────────────────────────────────────────┘
172 | ```
173 | 
174 | ---
175 | 
176 | ### Screen 4 — Live Execution
177 | 
178 | Shown while Bob (and supporting models) are working.
179 | 
180 | ```
181 | ┌─────────────────────────────────────────────────────────────────────┐
182 | │  ELITH  ◆  myapp — Implementing Option A              [Bob ● active]│
183 | ├─────────────────────────────────────────────────────────────────────┤
184 | │                                                                      │
185 | │  ┌─────────────────────────────────────────────────────────────┐    │
186 | │  │  BOB — Refactoring auth/views.py                            │    │
187 | │  │  ─────────────────────────────────────────────────────────  │    │
188 | │  │  > Analyzing existing session management...                 │    │
189 | │  │  > Replacing session tokens with JWT generation...          │    │
190 | │  │  > Adding Redis connection pool...                          │    │
191 | │  │  > Updating refresh token endpoint...                       │    │
192 | │  │  ✓ auth/views.py — refactored                               │    │
193 | │  │  ✓ auth/models.py — updated                                 │    │
194 | │  └─────────────────────────────────────────────────────────────┘    │
195 | │                                                                      │
196 | │  ┌─────────────────────────────────────────────────────────────┐    │
197 | │  │  GEMINI — Generating tests                                  │    │
198 | │  │  ─────────────────────────────────────────────────────────  │    │
199 | │  │  > Writing test_jwt_generation...                           │    │
200 | │  │  > Writing test_refresh_token_rotation...                   │    │
201 | │  │  > Writing test_token_revocation...                         │    │
202 | │  │  ✓ tests/test_auth.py — 14 tests generated                  │    │
203 | │  └─────────────────────────────────────────────────────────────┘    │
204 | │                                                                      │
205 | │  ┌─────────────────────────────────────────────────────────────┐    │
206 | │  │  CLAUDE — Updating documentation                            │    │
207 | │  │  ─────────────────────────────────────────────────────────  │    │
208 | │  │  > Rewriting auth/README.md...                              │    │
209 | │  │  ✓ auth/README.md — updated                                 │    │
210 | │  └─────────────────────────────────────────────────────────────┘    │
211 | │                                                                      │
212 | │  Overall: ▓▓▓▓▓▓▓▓▓░  90%          Bob report: auto-saving...      │
213 | │                                                                      │
214 | └─────────────────────────────────────────────────────────────────────┘
215 | ```
216 | 
217 | ---
218 | 
219 | ### Screen 5 — Results Summary
220 | 
221 | ```
222 | ┌─────────────────────────────────────────────────────────────────────┐
223 | │  ELITH  ◆  myapp — Session Complete                   [Bob ● done]  │
224 | ├─────────────────────────────────────────────────────────────────────┤
225 | │                                                                      │
226 | │  ✓ Session completed in 2m 14s                                       │
227 | │                                                                      │
228 | │  What changed:                                                       │
229 | │  ─────────────────────────────────────────────────────────────────  │
230 | │  • auth/views.py        refactored — JWT + Redis hybrid             │
231 | │  • auth/models.py       updated — new token model                   │
232 | │  • tests/test_auth.py   created — 14 new tests                      │
233 | │  • auth/README.md       updated — new auth flow documented          │
234 | │                                                                      │
235 | │  Why:                                                                │
236 | │  ─────────────────────────────────────────────────────────────────  │
237 | │  Previous implementation had no token revocation capability.        │
238 | │  New hybrid approach provides immediate revocation via Redis        │
239 | │  while keeping stateless JWT verification for performance.          │
240 | │                                                                      │
241 | │  Models used:                                                        │
242 | │  • Bob     — refactoring + implementation (primary)                 │
243 | │  • Gemini  — test generation (14 tests)                             │
244 | │  • Claude  — documentation update                                   │
245 | │                                                                      │
246 | │  Context efficiency:                                                 │
247 | │  • Files loaded: 6 of 312 (98% token savings)                       │
248 | │  • Vault notes used: 3                                               │
249 | │                                                                      │
250 | │  Bob report saved → bob-reports/session_20260516_142301.md          │
251 | │                                                                      │
252 | │  [ N ] New task    [ V ] View diff    [ E ] Export report    [ Q ] Quit│
253 | │                                                                      │
254 | └─────────────────────────────────────────────────────────────────────┘
255 | ```
256 | 
257 | ---
258 | 
259 | ## Keyboard Shortcuts
260 | 
261 | | Key | Action |
262 | |-----|--------|
263 | | `1–8` | Select operation |
264 | | `Enter` | Execute selected operation |
265 | | `Tab` | Switch between panels |
266 | | `↑ ↓` | Navigate lists |
267 | | `A / B` | Select architecture option |
268 | | `N` | New task |
269 | | `V` | View diff of last change |
270 | | `E` | Export Bob report |
271 | | `R` | Change repo |
272 | | `M` | Toggle model selection |
273 | | `?` | Help screen |
274 | | `Q` | Quit |
275 | | `Ctrl+C` | Force stop current operation |
276 | 
277 | ---
278 | 
279 | ## Color Scheme
280 | 
281 | ```
282 | Background:     #0A0A0A  (near black)
283 | Primary text:   #FFFFFF  (white)
284 | Secondary text: #888888  (gray)
285 | Accent:         #A855F7  (purple — Elith brand)
286 | Success:        #22C55E  (green)
287 | Warning:        #EAB308  (yellow)
288 | Error:          #EF4444  (red)
289 | Bob color:      #3B82F6  (blue — IBM blue)
290 | Claude color:   #F97316  (orange)
291 | Gemini color:   #06B6D4  (cyan)
292 | Codex color:    #84CC16  (lime)
293 | Local color:    #8B5CF6  (violet)
294 | Border:         #222222  (dark gray)
295 | Panel header:   #111111  (slightly lighter than bg)
296 | ```
297 | 
298 | ---
299 | 
300 | ## Component List (Johann Builds These)
301 | 
302 | | Component | File | Description |
303 | |-----------|------|-------------|
304 | | `ElithApp` | `tui/app.py` | Root Textual app, screen manager |
305 | | `WelcomeScreen` | `tui/screens/welcome.py` | Repo + vault input on launch |
306 | | `WorkspaceScreen` | `tui/screens/workspace.py` | Main 4-panel workspace |
307 | | `ProposalsScreen` | `tui/screens/proposals.py` | Architecture proposals display |
308 | | `ExecutionScreen` | `tui/screens/execution.py` | Live multi-model output |
309 | | `ResultsScreen` | `tui/screens/results.py` | Summary + export |
310 | | `Sidebar` | `tui/components/sidebar.py` | Models + operations + context stats |
311 | | `ContextPreview` | `tui/components/context.py` | Shows loaded files + vault notes |
312 | | `LiveOutput` | `tui/components/output.py` | Streaming model output per agent |
313 | | `ProgressBar` | `tui/components/progress.py` | Operation progress display |
314 | | `CommandBar` | `tui/components/command.py` | Bottom input bar |
315 | | `ModelBadge` | `tui/components/badge.py` | Colored model indicator dot |
316 | 
317 | ---
318 | 
319 | ## Install & Run
320 | 
321 | ```bash
322 | pip install textual
323 | cd elith/tui
324 | python app.py
325 | 
326 | # or via CLI
327 | elith tui
328 | ```
329 | 
330 | ---
331 | 
332 | ## Notes For Johann
333 | 
334 | - Use `textual` library — not `curses`, not `rich` alone. Textual gives you proper layout, events, and reactive updates.
335 | - Every panel should update in real time via Textual's reactive system
336 | - The color scheme above is fixed — do not deviate
337 | - Keyboard shortcuts are non-negotiable — this is a terminal app
338 | - The progress bars should animate smoothly
339 | - Model names should always show their color badge (Bob=blue, Claude=orange etc.)
340 | - If a model is not configured, show it as `○` (inactive) not hidden
341 | 
342 | ---
343 | 
344 | *Elith TUI Specification — Johann — IBM Bob Hackathon 2026*
</content>
</file>
<file><path>docs/ELITH_UX_SPEC.md</path>
<content lines="1-431">
  1 | # Elith — Web Dashboard UX Specification
  2 | **Built with:** React + TypeScript + Tailwind CSS  
  3 | **Owner:** Johann (UI/UX)  
  4 | **Purpose:** Visual interface for the web dashboard — demo-ready, judge-facing
  5 | 
  6 | ---
  7 | 
  8 | ## Philosophy
  9 | 
 10 | The web dashboard is what judges see in the demo video.  
 11 | It must look like a **real product**, not a hackathon project.  
 12 | Clean. Black and white. Purple accents. No clutter. Every element earns its place.
 13 | 
 14 | ---
 15 | 
 16 | ## Design System
 17 | 
 18 | ### Colors
 19 | 
 20 | ```css
 21 | --bg-primary:     #000000;   /* pure black background */
 22 | --bg-secondary:   #0D0D0D;   /* panel backgrounds */
 23 | --bg-tertiary:    #141414;   /* card backgrounds */
 24 | --bg-hover:       #1A1A1A;   /* hover states */
 25 | --border:         #222222;   /* all borders */
 26 | --border-light:   #333333;   /* lighter borders */
 27 | 
 28 | --text-primary:   #FFFFFF;   /* main text */
 29 | --text-secondary: #888888;   /* secondary text */
 30 | --text-muted:     #444444;   /* muted text */
 31 | 
 32 | --accent:         #A855F7;   /* Elith purple */
 33 | --accent-dim:     #7C3AED;   /* darker purple */
 34 | --accent-glow:    rgba(168, 85, 247, 0.15); /* purple glow */
 35 | 
 36 | /* Model colors */
 37 | --bob:            #3B82F6;   /* IBM blue */
 38 | --claude:         #F97316;   /* orange */
 39 | --gemini:         #06B6D4;   /* cyan */
 40 | --codex:          #84CC16;   /* lime */
 41 | --local:          #8B5CF6;   /* violet */
 42 | 
 43 | /* Status colors */
 44 | --success:        #22C55E;
 45 | --warning:        #EAB308;
 46 | --error:          #EF4444;
 47 | --running:        #A855F7;   /* purple pulse */
 48 | ```
 49 | 
 50 | ### Typography
 51 | 
 52 | ```css
 53 | --font-mono:   'JetBrains Mono', 'Fira Code', monospace; /* terminal text */
 54 | --font-sans:   'Inter', system-ui, sans-serif;           /* UI text */
 55 | 
 56 | --text-xs:    0.75rem;
 57 | --text-sm:    0.875rem;
 58 | --text-base:  1rem;
 59 | --text-lg:    1.125rem;
 60 | --text-xl:    1.25rem;
 61 | --text-2xl:   1.5rem;
 62 | ```
 63 | 
 64 | ### Spacing & Radius
 65 | 
 66 | ```css
 67 | --radius-sm:  4px;
 68 | --radius-md:  8px;
 69 | --radius-lg:  12px;
 70 | --panel-gap:  16px;
 71 | --sidebar-w:  260px;
 72 | ```
 73 | 
 74 | ---
 75 | 
 76 | ## Layout — Main Dashboard
 77 | 
 78 | ```
 79 | ┌──────────────────────────────────────────────────────────────────┐
 80 | │  TOPBAR (56px)                                                    │
 81 | │  [◆ Elith]  repo: ~/projects/myapp     Bob ● Claude ● Gemini ○   │
 82 | ├──────────────┬──────────────────────────────────────────────────┤
 83 | │              │                                                    │
 84 | │  SIDEBAR     │            MAIN CONTENT AREA                      │
 85 | │  (260px)     │            (flexible)                             │
 86 | │              │                                                    │
 87 | │  Models      │   (Switches between panels below)                 │
 88 | │  Operations  │                                                    │
 89 | │  Context     │                                                    │
 90 | │  Stats       │                                                    │
 91 | │              │                                                    │
 92 | ├──────────────┴──────────────────────────────────────────────────┤
 93 | │  BOTTOM BAR (64px)                                               │
 94 | │  [ Task input...                          ] [Run] [Mode ▾]       │
 95 | └──────────────────────────────────────────────────────────────────┘
 96 | ```
 97 | 
 98 | ---
 99 | 
100 | ## Pages / Views
101 | 
102 | ---
103 | 
104 | ### Page 1 — Landing / Repo Setup
105 | 
106 | Clean centered layout. First thing user sees.
107 | 
108 | **Elements:**
109 | - Elith logo (◆ symbol + wordmark) centered
110 | - Tagline: *"Load less. Think deeper. Ship better."*
111 | - Repo path input field
112 | - Obsidian vault path input (optional, with toggle)
113 | - Model selector — toggle each model on/off (Bob always on)
114 | - "Start Session" button (purple, full width)
115 | - Recent sessions list (last 5, clickable)
116 | 
117 | **Design notes:**
118 | - Logo has a subtle purple glow animation on load
119 | - Input fields: dark background, white text, purple focus ring
120 | - Model toggles: colored dot per model, greyed out when off
121 | - "Start Session" button pulses once on hover
122 | 
123 | ---
124 | 
125 | ### Page 2 — Main Workspace
126 | 
127 | The core dashboard. Four panels in a grid.
128 | 
129 | ```
130 | ┌──────────────┬──────────────────────────┬─────────────────────┐
131 | │              │                          │                      │
132 | │  SIDEBAR     │   CONTEXT PREVIEW        │   LIVE OUTPUT        │
133 | │              │                          │                      │
134 | │  Models      │   Files loaded (6/312)   │   Bob  ──────────   │
135 | │  ● Bob       │   ─────────────────────  │   > Analyzing...    │
136 | │  ● Claude    │   auth/views.py     →    │   > Found pattern   │
137 | │  ○ Gemini    │   auth/models.py    →    │                      │
138 | │  ○ Codex     │   config/settings   →    │   Claude ─────────  │
139 | │  ○ Local     │   requirements.txt  →    │   > Reasoning...    │
140 | │              │   README.md         →    │                      │
141 | │  Operations  │                          │   ▓▓▓▓▓░░░  60%     │
142 | │  ──────────  │   Vault Notes (3)        │                      │
143 | │  Explain     │   ─────────────────────  │                      │
144 | │  Architect ◀ │   auth-decisions.md →    │                      │
145 | │  Refactor    │   tech-debt.md      →    │                      │
146 | │  Test Gen    │   coding-standards  →    │                      │
147 | │  Document    │                          │                      │
148 | │  Risk Scan   │   Token savings:         │                      │
149 | │  Harden      │   ~4,200 tokens saved    │                      │
150 | │  Review      │   vs full repo load      │                      │
151 | │              │                          │                      │
152 | └──────────────┴──────────────────────────┴─────────────────────┘
153 | │  > architect the auth module                    [Run] [Parallel▾]│
154 | └──────────────────────────────────────────────────────────────────┘
155 | ```
156 | 
157 | ---
158 | 
159 | ### Page 3 — Architecture Proposals
160 | 
161 | Full-width cards showing Bob + Claude's novel proposals.
162 | 
163 | **Layout:**
164 | - Page title: "Architecture Proposals" with Bob + Claude badges
165 | - Two cards side by side (Option A / Option B)
166 | - Each card contains:
167 |   - Option name + badge (e.g. "Recommended")
168 |   - "Why not the standard answer" section
169 |   - The actual proposal (concise)
170 |   - Tradeoffs table (3 columns: ✓ Pro, ✗ Con, ~ Neutral)
171 |   - Migration path (numbered steps)
172 |   - "Implement This" button
173 | 
174 | **Design notes:**
175 | - Option A card has a subtle purple glow border (recommended)
176 | - Option B card has standard border
177 | - Tradeoffs use green/red/gray colored text
178 | - "Implement This" button: purple, full card width
179 | 
180 | ---
181 | 
182 | ### Page 4 — Live Execution
183 | 
184 | Split view showing each model working simultaneously.
185 | 
186 | **Layout:**
187 | - Three execution panels (Bob, Gemini, Claude) in a row
188 | - Each panel has:
189 |   - Model name + colored dot + status badge (running/done/waiting)
190 |   - Live streaming output (monospace font, auto-scroll)
191 |   - File being modified
192 |   - Mini progress bar
193 | 
194 | **Design notes:**
195 | - Output streams in real time character by character
196 | - Done panels show a green checkmark and stop animating
197 | - Running panels have a subtle pulse on their color dot
198 | - Overall progress bar at the bottom spanning all panels
199 | 
200 | ---
201 | 
202 | ### Page 5 — Results Summary
203 | 
204 | Clean results page after session completes.
205 | 
206 | **Layout:**
207 | - "Session Complete" header with checkmark + time taken
208 | - "What Changed" section — list of modified files with diff preview on hover
209 | - "Why" section — Bob's plain-language explanation
210 | - "Models Used" section — badges showing which model did what
211 | - "Context Efficiency" stats — files loaded vs total, tokens saved
212 | - Bob Report download button
213 | - Two CTA buttons: "New Task" and "View Full Diff"
214 | 
215 | ---
216 | 
217 | ## Component Library
218 | 
219 | ### ModelBadge
220 | ```
221 | ● Bob      (blue dot + "Bob" label)
222 | ● Claude   (orange dot + "Claude" label)
223 | ○ Gemini   (cyan dot, dimmed when inactive)
224 | ```
225 | 
226 | ### OperationCard
227 | ```
228 | ┌─────────────────────┐
229 | │  ⚡ Architect        │
230 | │  Bob + Claude       │
231 | │  Novel arch gen     │
232 | └─────────────────────┘
233 | ```
234 | Hover state: purple border glow
235 | 
236 | ### FileChip
237 | ```
238 | [ auth/views.py  × ]
239 | ```
240 | Small pill, shows loaded files, dismissible
241 | 
242 | ### LiveOutputPanel
243 | ```
244 | ┌─────────────────────────────────┐
245 | │  ● Bob                 running  │
246 | │  ─────────────────────────────  │
247 | │  > Analyzing patterns...        │
248 | │  > Found 3 issues...            │
249 | │  > Proposing fix...             │
250 | │                  ▓▓▓▓▓░░  70%  │
251 | └─────────────────────────────────┘
252 | ```
253 | 
254 | ### ProposalCard
255 | ```
256 | ┌──────────────────────────────────────┐
257 | │  Option A — JWT + Redis Hybrid  ★    │
258 | │  ────────────────────────────────    │
259 | │  Why not standard JWT:               │
260 | │  [explanation text]                  │
261 | │                                      │
262 | │  Tradeoffs:                          │
263 | │  ✓ Revocable  ✓ Fast  ✗ Redis dep   │
264 | │                                      │
265 | │  [ Implement This ]                  │
266 | └──────────────────────────────────────┘
267 | ```
268 | 
269 | ### StatCard
270 | ```
271 | ┌──────────────────┐
272 | │  Files Loaded    │
273 | │  6 / 312         │
274 | │  98% savings     │
275 | └──────────────────┘
276 | ```
277 | 
278 | ### ProgressBar
279 | ```
280 | [▓▓▓▓▓▓▓░░░]  70%  — Bob refactoring auth...
281 | ```
282 | Purple fill, animates smoothly
283 | 
284 | ---
285 | 
286 | ## Animations
287 | 
288 | | Element | Animation |
289 | |---------|-----------|
290 | | Logo on load | Fade in + subtle purple glow pulse |
291 | | Operation selected | Card lifts (shadow) + purple border |
292 | | Live output text | Character-by-character stream |
293 | | Progress bar | Smooth fill, no jumps |
294 | | Model dot (running) | Slow pulse in model color |
295 | | Model dot (done) | Solid green, no pulse |
296 | | Proposal cards | Slide in from bottom on appear |
297 | | Results page | Fade in items sequentially |
298 | 
299 | **Rule:** No animation longer than 300ms. No bouncing. No excessive motion. This is a dev tool, not a marketing site.
300 | 
301 | ---
302 | 
303 | ## Responsive Behavior
304 | 
305 | | Screen | Behavior |
306 | |--------|---------|
307 | | > 1280px | Full 3-panel layout |
308 | | 1024–1280px | Sidebar collapses to icons only |
309 | | 768–1024px | Single panel, tabs to switch |
310 | | < 768px | Not supported (dev tool) |
311 | 
312 | ---
313 | 
314 | ## Pages / Routes
315 | 
316 | ```
317 | /                   → Landing / repo setup
318 | /workspace          → Main dashboard
319 | /proposals          → Architecture proposals
320 | /execution          → Live execution view
321 | /results            → Session results
322 | /settings           → Model API keys + config
323 | ```
324 | 
325 | ---
326 | 
327 | ## React Component Tree
328 | 
329 | ```
330 | App
331 | ├── TopBar
332 | │   ├── ElithLogo
333 | │   ├── RepoBreadcrumb
334 | │   └── ModelStatusRow
335 | ├── Sidebar
336 | │   ├── ModelList
337 | │   │   └── ModelToggle (x5)
338 | │   ├── OperationList
339 | │   │   └── OperationItem (x8)
340 | │   └── ContextStats
341 | ├── MainContent (route-based)
342 | │   ├── LandingPage
343 | │   ├── WorkspacePage
344 | │   │   ├── ContextPreview
345 | │   │   └── LiveOutputPanel (x3)
346 | │   ├── ProposalsPage
347 | │   │   └── ProposalCard (x2)
348 | │   ├── ExecutionPage
349 | │   │   └── ModelExecutionPanel (x3)
350 | │   └── ResultsPage
351 | │       ├── ChangeSummary
352 | │       ├── WhyExplanation
353 | │       ├── ModelsUsed
354 | │       └── ContextStats
355 | └── BottomBar
356 |     ├── TaskInput
357 |     ├── RunButton
358 |     └── ModeSelector
359 | ```
360 | 
361 | ---
362 | 
363 | ## Zustand Store Shape
364 | 
365 | ```typescript
366 | interface ElithStore {
367 |   // Repo
368 |   repoPath: string;
369 |   vaultPath: string;
370 | 
371 |   // Models
372 |   activeModels: {
373 |     bob: boolean;
374 |     claude: boolean;
375 |     gemini: boolean;
376 |     codex: boolean;
377 |     local: boolean;
378 |   };
379 | 
380 |   // Context
381 |   loadedFiles: string[];
382 |   loadedVaultNotes: string[];
383 |   tokensSaved: number;
384 | 
385 |   // Session
386 |   currentOperation: string | null;
387 |   sessionStatus: 'idle' | 'running' | 'done' | 'error';
388 |   liveOutput: Record<string, string[]>; // model → output lines
389 | 
390 |   // Results
391 |   proposals: ArchProposal[];
392 |   sessionResult: SessionResult | null;
393 |   bobReportPath: string | null;
394 | }
395 | ```
396 | 
397 | ---
398 | 
399 | ## Notes For Johann
400 | 
401 | - Use Tailwind utility classes only — no custom CSS files except for the CSS variables above
402 | - Every component should be in its own file under `frontend/src/components/`
403 | - Use `useState` and Zustand — no Redux, no Context API
404 | - Live output streaming: use `EventSource` (SSE) from the FastAPI backend
405 | - The proposals page is the most important page — spend extra time on it
406 | - Mobile is not required — focus on 1280px+ desktop
407 | - Use `JetBrains Mono` from Google Fonts for all terminal/code output
408 | - Use `Inter` from Google Fonts for all UI text
409 | - Every panel should have a subtle `border: 1px solid var(--border)` — no shadows
410 | - The purple accent should be used sparingly — only for active states and CTAs
411 | 
412 | ---
413 | 
414 | ## Johann's Priority Order
415 | 
416 | Build in this exact order:
417 | 
418 | 1. Design system setup (CSS vars, fonts, Tailwind config)
419 | 2. TopBar + Sidebar shell (layout only, no logic)
420 | 3. Landing page (repo input, model toggles)
421 | 4. Workspace page with mock data
422 | 5. Proposals page with mock cards
423 | 6. Execution page with mock streaming
424 | 7. Results page
425 | 8. Wire to real API (You + Basil Joy will have endpoints ready)
426 | 9. Animations + polish
427 | 10. Demo video recording
428 | 
429 | ---
430 | 
431 | *Elith Web Dashboard UX Specification — Johann — IBM Bob Hackathon 2026*
</content>
</file>
<file><path>docs/ELITH_AGENT_SKILLS.md</path><file_outline>File: ELITH_AGENT_SKILLS.md (1058 lines)

String: # Elith — Agent Skills Specification (lines 1-1058)
  String: ## Why This Exists (lines 8-21)
  String: ## How Tool Calling Works Per Provider (lines 22-92)
    String: ### Anthropic (Claude) (lines 26-43)
    String: ### Google (Gemini) (lines 44-63)
    String: ### OpenAI (GPT/Codex) (lines 64-83)
    String: ### Ollama (Local LLM) (lines 84-92)
  String: ## Base Skill Interface (lines 93-155)
  String: ## Base Provider Interface (lines 156-188)
  String: ## The 12 Skills (lines 189-819)
    String: ### 1. read_file (lines 193-237)
    String: ### 2. write_file (lines 238-285)
    String: ### 3. list_files (lines 286-345)
    String: ### 4. search_code (lines 346-408)
    String: ### 5. git_diff (lines 409-459)
    String: ### 6. git_commit (lines 460-503)
    String: ### 7. run_tests (lines 504-558)
    String: ### 8. find_references (lines 559-607)
    String: ### 9. analyze_dependencies (lines 608-655)
    String: ### 10. explain_function (lines 656-708)
    String: ### 11. install_package (lines 709-756)
    String: ### 12. read_logs (lines 757-819)
  String: ## Skill Registry (lines 820-857)
  String: ## Claude Provider — Full Implementation (lines 858-915)
  String: ## IBM Bob Provider (lines 916-965)
  String: ## Model Router (lines 966-1025)
  String: ## Notes For Basil Joy (lines 1026-1058)
</file_outline>
<notice>This file is large (1057 lines). You will use the following strategy to understand this file:
- Inform the user you are going to use large file strategy, to efficiently understand the file
- Use the file_outline provided to get an overview of the file structure to help decide next action. This is not the full file. It is not the full depth of the contents.
- If you read the file, use precise file reads with line ranges for specific sections of interest
- Consider if other commands/tools are better suited for extracting information from that file type
- Use ask_followup_question tool if needed to identify the best next action
</notice></file>
</files>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:19.954Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.20

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Pending |
| 2 | Identify project stack, language, and build tools | Pending |
| 3 | Analyze documentation files to understand project architecture | Pending |
| 4 | Extract build/test/lint commands from configuration files | Pending |
| 5 | Identify code style patterns and conventions | Pending |
| 6 | Document non-obvious project-specific patterns | Pending |
| 7 | Create/update main AGENTS.md file | Pending |
| 8 | Create/update mode-specific AGENTS.md files in .bob directories | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Check for existing AGENTS.md files in project root and .bob directories
[-] Identify project stack, language, and build tools
[-] Analyze documentation files to understand project architecture
[ ] Extract build/test/lint commands from configuration files
[ ] Identify code style patterns and conventions
[ ] Document non-obvious project-specific patterns
[ ] Create/update main AGENTS.md file
[ ] Create/update mode-specific AGENTS.md files in .bob directories
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:23.755Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.31

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | In Progress |
| 3 | Analyze documentation files to understand project architecture | In Progress |
| 4 | Extract build/test/lint commands from configuration files | Pending |
| 5 | Identify code style patterns and conventions | Pending |
| 6 | Document non-obvious project-specific patterns | Pending |
| 7 | Create/update main AGENTS.md file | Pending |
| 8 | Create/update mode-specific AGENTS.md files in .bob directories | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<list_files>
<path>.</path>
<recursive>true</recursive>
</list_files>

---

**User:**

[list_files for '.'] Result:
🛡️ agent.md
docs/
docs/ELITH_AGENT_SKILLS.md
docs/ELITH_EXECUTION_STRATEGY.md
docs/ELITH_PROJECT_SPEC_backup.md
docs/ELITH_PROJECT_SPEC.md
docs/ELITH_TUI_SPEC.md
docs/ELITH_UX_SPEC.md
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:26.382Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.43

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | In Progress |
| 3 | Analyze documentation files to understand project architecture | In Progress |
| 4 | Extract build/test/lint commands from configuration files | Pending |
| 5 | Identify code style patterns and conventions | Pending |
| 6 | Document non-obvious project-specific patterns | Pending |
| 7 | Create/update main AGENTS.md file | Pending |
| 8 | Create/update mode-specific AGENTS.md files in .bob directories | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<ask_followup_question>
<question>I've analyzed the Elith project documentation. This is a **documentation-only repository** for an IBM Bob Hackathon project (May 15-17, 2026). There's no actual codebase yet - only specification documents.

The project plans to build:
- **Backend**: Python 3.10+ with FastAPI
- **TUI**: Python with Textual library
- **Frontend**: React + TypeScript + Tailwind CSS
- **Memory Layer**: Obsidian (markdown files)
- **Integrations**: IBM Bob, Claude, Gemini, GPT, Ollama

Since there's no code to analyze yet, I have two options:

**Option A**: Create AGENTS.md files based on the specifications, documenting the planned architecture, tech stack, and conventions from the spec docs. This would serve as guidance for when development begins.

**Option B**: Wait until actual code exists before creating AGENTS.md files, since the purpose is to document non-obvious patterns discovered by reading actual implementation files.

Which approach would you prefer?</question>
<follow_up>
<suggest>Option A - Create AGENTS.md now based on specs to guide development</suggest>
<suggest>Option B - Wait for actual code implementation before creating AGENTS.md</suggest>
<suggest>Create a minimal AGENTS.md noting this is pre-implementation with links to spec docs</suggest>
<suggest>Create template AGENTS.md files with placeholders for future implementation details</suggest>
</follow_up>
</ask_followup_question>

---

**User:**

[ask_followup_question for 'I've analyzed the Elith project documentation. This is a **documentation-only repository** for an IBM Bob Hackathon project (May 15-17, 2026). There's no actual codebase yet - only specification documents.

The project plans to build:
- **Backend**: Python 3.10+ with FastAPI
- **TUI**: Python with Textual library
- **Frontend**: React + TypeScript + Tailwind CSS
- **Memory Layer**: Obsidian (markdown files)
- **Integrations**: IBM Bob, Claude, Gemini, GPT, Ollama

Since there's no code to analyze yet, I have two options:

**Option A**: Create AGENTS.md files based on the specifications, documenting the planned architecture, tech stack, and conventions from the spec docs. This would serve as guidance for when development begins.

**Option B**: Wait until actual code exists before creating AGENTS.md files, since the purpose is to document non-obvious patterns discovered by reading actual implementation files.

Which approach would you prefer?'] Result:
<answer>
Option A - Create AGENTS.md now based on specs to guide development
</answer>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:44.159Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.54

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | In Progress |
| 3 | Analyze documentation files to understand project architecture | In Progress |
| 4 | Extract build/test/lint commands from configuration files | Pending |
| 5 | Identify code style patterns and conventions | Pending |
| 6 | Document non-obvious project-specific patterns | Pending |
| 7 | Create/update main AGENTS.md file | Pending |
| 8 | Create/update mode-specific AGENTS.md files in .bob directories | Pending |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Check for existing AGENTS.md files in project root and .bob directories
[x] Identify project stack, language, and build tools
[x] Analyze documentation files to understand project architecture
[-] Extract non-obvious patterns from specifications
[-] Create main AGENTS.md file based on specs
[-] Create mode-specific AGENTS.md files in .bob directories
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
docs/ELITH_EXECUTION_STRATEGY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:23:48.078Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.66

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | Completed |
| 3 | Analyze documentation files to understand project architecture | Completed |
| 4 | Extract non-obvious patterns from specifications | In Progress |
| 5 | Create main AGENTS.md file based on specs | In Progress |
| 6 | Create mode-specific AGENTS.md files in .bob directories | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<write_to_file>
<path>AGENTS.md</path>
<content># AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Status

**PRE-IMPLEMENTATION**: This is a specification-only repository for the IBM Bob Hackathon (May 15-17, 2026). No code exists yet. These guidelines are based on architectural specifications in [`docs/`](docs/).

## Critical Architecture Constraints

- **IBM Bob is the gold standard**: All other model integrations must match Bob's native repo-awareness capabilities
- **Context is expensive**: Only load 4-6 relevant files per task, never the full repo (see [`agent.md`](agent.md:270-285))
- **Obsidian is structured memory, not vector storage**: Treat vault as engineering decisions database, not generic context dump
- **No autonomous large-scale changes**: All operations must be scoped, explainable, and reviewable (see [`agent.md`](agent.md:127-133))

## Tech Stack (Planned)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Python 3.10+ + FastAPI | Orchestration and API layer |
| TUI | Textual (Python) | First-class terminal interface, not a fallback |
| Frontend | React + TypeScript + Tailwind | Demo-facing web dashboard |
| Memory | Obsidian (markdown) | Long-term engineering memory |
| Models | IBM Bob (native) + Claude/Gemini/GPT/Ollama (via skill layer) | Bob runs natively, others use tool calling |

## Non-Obvious Design Decisions

### Skill Layer Architecture
- **Bob runs natively** without skills - it already has repo access
- **All other models** get repo awareness through 12 agent skills ([`docs/ELITH_AGENT_SKILLS.md`](docs/ELITH_AGENT_SKILLS.md))
- Each provider (Claude/Gemini/GPT/Ollama) implements tool calling differently - see provider-specific implementations
- Skills are NOT optional wrappers - they're the core innovation that makes Elith work

### Context Engine Rules
- Context selection happens BEFORE model execution, not during
- Packet builder combines: repo scan + vault notes + task type → minimal file set
- Token savings is a first-class metric - must be visible in UI ([`docs/ELITH_PROJECT_SPEC.md`](docs/ELITH_PROJECT_SPEC.md:34))
- "Only the current task should decide what gets loaded" ([`agent.md`](agent.md:60))

### Novel Architecture Generation
- Standard AI answers are explicitly rejected - proposals must be codebase-specific
- Proposals must reference actual files/patterns from the target repo
- Each proposal requires: why-not-standard + tradeoffs + migration-path ([`docs/ELITH_PROJECT_SPEC.md`](docs/ELITH_PROJECT_SPEC.md:156-174))
- 6-8 hours of prompt iteration budgeted for this feature ([`docs/ELITH_EXECUTION_STRATEGY.md`](docs/ELITH_EXECUTION_STRATEGY.md:284))

### Bob Session Requirements
- Bob reports MUST be auto-exported to `/bob_sessions` directory
- Required for hackathon judging - never skip this ([`agent.md`](agent.md:449-460))
- Reports prove Bob usage and are submission evidence

## Project Structure (Planned)

```
elith/
├── backend/
│   ├── main.py                    # FastAPI entry
│   ├── context_engine/            # Smart file selection
│   ├── skills/                    # 12 repo-aware skills (THE CORE)
│   ├── providers/                 # One per model (bob/claude/gemini/openai/ollama)
│   └── operations/                # explain/architect/refactor/test-gen/etc
├── tui/                           # Textual terminal UI
├── frontend/                      # React dashboard
└── obsidian-template/             # Vault structure template
```

## Development Priorities

1. **Skill layer tool calling** (Hours 2-8) - If this breaks, core innovation is gone
2. **Novel architecture quality** (Hours 15-22) - Generic proposals kill the killer feature  
3. **End-to-end integration** (Hours 9-14) - No demo without full loop working

See [`docs/ELITH_EXECUTION_STRATEGY.md`](docs/ELITH_EXECUTION_STRATEGY.md:276-289) for critical path details.

## Coding Standards (From Specs)

- **Modular over monolithic**: Service separation, clean APIs, composable systems
- **Production-oriented**: No hackathon shortcuts that break in real use
- **Typed interfaces**: Python type hints, TypeScript strict mode
- **No giant files**: Split responsibilities, avoid tight coupling
- **Explainable**: Every architectural decision must have clear reasoning

See [`agent.md`](agent.md:310-333) for full standards.

## UI/UX Constraints

### TUI (Textual)
- Keyboard-driven, no mouse required
- Color scheme: black bg (#0A0A0A), purple accent (#A855F7), model-specific colors
- Must work in standard 80x24 terminal
- See [`docs/ELITH_TUI_SPEC.md`](docs/ELITH_TUI_SPEC.md) for full spec

### Web Dashboard  
- Pure black (#000000) background, purple (#A855F7) accents only
- JetBrains Mono for code, Inter for UI text
- No shadows, only borders - feels like engineering console
- Mobile not required - optimize for 1280px+ desktop
- See [`docs/ELITH_UX_SPEC.md`](docs/ELITH_UX_SPEC.md) for full spec

## Security Rules

- Never commit secrets, API keys, or credentials
- Validate `.gitignore` before any commit
- Use environment variables for all sensitive config
- If credentials detected: STOP immediately ([`agent.md`](agent.md:400-421))

## Demo Requirements

The 3-minute demo must show:
1. Bob running natively on a task
2. Same task on Claude with Elith skills - same quality output
3. Context reduction visible (6 files loaded vs 312 total)
4. Novel architecture proposals that are repo-specific, not generic

See [`docs/ELITH_EXECUTION_STRATEGY.md`](docs/ELITH_EXECUTION_STRATEGY.md:305-332) for demo script.

## When Implementation Begins

**UPDATE THIS FILE** with:
- Actual build/test/lint commands from `pyproject.toml` and `package.json`
- Non-obvious patterns discovered in code (not specs)
- Custom utilities and their required usage
- Hidden dependencies or coupling between components
- Any deviations from these specifications

This file should get MORE specific and SHORTER as obvious information is removed and replaced with implementation discoveries.
</content>
<line_count>120</line_count>
</write_to_file>

---

**User:**

[write_to_file for 'AGENTS.md'] Result:
<file_write_result>
<path>AGENTS.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
AGENTS.md

# VSCode Open Tabs
AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:32:27.311Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.78

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | Completed |
| 3 | Analyze documentation files to understand project architecture | Completed |
| 4 | Extract non-obvious patterns from specifications | In Progress |
| 5 | Create main AGENTS.md file based on specs | In Progress |
| 6 | Create mode-specific AGENTS.md files in .bob directories | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<write_to_file>
<path>.bob/rules-code/AGENTS.md</path>
<content># Code Mode Rules (Non-Obvious Only)

## Pre-Implementation Status
This repository contains only specifications. When code exists, update this file with:

## Skill Layer Implementation (Critical)
- Each provider (Claude/Gemini/GPT/Ollama) has different tool calling syntax
- Claude uses `tool_use`, Gemini uses `function_calling`, OpenAI uses `tool_calling`
- All 12 skills must be registered in skill registry before provider initialization
- Skills MUST return consistent JSON structure across all providers
- Bob provider bypasses skill layer entirely - direct shell execution

## Context Engine Constraints
- File selection algorithm in `context_engine/packet_builder.py` must be deterministic
- Maximum 6 files per task packet - hard limit, not suggestion
- Vault reader must handle missing Obsidian directory gracefully
- Token counting happens BEFORE model execution, not after

## Provider Integration Gotchas
- Bob shell commands must be non-interactive (no prompts)
- Ollama requires local model download before first use
- API key validation must happen at provider initialization, not execution
- Each provider needs separate error handling for rate limits

## Testing Requirements
- Test files must be co-located with source (not separate test directory)
- Mock all external API calls in provider tests
- Skill tests must verify actual file system operations
- Integration tests require real repo (use test fixtures)

## File Organization Rules
- One skill per file in `backend/skills/`
- One provider per file in `backend/providers/`
- Operations in `backend/operations/` must be provider-agnostic
- No circular imports between context_engine and providers

## When Code Exists
Replace this template with actual non-obvious patterns discovered during implementation.
</content>
<line_count>40</line_count>
</write_to_file>

---

**User:**

[write_to_file for '.bob/rules-code/AGENTS.md'] Result:
<file_write_result>
<path>.bob/rules-code/AGENTS.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
.bob/rules-code/AGENTS.md

# VSCode Open Tabs
AGENTS.md,.bob/rules-code/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:32:59.854Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.90

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | Completed |
| 3 | Analyze documentation files to understand project architecture | Completed |
| 4 | Extract non-obvious patterns from specifications | In Progress |
| 5 | Create main AGENTS.md file based on specs | In Progress |
| 6 | Create mode-specific AGENTS.md files in .bob directories | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<write_to_file>
<path>.bob/rules-advanced/AGENTS.md</path>
<content># Advanced Mode Rules (Non-Obvious Only)

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
</content>
<line_count>44</line_count>
</write_to_file>

---

**User:**

[write_to_file for '.bob/rules-advanced/AGENTS.md'] Result:
<file_write_result>
<path>.bob/rules-advanced/AGENTS.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
.bob/rules-advanced/AGENTS.md

# VSCode Open Tabs
AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:33:15.434Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$1.03

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | Completed |
| 3 | Analyze documentation files to understand project architecture | Completed |
| 4 | Extract non-obvious patterns from specifications | In Progress |
| 5 | Create main AGENTS.md file based on specs | In Progress |
| 6 | Create mode-specific AGENTS.md files in .bob directories | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<write_to_file>
<path>.bob/rules-ask/AGENTS.md</path>
<content># Ask Mode Rules (Non-Obvious Only)

## Pre-Implementation Status
This repository contains only specifications. When code exists, update this file with:

## Documentation Context Constraints
- Obsidian vault structure is non-standard - not typical wiki organization
- Vault contains: architecture notes, decisions, tech debt, coding standards, task briefs
- Vault is NOT a vector database - it's structured engineering memory
- Notes are linked via markdown links, not tags or folders

## Architecture Explanation Rules
- Must reference actual spec files when explaining planned architecture
- Distinguish between "planned" (from specs) and "implemented" (from code)
- Context engine explanation requires understanding token economics
- Skill layer explanation must cover provider-specific tool calling differences

## Non-Obvious Terminology
- "Packet" = minimal context bundle (files + vault notes + task type)
- "Skill" = repo-aware tool (not AI capability)
- "Provider" = model wrapper (Bob/Claude/Gemini/etc)
- "Operation" = high-level task type (explain/architect/refactor/etc)
- "Novel architecture" = codebase-specific proposal (not textbook answer)

## Spec Document Organization
- [`agent.md`](../../agent.md) = system identity and philosophy
- [`docs/ELITH_PROJECT_SPEC.md`](../../docs/ELITH_PROJECT_SPEC.md) = technical architecture
- [`docs/ELITH_EXECUTION_STRATEGY.md`](../../docs/ELITH_EXECUTION_STRATEGY.md) = 48-hour build plan
- [`docs/ELITH_AGENT_SKILLS.md`](../../docs/ELITH_AGENT_SKILLS.md) = skill layer implementation
- [`docs/ELITH_TUI_SPEC.md`](../../docs/ELITH_TUI_SPEC.md) = terminal UI specification
- [`docs/ELITH_UX_SPEC.md`](../../docs/ELITH_UX_SPEC.md) = web dashboard specification

## Counterintuitive Design Decisions
- TUI is first-class interface, not fallback (see [`docs/ELITH_TUI_SPEC.md`](../../docs/ELITH_TUI_SPEC.md:8-12))
- Bob runs WITHOUT skills - it already has repo access natively
- Context selection happens BEFORE model execution, not during
- Token savings is a first-class metric, not optimization afterthought
- Obsidian is engineering memory, not generic context storage

## Hackathon-Specific Context
- Project deadline: May 15-17, 2026 (48 hours)
- Bob session reports required for judging - must auto-export
- Demo must show: Bob native → Claude with skills → same quality
- 3-minute demo constraint shapes all design decisions

## When Code Exists
Replace this template with actual non-obvious documentation patterns discovered during implementation.
</content>
<line_count>50</line_count>
</write_to_file>

---

**User:**

[write_to_file for '.bob/rules-ask/AGENTS.md'] Result:
<file_write_result>
<path>.bob/rules-ask/AGENTS.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
.bob/rules-ask/AGENTS.md

# VSCode Open Tabs
AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:33:39.097Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$1.16

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | Completed |
| 3 | Analyze documentation files to understand project architecture | Completed |
| 4 | Extract non-obvious patterns from specifications | In Progress |
| 5 | Create main AGENTS.md file based on specs | In Progress |
| 6 | Create mode-specific AGENTS.md files in .bob directories | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<write_to_file>
<path>.bob/rules-plan/AGENTS.md</path>
<content># Plan Mode Rules (Non-Obvious Only)

## Pre-Implementation Status
This repository contains only specifications. When code exists, update this file with:

## Architecture Planning Constraints
- Must distinguish between "Bob native capabilities" vs "skill layer replication"
- Context engine is NOT a vector database - it's deterministic file selection
- Novel architecture proposals must be codebase-specific, never generic
- All operations must be scoped, explainable, reviewable - no autonomous large-scale changes

## Critical Path Dependencies
1. Skill layer tool calling (Hours 2-8) - core innovation, if broken everything fails
2. Novel architecture quality (Hours 15-22) - killer feature, requires 6-8 hours prompt iteration
3. End-to-end integration (Hours 9-14) - no demo without full loop working

See [`docs/ELITH_EXECUTION_STRATEGY.md`](../../docs/ELITH_EXECUTION_STRATEGY.md:276-289) for details.

## Non-Standard Architecture Patterns
- **Skill layer is the innovation**: Not a wrapper, but the core that makes Elith work
- **Bob runs natively**: No skills needed - it already has repo access
- **Context selection is pre-execution**: Not dynamic during model run
- **Obsidian is structured memory**: Engineering decisions database, not vector storage
- **Token savings is first-class**: Must be visible in UI, not hidden metric

## Hidden Coupling Points
- Context engine depends on vault structure (must handle missing vault gracefully)
- Providers depend on skill registry initialization order
- Operations must be provider-agnostic (can't assume Bob-specific features)
- TUI and web dashboard share same backend API (must design for both)
- Bob session reports required for judging (auto-export to `/bob_sessions`)

## Performance Bottlenecks (Planned)
- File scanning on large repos (>1000 files) - needs optimization
- Vault note parsing if notes are large - consider caching
- Parallel provider execution may hit rate limits - needs coordination
- SSE streaming to frontend may buffer - needs proper chunking

## Demo-Driven Design Decisions
- 3-minute demo constraint shapes everything
- Must show: Bob native → Claude with skills → same quality
- Context reduction must be VISIBLE (6 files vs 312 total)
- Novel architecture proposals must be impressive, not generic
- All design decisions optimize for demo clarity over scalability

## Hackathon Submission Requirements
- Bob session reports in `/bob_sessions` directory (mandatory for judging)
- Demo video must be 2-3 minutes (not longer)
- Must prove Bob usage through exported reports
- GitHub repo must be public before submission
- Cover image and slides required for submission

## When Code Exists
Replace this template with actual non-obvious architectural patterns discovered during implementation.
</content>
<line_count>58</line_count>
</write_to_file>

---

**User:**

[write_to_file for '.bob/rules-plan/AGENTS.md'] Result:
<file_write_result>
<path>.bob/rules-plan/AGENTS.md</path>
<operation>created</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<environment_details>
# VSCode Visible Files
.bob/rules-plan/AGENTS.md

# VSCode Open Tabs
AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:34:13.444Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$1.29

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | Completed |
| 3 | Analyze documentation files to understand project architecture | Completed |
| 4 | Extract non-obvious patterns from specifications | In Progress |
| 5 | Create main AGENTS.md file based on specs | In Progress |
| 6 | Create mode-specific AGENTS.md files in .bob directories | In Progress |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<update_todo_list>
<todos>
[x] Check for existing AGENTS.md files in project root and .bob directories
[x] Identify project stack, language, and build tools
[x] Analyze documentation files to understand project architecture
[x] Extract non-obvious patterns from specifications
[x] Create main AGENTS.md file based on specs
[x] Create mode-specific AGENTS.md files in .bob directories
</todos>
</update_todo_list>

---

**User:**

[update_todo_list] Result:
Todo list updated successfully.
<environment_details>
# VSCode Visible Files
.bob/rules-plan/AGENTS.md

# VSCode Open Tabs
AGENTS.md,.bob/rules-code/AGENTS.md,.bob/rules-advanced/AGENTS.md,.bob/rules-ask/AGENTS.md,.bob/rules-plan/AGENTS.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-15T19:34:17.497Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$1.43

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>plan</slug>
<name>📝 Plan</name>
====

REMINDERS

Below is your current list of reminders for this task. Keep them updated as you progress.

| # | Content | Status |
|---|---------|--------|
| 1 | Check for existing AGENTS.md files in project root and .bob directories | Completed |
| 2 | Identify project stack, language, and build tools | Completed |
| 3 | Analyze documentation files to understand project architecture | Completed |
| 4 | Extract non-obvious patterns from specifications | Completed |
| 5 | Create main AGENTS.md file based on specs | Completed |
| 6 | Create mode-specific AGENTS.md files in .bob directories | Completed |


IMPORTANT: When task status changes, remember to call the `update_todo_list` tool to update your progress.

</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
AGENTS.md files created successfully for pre-implementation guidance.

**Created files:**
- [`AGENTS.md`](AGENTS.md) - Main project guidance with tech stack, architecture constraints, and development priorities
- [`.bob/rules-code/AGENTS.md`](.bob/rules-code/AGENTS.md) - Code mode rules for skill layer and provider implementation
- [`.bob/rules-advanced/AGENTS.md`](.bob/rules-advanced/AGENTS.md) - Advanced mode rules for MCP/Browser tool integration
- [`.bob/rules-ask/AGENTS.md`](.bob/rules-ask/AGENTS.md) - Ask mode rules for documentation and terminology
- [`.bob/rules-plan/AGENTS.md`](.bob/rules-plan/AGENTS.md) - Plan mode rules for architecture planning and hackathon requirements

**Key non-obvious patterns documented:**
- Skill layer is the core innovation (not a wrapper)
- Bob runs natively without skills
- Context selection happens before model execution
- Token savings is a first-class metric
- Obsidian is structured memory, not vector storage
- Bob session reports mandatory for judging

All files include instructions to update with actual implementation discoveries once code exists.
</result>
</attempt_completion>

