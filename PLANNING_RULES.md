# AI PLANNING RULES

**CRITICAL DIRECTIVE FOR ALL AI AGENTS & SESSIONS:**

1. **PLAN FIRST**: When you receive a new request, you MUST evaluate, audit, and create a comprehensive execution plan first. 
2. **DO NOT IMPLEMENT YET**: Do not write source code, modify files, run state-changing commands, or execute database migrations until the user explicitly approves your plan.
3. **WAIT FOR APPROVAL**: Present the plan clearly to the user (e.g., using `implementation_plan.md`) and explicitly stop to wait for the user to say "Confirmed", "Approved", or provide their feedback before proceeding.
4. **ALIGN WITH SOURCE OF TRUTH**: Always cross-reference the project's core documentation (`CLAUDE.md`, `PRD.md`, `ARCHITECTURE.md`) to ensure the proposed solution perfectly aligns with the existing architecture, technology stack, and business rules.

**Remember:** This is a planning-first workspace. Do not execute or implement changes unless specifically and explicitly authorized by the user.
