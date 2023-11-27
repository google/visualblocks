import {NODE_SPEC} from './make_uppercase_vanilla_nodespec';


////////////////////////////////////////////////////////////////////////////////
// Implement node.

/**
 * Transform the input text to upper case. A minimal example for Visual Blocks
 * custom nodes.
 */
export class MakeUppercaseVanilla extends HTMLElement {
  constructor() {
    super();
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


////////////////////////////////////////////////////////////////////////////////
// Register custom node with visual blocks.

visualblocks.registerCustomNode(
    {nodeSpec: NODE_SPEC, nodeImpl: MakeUppercaseVanilla});
