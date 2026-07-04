# ChatGPT GitHub Action Integration

This folder contains the setup package for a private custom GPT that can inspect screenshots, inspect this repository, edit files, push commits, manage branches, run workflows, and open pull requests through GitHub's REST API.

It does not contain a GitHub token. Never commit tokens, API keys, or private setup notes to this repository.

## What This Gives ChatGPT

- Read current files from `A-engi/FieldOpsAtlas-Web`
- Read historical files by branch, tag, or commit SHA
- Create, update, and delete repository files through commits
- Create, update, force-update, and delete Git references
- Compare branches and commits
- Open and update pull requests
- Trigger repository workflows
- Trigger a GitHub Pages rebuild

This is full repository control for this repo through selected GitHub REST endpoints. It is not organization-wide control, billing control, or account control.

## Token Permission

Use one of these:

- Preferred: a fine-grained personal access token scoped only to `A-engi/FieldOpsAtlas-Web`
- Simpler: a classic personal access token with `repo` and `workflow` scopes

For a fine-grained token, grant these repository permissions:

- Metadata: Read
- Contents: Read and write
- Pull requests: Read and write
- Issues: Read and write
- Actions: Read and write
- Workflows: Read and write
- Pages: Read and write
- Administration: Read and write, only if you want ChatGPT to alter repo settings later

Do not grant organization permissions, billing permissions, secrets permissions, Codespaces permissions, Dependabot secrets, or package publishing unless you have a separate reason.

GitHub documents fine-grained token endpoint permissions here:
https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens

## Custom GPT Setup

1. Open ChatGPT.
2. Create a private custom GPT.
3. Put the contents of `gpt-instructions.md` into the GPT instructions.
4. Add an Action.
5. Import `openapi.yaml`.
6. Set Authentication to API Key.
7. Use Bearer authentication.
8. Paste the GitHub token in the GPT editor authentication field.
9. Keep the GPT private.

OpenAI documents GPT Action authentication here:
https://developers.openai.com/api/docs/actions/authentication

## How To Use It

In ChatGPT, ask for work in this shape:

```text
Inspect this screenshot and the current RF page. Make the page match the screenshot.
Use the GitHub action to inspect files, edit the repo directly, commit to main,
trigger Pages rebuild, and tell me the changed files and commit SHA.
```

For risky changes, be explicit:

```text
You may delete obsolete RF renderer files if they are no longer referenced.
```

Without an explicit instruction like that, the GPT instructions tell ChatGPT to avoid destructive operations.

