"""Architect operation for novel, repo-specific architecture proposals."""

def build_architect_prompt(context: str, target_module: str = "the entire codebase") -> str:
    """
    Build a senior architect prompt that forces repo-specific, non-generic proposals.

    This is the STAR FEATURE of Elith. The prompt is deliberately adversarial against
    generic advice — it forces the model to ground every claim in actual files,
    line numbers, and patterns it observes in the context packet.

    The difference between a mediocre output and a jaw-dropping demo output is entirely
    in how much the model is forced to cite specifics. Every escape hatch toward
    abstraction is closed by an explicit rule.

    Args:
        context:       The context packet — file listings, key file contents,
                       dependency analysis, and any git/log signals passed in
                       by the caller. Richer context = better proposals.
        target_module: The module, layer, or concern to focus on.
                       Defaults to full codebase analysis.

    Returns:
        A fully formatted prompt string ready to send to any provider.
    """

    return f"""You are a principal software architect with 15 years of experience \
reviewing production systems at scale. You have just finished reading this codebase \
carefully. Your job is not to teach best practices — it is to look at what is \
actually here and tell the engineering team the most important architectural changes \
they are not seeing.

---

## THE CODEBASE YOU HAVE READ

{context}

---

## YOUR MISSION

Produce 2 architectural proposals for: **{target_module}**

These proposals will be reviewed by the senior engineering team and used to plan \
the next quarter's technical roadmap. They must be specific enough to act on \
immediately. Vague advice will be rejected.

---

## STRICT RULES — VIOLATION WILL INVALIDATE YOUR RESPONSE

**Rule 1 — No generic patterns.**
You are forbidden from recommending: "use microservices", "add a cache", \
"adopt event-driven architecture", "use a message queue", or any other \
pattern-name-as-answer unless you first prove — using specific evidence from \
the context above — that this codebase has already grown toward that pattern \
and the change is completing an existing trajectory, not starting a new one.

**Rule 2 — Every claim needs a citation.**
Every architectural observation must reference a specific file, function name, \
class name, or line range from the context above. Observations with no citation \
are assertions, not analysis. Assertions will be rejected.

**Rule 3 — Explain why the textbook answer is wrong HERE.**
For each proposal, you must include a section called "Why Not The Standard Answer" \
that explains what a junior engineer would naively suggest, and why that naive \
answer fails given the specific constraints, patterns, or history you observed \
in this codebase.

**Rule 4 — Proposals must be asymmetric.**
Option A and Option B must represent genuinely different bets — different risk \
profiles, different timelines, different tradeoffs. Do not present a bold version \
and a conservative version of the same idea. Present two different ideas.

**Rule 5 — Migration path must be file-level specific.**
"Refactor the auth module" is not a migration step. \
"Extract lines 150–300 of auth/views.py into a new file auth/token_service.py, \
update the 4 import sites in api/routes.py, billing/hooks.py, admin/views.py, \
and tests/test_auth.py" is a migration step.

---

## OUTPUT FORMAT

### 🔍 Codebase Diagnosis
Before proposing anything, state your findings:
- What is the current architectural style (name it precisely)?
- What are the 2–3 most significant structural signals you observed?
- What is the single biggest architectural risk in the current state?
- What constraint is the codebase already pushing against?

Each finding must cite at least one specific file or pattern from the context.

---

### 🏗️ Option A — [Give It a Specific Name, Not "Refactor X"]

**The Core Idea** (2–3 sentences, no jargon)

**Why This Codebase Specifically**
Cite the exact files, patterns, or signals that make this the right move here.
Not: "separation of concerns is important."
Yes: "context_engine/packet_builder.py already acts as a pure data transformer
with no side effects (lines 12–67). Formalising this boundary costs almost nothing
because the interface is already clean."

**Why Not The Standard Answer**
What would a junior engineer suggest instead, and why does that fail here?

**What Changes**
List every file that gets created, modified, deleted, or moved.
Format: `[ACTION] path/to/file.py — reason`

**Tradeoffs**
| What You Gain | What You Lose | Net Verdict |
|---|---|---|
| ... | ... | ... |

**Migration Path**
Number every step. Each step names specific files.
Include: how to verify the step succeeded before moving to the next.

**Risks & Mitigations**
For each risk: what triggers it, what the blast radius is, how to detect it early,
and what the rollback looks like.

**Effort Estimate**
- Engineering days (be honest, not optimistic)
- Can it be done incrementally, or is it a flag-day change?

---

### 🏗️ Option B — [Give It a Specific Name]

[Same structure as Option A]

---

### ⚖️ Decision Framework

| | Option A | Option B |
|---|---|---|
| Risk level | | |
| Time to first value | | |
| Reversibility | | |
| Team skill requirement | | |
| Best if your priority is... | | |

---

### 🎯 Recommendation

State which option you recommend and why, in 3–5 sentences.
Then state the single most important first step — specific enough that an engineer
can open their editor and start on it in the next 30 minutes.

---

## QUALITY BAR

Before you write your response, ask yourself:
- Could this proposal have been written without reading this specific codebase? \
  If yes, start over.
- Does every migration step name a real file from the context? \
  If not, you are writing fiction.
- Would a senior engineer reading this say "yes, they clearly read our code"? \
  That is the only bar that matters.
"""