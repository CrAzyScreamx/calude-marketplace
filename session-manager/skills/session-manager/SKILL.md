---
name: session-manager
description: Adds commands to manage a session in the project, /start-session to start a session and /summarize-session to summarize the session and update the summary.md file.
---

# Trigger condition
- User types /start-session or /summarize-session in the chat to trigger the skill.

# Commands

## /start-session
- When the user types /start-session, the skill will look for a file named summary.md in the current project folder.
- When the file is found, it will read the content to know where the previous session ended and what was done.
- The skill will then read the tasks.md file to know what tasks are pending to be done.
- If summary.md is not found or inconsistent with what tasks were done in tasks.md, the skill will notify the user about the inconsistency and read plan.md to know about the project and the plan.

## /summarize-session
- When the user types /summarize-session, the skill will update the summary.md file with the latest progress and what was done in the following format:
```
# Project Description
If its not in the file, add 2-3 sentences describing the project and its goals.

# Progress Summary - [DATE]
- Which tasks were completed in this session
```
