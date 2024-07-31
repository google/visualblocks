/**
 * @license
 * Copyright 2024 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {LitElement} from 'lit';
import {
  VisualBlocksNodeRunner,
  Services,
} from '@visualblocks/custom-node-types';
import deepEqual from 'fast-deep-equal';

/**
 * A VisualBlocks node that reruns whenever any input changes. The node itself
 * uses a promise instead of a callback to return its result.
 */
export abstract class PureFunctionNode<
    Inputs extends Record<string, unknown>,
    Outputs extends Record<string, unknown>,
  >
  extends LitElement
  implements VisualBlocksNodeRunner
{
  protected lastInputs: Inputs | undefined;
  private cachedOutputs: Outputs | undefined;

  runWithInputs(inputs: Inputs, services: Services) {
    this.runWithInputsAsync(inputs, services)
      .then(result => {
        this.dispatchEvent(new CustomEvent('outputs', {detail: result}));
      })
      .catch(error => {
        this.dispatchEvent(
          new CustomEvent('outputs', {
            detail: {
              error: {
                title: error.message,
                message: error,
              },
            },
          })
        );
      });
  }

  private async runWithInputsAsync(
    inputs: Inputs,
    services: Services
  ): Promise<Outputs> {
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

  abstract run(inputs: Inputs, services: Services): Promise<Outputs>;
}
