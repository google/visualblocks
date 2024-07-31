import {LitElement} from 'lit';
import {VisualBlocksNodeRunner, Services} from '@visualblocks/custom-node-types';
import deepEqual from 'fast-deep-equal';

/**
 * A VisualBlocks node that reruns whenever any input changes. The node itself
 * uses a promise instead of a callback to return its result.
 */
export abstract class PureFunctionNode<Inputs extends Record<string, unknown>,
Outputs extends Record<string, unknown>> extends LitElement implements VisualBlocksNodeRunner {

  protected lastInputs: Inputs | undefined;
  private cachedOutputs: Outputs | undefined;

  runWithInputs(inputs: Inputs, services: Services) {
    this.runWithInputsAsync(inputs, services).then(result => {
      this.dispatchEvent(new CustomEvent('outputs', {detail: result}));
    }).catch(error => {
      this.dispatchEvent(new CustomEvent('outputs', {
        detail: {
          error: {
            title: error.message,
            message: error,
          }
        }
      }));
    });
  }

  private async runWithInputsAsync(inputs: Inputs, services: Services): Promise<Outputs> {
    if (!this.lastInputs || !this.cachedOutputs) {
      return this.forcedRun(inputs, services);
    }

    if (inputs === this.lastInputs) {
      return this.cachedOutputs;
    }

    for (const key of Object.keys(this.lastInputs)) {
      if (!(key in inputs)) {
        return this.forcedRun(inputs, services);
      }
    }

    for (const [key, val] of Object.entries(inputs)) {
      if (!(key in this.lastInputs)) {
        return this.forcedRun(inputs, services);
      }

      const lastVal = this.lastInputs[key];
      if (!this.sameValues(val, lastVal)) {
        return this.forcedRun(inputs, services);
      }
    }
    return this.cachedOutputs;
  }

  async forcedRun(inputs: Inputs, services: Services): Promise<Outputs> {
    this.lastInputs = inputs;
    this.cachedOutputs = await this.run(inputs, services);
    return this.cachedOutputs;
  }

  sameValues(a: unknown, b: unknown) {
    return deepEqual(a, b); // TODO: Maybe types should provide an equality fn?
  }

  abstract run(inputs: Inputs, services: Services): Promise<Outputs>

}
