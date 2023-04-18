# Visual Blocks

Visual Blocks is a framework that allows any platform or application to easily
integrate a visual and user-friendly interface for ML creation. Visual Blocks
aims to help applications & platforms accelerate many stages of the ML product
cycle including pipeline authoring, model evaluation, data pipelining, model &
pipeline experimentation, and more. Visual Blocks enables these behaviors
through a JavaScript front-end library for low/no code editing and a separate JS
library embedding the newly created experience.

If you use Visual Blocks in your research, please reference it as:

```bibtex
@inproceedings{Du2023Rapsai,
  title = {{Rapsai: Accelerating Machine Learning Prototyping of Multimedia Applications Through Visual Programming}},
  author = {Du, Ruofei and Li, Na and Jin, Jing and Carney, Michelle and Miles, Scott and Kleiner, Maria and Yuan, Xiuxiu and Zhang, Yinda and Kulkarni, Anuva and Liu, Xingyu and Sabie, Ahmed and Orts-Escolano, Sergio and Kar, Abhishek and Yu, Ping and Iyengar, Ram and Kowdle, Adarsh and Olwal, Alex},
  booktitle = {Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems},
  year = {2023},
  publisher = {ACM},
  month = {Apr.},
  day = {22-29},
  numpages = {23},
  series = {CHI},
  doi = {10.1145/3544548.3581338},
}
```

# Components

**Node Graph Editor**

The node graph editor is a custom Angular component. It takes a graph JSON file
as input.

**Library of ML Nodes**

ML Nodes include Models, I/O (camera, image, mic, etc.), and Visualizations.

**Runtime**

The runner takes a graph json file and a list of nodes. It traverses the graph
to decide the execution order. For each node execution, it loads the Angular
component and uses the run function to run it.

# Visual Blocks in Google Colaboratory

There is a Visual Blocks Python package for use within [Google Colaboratory][]
notebooks.

[Google Colaboratory]: https://colab.research.google.com

## For Users

`!pip install visual_blocks` and `import visual_blocks` in your Colaboratory
notebooks. See the example notebooks in the directory [examples/](examples/).

## For Developers

`!pip install git+https://...` in a notebook will install the package straight
from the latest, unreleased source in Github. The notebooks in the
[tests/](tests/) directory use this method.

The directory [scripts/](scripts/) contains turnkey scripts for common developer
tasks such as building and uploading the Python distribution package.

### Build and upload package to TestPyPI

One time setup:

```bash
# Install `build`.
$ python3 -m pip install --upgrade build

# Install `twine`, and make sure its binary is in your PATH.
$ python3 -m pip install twine
```

Steps:

1.  Update the version number in [pyproject.toml](python/pyproject.toml).
1.  Run `rm -rf build` to clean up previous builds.
1.  Run `scripts/package` to build the package.
1.  Run `scripts/upload` to upload the package. You need to have the username
    and password ready.

# Contributions

We are not accepting contributions at this time. The Visual Blocks team will
contribute to this library.

# Copyright and license

Copyright under the Apache 2.0 license.

# Note

This is not an officially supported Google product. As this is an experimental
release aimed at starting a conversation and gauging community interest, we want
to explicitly communicate a lack of guarantee for long term maintenance.
