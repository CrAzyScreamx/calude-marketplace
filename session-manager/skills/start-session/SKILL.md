---
name: start-session
description: Adds commands to manage a session in the project, /start-session to start a session and /summarize-session to summarize the session and update the summary.md file.
---

# Trigger condition
- User types /start-session to start a session in the project.

# Commands

## /start-session
- When the user types /start-session, the skill will look for a file named summary.md in the current project folder.
- When the file is found, it will read the content to know where the previous session ended and what was done.
- The skill will then read the tasks.md file to know what tasks are pending to be done.
- If summary.md is not found or inconsistent with what tasks were done in tasks.md, the skill will notify the user about the inconsistency and read plan.md to know about the project and the plan.
