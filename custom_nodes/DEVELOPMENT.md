# Developing in the Custom Nodes Monorepo

VisualBlocks maintains a monorepo of custom node packages that can be directly loaded in the web interface and supporting packages that help with developing custom nodes.
The monorepo is orchestrated by [Turborepo](https://turbo.build/repo/docs) with [Changesets](https://github.com/changesets/changesets) for versioning. Packages bundle with 
[`tsup`](https://github.com/egoist/tsup) and / or [`esbuild`](https://esbuild.github.io/) and are distributed in the 
[ESModules format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) with `.js` extensions. We use [`eslint`](https://eslint.org/) and 
[`prettier`](https://prettier.io/) for linting and formatting.

## Development Commands

It's recommended (but not required) to globally install turborepo with `npm i -g turbo`. These commands are also available in the `custom_nodes` package.json if you prefer not to.

Available commands:
```
$ turbo run

  build
    @visualblocks/custom-node-types, @visualblocks/gemini, @visualblocks/node-utils, @visualblocks/scripts and 1 more
  clean
    @visualblocks/custom-node-types, @visualblocks/gemini, @visualblocks/node-utils, @visualblocks/scripts and 1 more
  lint
    @visualblocks/gemini, @visualblocks/node-utils, @visualblocks/scripts, @visualblocks/utility-nodes
  typecheck
    @visualblocks/gemini, @visualblocks/node-utils, @visualblocks/utility-nodes
  upload-to-gcp
    @visualblocks/gemini, @visualblocks/scripts, @visualblocks/utility-nodes
  bundle
    @visualblocks/gemini, @visualblocks/utility-nodes
  dev
    @visualblocks/devserver
```

There's also a command for formatting with Prettier:
```sh
# custom_nodes/
npm run format
```

### Devserver
Run `turbo dev` to run an auto-updating devserver on port 8080. See [the devserver readme](custom_nodes/apps/devserver/README.md) for more.

## Updating a Package
1. Make your changes as you normally would, but don't commit yet.
2. Run `npm run lint`
3. Run `npm run format`
4. If your change would cause a version bump in any packages, run `npm changeset` in the `custom_nodes` directory to create
a changeset for your PR. Changeset should detect what packages you've changed.
5. Commit (possibly multiple times) and send a PR.

## Publishing
### Setup for GCP
1. Install `gsutil`
2. Run `gcloud auth login`
3. Run `gcloud config set project learnjs-174218` to set the project.

### Steps to Publish
1. Run `npm version-packages` in `custom_nodes/`. This will apply all pending changesets, adding their contents to the CHANGELOG and bumping package versions.
2. Commit the changes and get them merged into `main`.
3. Fetch `main` and run `npm publish-bundles-to-gcp`.
4. This is were we would publish to NPM, but we don't do that yet.

