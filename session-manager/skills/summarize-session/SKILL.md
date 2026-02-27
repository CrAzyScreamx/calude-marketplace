---
name: summarize-session
description: Adds the /summarize-session command to summarize the session and update the summary.md file with the latest progress and what was done in the session.
---

# Trigger condition
- User types /summarize-session to summarize the session and update the summary.md file with the latest progress and what was done in the session.

# Commands

## /summarize-session
- When the user types /summarize-session, the skill will update the summary.md file with the latest progress and what was done in the following format:
```
# Project Description
If its not in the file, add 2-3 sentences describing the project and its goals.

# Progress Summary - [DATE]
- Which tasks were completed in this session
```