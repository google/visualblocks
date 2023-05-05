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

Follow the steps below to get started in Colab with Visual Blocks. You can also check out the example notebooks in the directory [examples/](examples/).

### Step 1: Install Visual Blocks

Add `!pip install visualblocks` at the top of your Colaboratory notebook.

### Step 2: Import Required Packages

* Import numpy with `import numpy as np`. Visual Blocks uses np.ndarrays as input and output tensors in Colab.
    
* Import TensorFlow with `import tensorflow as tf`. Visual Blocks works with TensorFlow based models.
   
```
import numpy as np
import tensorflow as tf

```

### Step 3: Import Your Model

Import TFLite or TFJS model(s) into the notebook. You can find TFLite and TFJS models with the instructions on how to import them to Colab on [TF Hub]. Depending on the source of the model, you may need to import additional packages into the notebook.

[TF Hub]: https://tfhub.dev

### Step 4: Write an Inference Function
 
The inference function should perform inference on the TensorFlow based model. There are two types of inference functions for Visual Blocks:

1. **generic**: Generic inference functions accept input tensors and output tensors.
1. **text_to_text**: Text to text inference functions accept strings and output strings.

When writing your inference function note the following:

*  **Args**: The inference function should accept a list of NumPy arrays as input tensors to your model. 
*  **Returns**: The inference function should return a list of NumPy arrays as output tensors.
* Ensure the dimensions of the input and output NumPy arrays align with the expected tensor dimensions of your model.

For references on how to define an inference function, check out the example notebooks in the directory [examples/](examples/).

### Step 4b (optional): Register Inference Functions Dynamically

If you would like to view changes made to inference functions in the Visual Blocks display without needing to re-run the Colab notebook, you can use a Visual Blocks decorator function.

To do this, import the following ```from visualblocks import register_vb_fn```.  Above each inference function, include the decorator function ```@register_vb_fn(type='[inference type]')``` and specify the type of inference function: generic or text_to_text. 

For example, to add the decorator function to a generic inference function include the following: ```@register_vb_fn(type='generic')```. Check out the [Quick Start Style Transfer Example](https://github.com/google/visualblocks/blob/main/examples/quick_start_style_transfer.ipynb) for reference. 

### Step 5: Import Visual Blocks
  
  In a new cell block, include `import visualblocks` to import Visual Blocks.
  
  Then include `server = visualblocks.Server()` to start a Visual Blocks server.

If you do not use the function decorator ```register_vb_fn```, pass each inference function with its inference type in the ```visualblocks.Server()``` function. For example:
    
```
# Pass each inference function in the Visual Blocks server 
# when not using the decorator function

import visualblocks
server = visualblocks.Server(generic=my_fn1)

# You can also pass multiple functions:
# server = visualblocks.Server(generic=(my_fn1, my_fn2), text_to_text=(my_fn3))
```

When using the function decorator ```register_vb_fn```, do not pass inference functions in the Visual Blocks server. Example:

```
# Do not pass inference functions in the Visual Blocks server 
# when using the decorator function

import visualblocks
server = visualblocks.Server()
```

### Step 6: Display Visual Blocks

In a seperate cell, add `server.display()`. Please do not "Run all" in the notebook. The last cell with `server.display()` has to be run manually after all the other cells have finished running.


After completing these steps, run the `server.display()` cell to view the Visual Blocks graphical development environment in your Colab notebook.

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
