# Visualblocks Custom Nodes Devserver

## Serving Paths

The devserver serves all files in the `../../` directory (aka `visualblocks/custom_nodes/`). To load a custom node library, use a URL like `http://localhost:8080/packages/gemini/dist/bundle.js`.

## Development

Whenever a new custom node package is written, it should be added to the devserver's package.json so turborepo knows to restart the devserver when the package is changed. Packages that do not need to be served do not need to be added. Likewise, transitive dependencies do not need to be added (even if they need to be served), since Turborepo will need to recompile them to build their dependent package anyways.
