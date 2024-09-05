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

import {
  Category,
  CustomNodeInfo,
  DataType,
  InputType,
  NodeSpec,
  OutputType,
} from '@visualblocks/custom-node-types';
import {PureFunctionNode} from '@visualblocks/node-utils';

const NODE_SPEC = {
  id: 'to-array',
  name: 'To Array',
  description: 'Convert multiple inputs into an array.',
  category: Category.PROCESSOR,
  inputSpecs: [
    {
      name: 'inputs',
      type: DataType.ANY,
      multiple: true,
    },
  ] as const,
  outputSpecs: [
    {
      name: 'array',
      type: DataType.ANY,
    },
  ] as const,
} satisfies NodeSpec;

type Inputs = InputType<typeof NODE_SPEC>;
type Outputs = OutputType<typeof NODE_SPEC>;

export class ToArray extends PureFunctionNode<Inputs, Outputs> {
  override async run({inputs}: Inputs): Promise<Outputs> {
    return {
      array: inputs ?? [],
    };
  }
}

export const ToArrayInfo = {
  nodeSpec: NODE_SPEC,
  nodeImpl: ToArray,
} satisfies CustomNodeInfo;
