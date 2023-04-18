# Visual Blocks

Visual Blocks is a framework that allows any platform or application to easily integrate a visual and user-friendly interface for ML creation. Visual Blocks aims to help applications & platforms accelerate many stages of the ML product cycle including pipeline authoring, model evaluation, data pipelining, model & pipeline experimentation, and more. Visual Blocks enables these behaviors through a JavaScript front-end library for low/no code editing and a separate JS library embedding the newly created experience.

# Components

**Node Graph Editor**

The node graph editor is a custom Angular component. It takes a graph json file as input. 

**Library of ML Nodes**

ML Nodes include Models, I/O (camera, image, mic, etc), and Visualizations.

**Runtime**

The runner takes a graph json file and a list of nodes. It traverses the graph to decide execution order. For each node execution, it loads the Angular component and uses the run function to run it.

# Visual Blocks in Google Colaboratory

There is a Visual Blocks Python package for use within [Google Colaboratory][]
notebooks.

[Google Colaboratory]: https://colab.research.google.com

## For Users

`!pip install visual_blocks` and `import visual_blocks` in your Colaboratory
notebooks. See the example notebooks in the directory [examples/](examples/).

## For Developers

`!pip install git+https://...` in a notebook installs the package straight from
the latest, unreleased source in Github. The notebooks in the [tests/](tests/)
directory use this method.

The directory [scripts/](scripts/) contains turnkey scripts for common
developer tasks such as building and uploading the Python distribution package.

### Build and upload package to TestPyPI

One time setup:

```bash
# Install `build`.
$ python3 -m pip install --upgrade build

# Install `twine`, and make sure its binary is in your PATH.
$ python3 -m pip install twine
```

Steps:

1. Update the version number in [pyproject.toml](python/pyproject.toml).
1. Run `rm -rf build` to clean up previous builds.
1. Run `scripts/package` to build the package.
1. Run `scripts/upload` to upload the package. You need to have the username and
   password ready.
   
# Contributions

We are not accepting contributions at this time. The Visual Blocks team will contribute to this library.
# Copyright and license
Copyright under the Apache 2.0 license.

# Note
This is not an officially supported Google product. As this is an experimental release aimed at starting a conversation and gauging community interest, we want to explicitly communicate a lack of guarantee for long term maintenance.
