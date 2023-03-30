# Visual Blocks

Visual Blocks is a framework that allows any platform or application to easily integrate a visual and user-friendly interface for ML creation. Visual Blocks aims to help applications & platforms accelerate many stages of the ML product cycle including pipeline authoring, model evaluation, data pipelining, model & pipeline experimentation, and more. Visual Blocks enables these behaviors through a JavaScript front-end library for low/no code editing and a separate JS library embedding the newly created experience.

# Components

**Node Graph Editor**

The node graph editor is a custom Angular component. It takes a graph json file as input. 

**Library of ML Nodes**

ML Nodes include Models, I/O (camera, image, mic, etc), and Visualizations.

**Runtime**

The runner takes a graph json file and a list of nodes. It traverses the graph to decide execution order. For each node execution, it loads the Angular component and uses the run function to run it.

# Contributions

We are not accepting external contributions at this time. The Visual Blocks team will contribute to this library. As this is an experimental release aimed at starting a conversation and gauging community interest, we want to explicitly communicate a lack of guarantee for long term maintenance. 

# Copyright and license
Copyright under the Apache 2.0 license.

# Note
This is not an officially supported Google product.
