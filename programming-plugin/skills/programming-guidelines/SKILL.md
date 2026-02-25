---
name: programming-guidelines
description: "When asked to write code, follow these guidelines to ensure the code is clean, efficient, and maintainable. This should be used in python only."
---

# Important
This file is a set of specific guidelines to follow when writing code.


# Guidelines

## Files & Directories
- The directory tree should be organized in a logical way, that matches the project's idea. 
- Each directory should have a clear purpose, and files within it should be related to that purpose.
- Don't create files that are not necessary, and don't create directories that are not necessary.
- Each file should have a clear meaning and purpose
- Don't create files only for one function, unless the function or role is complex enough to warrant its own file.
- file names and directory names are in snake_case

## Classes
- Each class should be in a different file, ensuring clean separation of concerns and easier maintainability.
- If two classes are closely related, consider making a parent class and do inheritence, but still keep them in seperated files
- Each class should have a clear purpose

### Class Naming
- Class names should be by PascalCase, and should be descriptive of the class's purpose.
- Avoid using abbreviations in class names, unless they are widely recognized and commonly used in the programming community.
- Each class must have a description of its purpose and functionallity in its intitialization method, if there's no initialization method, then at the top of the class definition.

## Functions
- Each function should have a clear purpose and work on a single task.
- If the function is too complex, consider breaking it down into smaller functions that will be easier to maintain, and put them in the same file.

### Function Naming
- Function names should be in snake_case and should be descriptive of the function's purpose.
- Avoid using abbreviations in function names, unless they are widely recognized and commonly used in the programming community.
- Each function must have a description of its purpose and functionallity in its definition.

## Variables
- Variable names should be in snake_case and should be descriptive of the variable's purpose.
- Avoid using abbreviations in variable names, unless they are widely recognized and commonly used in the programming community.

## Comments
- Comments should be used to explain the purpose of the code, and to provide context for why certain decisions were made.
- Comments should be clear and concise, and should not be used to explain what the code is doing, but rather why it is doing it.
- Avoid over-commenting, as it can make the code harder to read and maintain. Only comment on complex or non-obvious code, and avoid commenting on code that is self-explanatory.

## Code Style
- Follow the PEP 8 style guide for Python code, which provides guidelines for code formatting, naming conventions, and other best practices.
- Use consistent indentation (4 spaces per indentation level) and avoid mixing tabs and spaces.
- Use blank lines to separate functions and classes, and to improve readability.
- Avoid long lines of code (more than 79 characters) to improve readability.
- Use meaningful variable names and avoid using single-letter variable names, except for loop counters or when the meaning is clear from the context.

## Testing
- After you finish a specific task or specific feature, use TaskCall to call agent `code-tester` that specializes in testing the code using pytest. Provide the agent with the feature or task you just finished.

## Additional Resources
- [PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/)
- [Python's official documentation](https://docs.python.org/3/)
- For usage examples, refere and see [examples.md](examples.md)
