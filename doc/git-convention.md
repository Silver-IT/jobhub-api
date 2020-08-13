## Git

### Branch names

When you work on a issue (from GitHub), create a new branch with the following format: ```issue-1234-description```, where 1234 is the issue number from github and description can be anything short that identifies your work textual. The reason for the text is that it is not always easy to keep all the issue numbers in mind, so a short text helps to understand what the branch is about.

Example: ```issue-273-add-street-filter```

### Commit messages

For commit messages, we use the following format:

```
issue #1234 - short description of change
 * detailed description 1
 * detailed description 2
```

It is important to mention the github issue number in the commit message so that it is also linked / visible in the issue on github for reference.

## IDE

### Format / Organize imports

Setup your IDE to automatically format the code / source files. Also use the existing code format, which is usually checked in along with the source code, or checking the code format you use if it does not exist in the repository yet. 

It is important that we all use the same code format so that change sets in pull requests and commits only contain the actual changes and not lines that only changed in formatting.

In eclipse it is possible to setup auto formatting on each save of the file. This should be enabled by default as then there is no way to forget this.
