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

The node graph editor is a custom Angular component. It takes a JSON object as the
specifications of nodes (i.e. their inputs, outputs, properties, etc), and output
the graph structure on changes (e.g. node added, edge deleted, etc).

**Library of ML Nodes**

ML Nodes include Models, I/O (camera, image, mic, etc.), and Visualizations.

**Runtime**

The runner takes a graph json file and a list of nodes. It traverses the graph
to decide the execution order. For each node execution, it loads the Angular
component and uses the run function to run it.

# Visual Blocks in Google Colaboratory

There is a Visual Blocks Python package for use within [Google Colaboratory][]
notebooks. It allows you to register python functions defined in the notebook with Visual Blocks, and it provides an interactive UI where you can easily build ML pipelines to execute those functions along with other ML-related nodes.

[Google Colaboratory]: https://colab.research.google.com

## For Users

Follow the steps below to get started in Colab with Visual Blocks. You can also check out the example notebooks in the directory [examples/](examples/), or watch the [tutorial](https://www.youtube.com/watch?v=UpJb4Y6wU5o).

### Step 1: Install Visual Blocks

```
!pip install visualblocks
```

### Step 2: Write an inference function

The inference function should perform inference on the model of your chosen. It
is your responsibility to import required packages that make the function work.
For TF or TFLite models, you can find instructions on how to import and use them on [TF Hub].

[TF Hub]: https://tfhub.dev

There are three types of inference functions supported by Visual Blocks:

1. **generic**: Generic inference functions accept input tensors and return output tensors.
1. **text_to_text**: Text to text inference functions accept strings and return output strings.
1. **text_to_tensors**: Text to tensors inference functions accept strings and return output tensors.

When writing your inference function note the following:

*  **Args**: The type of input tensors should be a list of NumPy arrays.
*  **Returns**: The type of output tensors should be a list of NumPy arrays.
* Ensure the dimensions of the input and output NumPy arrays align with the expected tensor dimensions of your model.

For references on how to define an inference function, check out the example notebooks in the directory [examples/](examples/).

### Step 2b (optional): Register inference functions dynamically

If you would like to view changes made to inference functions in the Visual Blocks UI without needing to re-run the Visual Blocks server, you can use a Visual Blocks decorator.

To do this, import the decorator ```from visualblocks import register_vb_fn```, and decorate the inference function by using ```@register_vb_fn(type='[inference type]')``` and specify the type of inference function: `generic`, `text_to_text`, or `text_to_tensors`. For example, to decorate a *generic* inference function: ```@register_vb_fn(type='generic')```.

Check out the [Quick Start Style Transfer Example](https://github.com/google/visualblocks/blob/main/examples/quick_start_style_transfer.ipynb) for reference.

### Step 3: Import Visual Blocks and start server

If you do not use the function decorator ```register_vb_fn```, pass each inference function with its inference type in the ```visualblocks.Server()``` function. For example:

```python
# Pass each inference function in the Visual Blocks server
# when not using the decorator function

import visualblocks
server = visualblocks.Server(generic=my_fn1)

# You can also pass multiple functions:
# server = visualblocks.Server(generic=(my_fn1, my_fn2), text_to_text=(my_fn3))
```

When using the function decorator ```register_vb_fn```, you do not need to pass inference functions in the Visual Blocks server. Example:

```python
# Do not pass inference functions in the Visual Blocks server
# when using the decorator function

import visualblocks
server = visualblocks.Server()
```

### Step 4: Display Visual Blocks UI

In a seperate cell, call the `display` function to view the Visual Blocks graphical development environment in your Colab notebook.

```python
server.display()
```

### Step 5: Share the notebook

In Visual Blocks UI, you can click the `Save to Colab` button to save the pipeline
to the notebook. You can then share the notebook with others and they will see the
exact pipeline.

⚠️ When running a notebook with saved Visual Blocks pipeline, please do not "Run all".
The cell with `server.display()` has to be run manually after all the other cells have
finished running.

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
