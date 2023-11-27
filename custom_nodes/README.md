# Custom nodes in Visual Blocks

Visual Blocks offers over 70 pre-built nodes, which have been harnessed by our
creative community to craft diverse and innovative ML pipelines (explore our
[community gallery](https://visualblocks.withgoogle.com/#/community) for
inspiration). Yet, we understand that these built-in nodes may not always align
perfectly with your unique requirements. This is where custom nodes shine,
empowering developers to broaden the horizons of Visual Blocks by encapsulating
specialized logic, algorithms, or data transformations tailored precisely to
your needs.

## Table of contents

[Create a custom node](#create-a-custom-node)

- [Define `NodeSpec`](#define-nodespec)
- [Implement node logic with custom element](#implement-node-logic-using-custom-element)
- [Register custom node with Visual Blocks](#register-custom-node-with-visual-blocks)

[Use custom node in Visual Blocks](#use-custom-node-in-visual-blocks)

- [Bundle the custom node](#bundle-the-custom-node)
- [Start a local dev server to serve the bundle](#start-a-local-server-to-serve-the-bundle)
- [Add the custom node to Visual Blocks](#add-the-custom-node-to-visual-blocks)

[Publish a custom node](#publish-a-custom-node)

[Other topics](#other-topics)

- [Handle images](#handle-images)
- [Manually trigger a pipeline rerun](#manually-trigger-a-pipeline-rerun)
- [Show errors](#show-errors)
- [Shapes of input/output data](#shapes-of-inputoutput-data)

[Examples](#examples)

[Tips and tricks](#tips-and-tricks)

## Create a custom node

To create a custom node, write a Javascript/Typescript program that does the
following:

1. Define a `Node Specification` (or `NodeSpec`) that describes your node's
   metadata (e.g. name, description, inputs, properties, outputs, etc).

1. Create a [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
   that implements the logic of the node.

1. Register custom node with Visual Blocks using our API.

### Define `NodeSpec`

A `NodeSpec` is a JSON object that specifies various metadata of a node. It is
used to render the node UI and make sure it can properly interact with other
nodes.

Check out the [`node_spec.d.ts`](./types/src/node_spec.d.ts) typescript file for the full
documentation. Refer to the annotated screenshot below for a visual
representation of how a node is contructed and where each part is specified in
the `NodeSpec`.

<img src="./screenshots/node_structure.png" width="536"/>

The node `Make uppercase` shown in the screenshot above has the following
`NodeSpec`.

```javascript
const NODE_SPEC = {
  "id": "make-uppercase",
  "name": "Make uppercase",

  "category": "processor",

  "outputSpecs": [
    {
      "name": "result",
      "type": "string"
    }
  ],

  "inputSpecs": [
    {
      "name": "text",
      "type": "string",
      "editorSpec": {
        "type": "text_input"
      }
    }
  ],

  "propertySpecs": [
    {
      "name": "option",
      "type": "string",
      "editorSpec": {
        "type": "dropdown",
        "options": [
          {
            "value": "first-letter",
            "label": "First letter only"
          },
          {
            "value": "all-letters",
            "label": "All letters"
          }
        ]
      }
    }
  ]
};
```

Notes:

- `id` must be a [valid custom element tag](https://web.dev/custom-elements-v1/#rules-on-creating-custom-elements).
- For now, `category` needs to be chosen from this predefined list: `input`,
  `output`, `model`, `tensor`, `search`, `processor`, and `advanced`.
- `outputSpecs`, `inputSpecs`, and `propertySpecs` are all optional.
- Outputs don't have editors.
- *Properties* and *inputs* are very similar, except that you cannot connect an edge to a *property*.
- Each property or input can optionally have an associated editor.
  For an input, its editor will be hidden if it is connected by an edge,
  meaning the data is coming from the other end of the edge instead of the
  editor.
- Two nodes can only be connected by an edge if the output type of the source
  node matches (by string comparison) the input type of the target node.

### Implement node logic using custom element

Custom element is a web standard. It can be implemented using vanilla
JavaScript, or a number of third-party libraries (e.g.,
[Lit](https://lit.dev/)). Follow the steps below to make it work with Visual
Blocks:

1. Implement the `runWithInputs` method.

   ```javascript
   /**
    * Visual Blocks runtime will call this method at the proper moment with the
    * populated inputs data.
    *
    * @param inputs an Object. Its keys are populated from the `name` fields of
    *   this node's input and property specs. The value of each item is
    *   calculated either from its upstream node (if connected by an edge), or
    *   from the editor value of the corresponding input/property on this node
    *   (if not connected by an edge).
    *
    * @param services an Object that contains various internal services provided
    *   by Visual Blocks. For now, it only has one item `resourceService` which
    *   can be used to store and retrieve non-JSON data (such as canvas). See
    *   the "Examples" section below for more info.
    */
   runWithInputs(inputs, services);
   ```

   The Visual Blocks runtime runs the whole pipeline whenever there is a change
   in the node graph. This includes actions like connecting or disconnecting
   edges, adding or removing nodes, or updating inputs/properties through
   editors. It is your responsibility to make sure the implementation is
   optimzed, such as caching results, de-duping inputs data, etc.

1. Send outputs.

   To send output back to Visual Blocks, dispatch a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent)
   with the name `outputs`, and put the outputs data into its `detail` field.
   The output data should be an Object, and its keys should come from the `name`
   fields specified in node spec's `outputSpecs`.

   ```javascript
    this.dispatchEvent(
      new CustomEvent('outputs', {
        detail: {
          // `result` is the `name` field of its first (and only) output spec.
          result: 'my result',
        },
      })
    );
   ```

   **ℹ️ Note:** The node will stay in the "running" state and block the downstream
   nodes from running until this event is dispatched. Make sure the node will
   always dispatch the `outputs` event at certain point. To send empty outputs
   data (e.g. in the cases when the inputs data is not available), dispatch the
   custom event without the `detail` field.

   Visual Blocks allows custom nodes to output any data value, but it is
   recommended to output data that is JSON serializable. For complex data
   objects such as DOM elements, class instances, etc, consider using the
   `ResourceService` to store the objects and pass the corresponding unique ids.
   See the [Handle images](#handle-images) section below for more details.

1. (Optional) Render preview panel UI.

   The UI rendered by the custom element will be projected into the
   corresponding **preview panel** in the upper section of Visual Blocks. You
   have the flexibility to dynamically update the preview panel UI by utilizing
   the inputs data received in the `runWithInputs` method. It is worth noting
   that certain nodes, specifically those dedicated to data processing, may not
   hava a preview panel UI.

   <img src="./screenshots/preview_panel.png" width="919" />

The following is the implementation of the `Make uppercase` node shown in the
screenshot above using Lit.

```javascript
import { LitElement } from 'lit';

export class MakeUppercase extends LitElement {
  constructor() {
    super();
  }

  render() {
    // This node doesn't have preview UI.
  }

  runWithInputs(inputs) {
    // `text` and `option` should match the `name` of this node's
    // input specs and property specs.
    const {text, option} = inputs;

    // Process text.
    const result = option === 'first-letter' ?
        (text.charAt(0).toUpperCase() + text.slice(1)) :
        text.toUpperCase();

    // Output.
    //
    // `result` should match the `name` of this node's outputSpec.
    this.dispatchEvent(new CustomEvent('outputs', {detail: {result}}));
  }
}
```

### Register custom node with Visual Blocks

Call the following API to register your custom node:

```javascript
// Use the node spec and the implementation class to register.
visualblocks.registerCustomNode({
  nodeSpec: NODE_SPEC,
  nodeImpl: MakeUppercase
});
```

## Use custom node in Visual Blocks

Follow the steps below to try the custom node developed locally in Visual
Blocks website.

### Bundle the custom node

The custom node needs to be bundled into a single javascript file. Use your
favorite bundler to produce the bundled javascript file.

For example, for the `Make uppercase` example node:

```bash
$ cd examples/make_uppercase

# Only run this once to install deps.
$ npm i

# Bundle it. This will produce the bundled file in dist/make_uppercase.js
$ npm run build
```

**ℹ️ Note:** this step is not needed if your node is implemented in a single JS
file without importing any third-party libraries.

### Start a local server to serve the bundle

```bash
$ cd path/to/examples/make_uppercase/dist/
# This will start a local server listening at port 8080 (if available) by default.
$ npx http-server --cors
```

### Add the custom node to Visual Blocks

Visit [this url](https://staging-dot-rapsai-380921.appspot.com/#/edit/new) for a
full-screen Visual Blocks editor.

Click the black `+` button at the bottom left corner, enter the custom node
bundle url from the local server, and click `Submit`:

<img src="./screenshots/add_custom_node.png" width="956" />

The entry will turn to green if it is successfully added.

<img src="./screenshots/add_node_success.png" width="702" />

Close the dialog, and it shoud appear under the specified category:

<img src="./screenshots/find_node_in_category.png" width="327" />

**ℹ️ Note:** You only need to add a custom node once to a project. The editor
will store the project JSON in local storage, and will restore it when the page
reloads. All custom node urls will be saved in this project JSON, and will be
loaded when project is loaded.

## Publish a custom node

To allow other users to use your custom node, distribute the Javascript bundle
via npm or by hosting it on your server. Users can easily add your custom node
by entering the public URL within the `Add custom nodes` dialog, which becomes
accessible once the custom node system is launched.

**ℹ️ Note:** Custom node URLs added through the dialog are stored within the
project's JSON file (when exported). Visual Blocks will load these URLs when
project is opened. As a result, any non-public custom node URLs in the project
JSON file, such as the ones added in the local dev server, won't work on other
machines.

## Other topics

### Handle images

Many built-in nodes in Visual Blocks have the `image` input/output type. An
`image` in Visual Blocks points to a `canvas` using an unique id. See
`VisualBlocksImage` type in [`node_spec.d.ts`](./types/src/node_spec.d.ts).

```javascript
{
  canvasId: string;
}
```

When a node passes an image to another node, it passes this unique id instead of
the canvas itself. The canvas object is stored in an internal `ResourceService`
indexed by those ids.

To retrieve the actual canvas object, use the `services.resourceService.get`
when implementing the `runWithInputs` method mentioned above. You can also use
the `ResourceService` to store canvas and other non-json objects.

See [examples/image_grid](./examples/image_grid/) for an example custom node
that uses the `ResourceService` to retrieve and store images (canvases).

### Manually trigger a pipeline rerun

As mentioned above, the Visual Blocks runtime runs the whole pipeline
automatically whenever there is a change in the node graph. Sometimes, you might
want to trigger a pipeline rerun manually from outside of the node graph, e.g.
when users click a button in your node's preview panel UI.

In these cases, dispatch a `pipelineRerunTrigger` custom event. You can also put
whatever properties you want to update in its `detail` field. See the
[`image_grid`](./examples/image_grid/) example for its usage.

### Show errors

You can surface errors from the node implementation to the node graph UI by
sending a error object through the `outputs` custom event:

```javascript
this.dispatchEvent(new CustomEvent('outputs', {
  detail: {
    error: {
      title: 'Error',
      message: 'Something was wrong...',
    }
  }
}));
```

The corresponding node will show a red exclamation mark. When hovered, the error
title and message will be shown in a popup panel.

<img src="./screenshots/error.png" width="220" />

### Shapes of input/output data

The shape of each input/output item is entirely determined by you, as long
as the inputs/outputs with the same `type` string have the same shape.
Visual Blocks won't enforce this at runtime.

For example, a node spec defines an output named `person` with the `type` set
to `MyPersonType`.

```javascript
"outputSpecs": [{
  "name": "Person",
  "type": "MyPersonType"
}]
```

When you send output, you could write:

```javascript
this.dispatchEvent(
  new CustomEvent('outputs', {
    detail: {
      // The field key `person` should match the `name` field in the output spec
      // above.
      //
      // The field value has the shape {firstName, lastName} that corresponds to
      // the `MyPersonType` type.
      person: {firstName: 'John', lastName: 'Doe'},
    },
  })
);
```

In another node, you could define an input `volunteer` with the same
`MyPersonType` type:

```javascript
"inputSpecs": [{
  "name": "volunteer",
  "type": "MyPersonType"
}]
```

Then, when implementing `runWithInputs`, you should expect that the input
`volunteer` has the shape `{firstName, lastName}`:

```javascript
runWithInputs(inputs) {
  const {firstName, lastName} = inputs.volunteer;
  // ...
}
```

There are a set of built-in types defined in [`builtin_types.d.ts`](./types/src/builtin_types.d.ts)
along with their shapes.

## Examples

Check out the [examples](./examples/) directory for a set of example custom
nodes.

- [`make_uppercase`](./examples/make_uppercase/): a very simple custom node that
  takes an input string and transforms its first letter or the whole string to
  upper case. It doesn't have any preview UI.

- [`make_uppercase_vanilla`](./examples/make_uppercase_vanilla/): same as the
  `make_uppercase` example above expcet that it is implemented using vanilla
  Javascript without using Lit.

- [`image_grid`](./examples/image_grid/): a custom node that takes an input
  image and renders it into a grid. The grid size can be set using number
  editors in the node, or from the dropdowns in the preview panel UI. It shows
  how to render and update preview panel UI, how images are handled in Visual
  Blocks, and how to manually trigger pipeline re-run from the preview panel UI.

- [`wikipedia_fetcher`](./examples/wikipedia_fetcher/): a custom node that
  fetches the wikipedia summary for the input title. It shows how to use
  remote API call in a custom node, how to do simple inputs de-dup and result
  caching, and how to surface errors. It also shows how to develop custom nodes
  using Typescript and our custom node types package.

## Tips and tricks

- Add multiple custom nodes in one bundle.

  If you've created several custom nodes and wish to simplify the user
  experience by allowing them to add all these nodes using just one URL,
  consider consolidating all these custom nodes into a single bundle before
  publishing. This approach streamlines the process, as opposed to publishing
  each custom node separately.

- Debug using the `Logger` node.

  You can connect the `Logger` node (under the `Advanced` category) to any
  node's output socket to inpect its value. It will show the value in its
  preview panel UI as well as in developer console.

  <img src="./screenshots/logger.png" width="581" />

- Clear project.

  The project edited in the Visual Blocks local dev server is stored in local
  storage, and it will be automatically restored when you refresh the page.
  However, there can be issues if the project has significant problems or bugs
  that prevent you from making edits. To resolve this, you can clear the project
  from local storage: navigate to the "Application" tab in the developer
  console, righ click the local storage host, and click "Clear".

  <img src="./screenshots/clear_local_storage.png" width="845" />

- Multiple projects

  You can have multiple projects by specifying different url path names after
  `/#/edit/`. The name should start with `new`. For example:
  `/#/edit/new_project1`, `/#/edit/new_project1_final`, etc. These names will
  be used as keys in local storage to store project JSON data.

If you use Visual Blocks in your research, please reference it as:

[Visual Blocks]: https://visualblocks.withgoogle.com

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

@inproceedings{Du2023Experiencing,
  title = {{Experiencing Visual Blocks for ML: Visual Prototyping of AI Pipelines}},
  author = {Du, Ruofei and Li, Na and Jin, Jing and Carney, Michelle and Yuan, Xiuxiu and Wright, Kristen and Sherwood, Mark and Mayes, Jason and Chen, Lin and Jiang, Jun and Zhou, Jingtao and Zhou, Zhongyi and Yu, Ping and Kowdle, Adarsh and Iyengar, Ram and Olwal, Alex},
  booktitle = {Adjunct Proceedings of the 33rd Annual ACM Symposium on User Interface Software and Technology},
  year = {2023},
  publisher = {ACM},
  series = {UIST},
}
```
