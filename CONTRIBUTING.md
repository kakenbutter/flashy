# Contribution Guidelines

When contributing to `flashy`, please:

- Be respectful, civil, and open-minded. This may be a silly side project, but that doesn't mean you can do whatever you want.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/kakenbutter/flashy/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.

## How to Contribute

### Prerequisites

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/kakenbutter/flashy/issues/new/choose) describing the problem you would like to solve.

### Setup your environment locally

_Some commands will assume you have the Github CLI installed, if you haven't, consider [installing it](https://github.com/cli/cli#installation), but you can always use the Web UI if you prefer that instead._

In order to contribute to this project, you will need to fork the repository:

```bash
gh repo fork kakenbutter/flashy
```

then, clone it to your local machine:

```bash
gh repo clone <your-github-name>/flashy
```

Then, install the project's dependencies:

```bash
npm install
```

_or pnpm, yarn, bun_

### Implement your changes

This project is a Expo app. Check out the documentation at [docs.expo.dev](https://docs.expo.dev).

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc... You can use `git status` to double check which files have not yet been staged for commit:

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

### When you're done

Please make a manual, functional test of your changes.

When all that's done, it's time to file a pull request to upstream:

```bash
gh pr create --web
```

and fill out the title and body appropriately. Again, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines for your title.

## Credits

This documented was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/CONTRIBUTING.md).
