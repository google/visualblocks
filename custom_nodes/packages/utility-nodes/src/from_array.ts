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
  EditorType,
  InputType,
  NodeSpec,
  OutputSpec,
  OutputType,
} from '@visualblocks/custom-node-types';
import {PureFunctionNode} from '@visualblocks/node-utils';

const INPUT_SPECS = [
  {
    name: 'array',
    type: DataType.ANY,
  },
] as const;

const PROPERTY_SPECS = [
  {
    name: 'outputCount',
    displayLabel: 'Output Count',
    type: DataType.NUMBER,
    defaultValue: 1,
    editorSpec: {
      type: EditorType.NUMBER,
      integers: true,
      min: 1,
      max: 16,
      step: 1,
    },
  },
] as const;

const NODE_SPEC = {
  id: 'from-array',
  name: 'From Array',
  description: 'Convert an array into multiple outputs',
  category: Category.PROCESSOR,
  inputSpecs: INPUT_SPECS,
  propertySpecs: PROPERTY_SPECS,
  outputSpecs: [
    {
      name: 'output0',
      displayLabel: 'Output 0',
      type: DataType.ANY,
    },
  ] as const,
  dynamicIoGeneratorFn: ({outputCount}) => {
    if (!(typeof outputCount === 'number')) {
      outputCount = 1;
    }

    const outputSpecs: OutputSpec[] = [];
    for (let i = 0; i < outputCount; i++) {
      outputSpecs.push({
        name: `output${i}`,
        displayLabel: `Output ${i}`,
        type: DataType.ANY,
      });
    }

    return {
      inputSpecs: INPUT_SPECS,
      propertySpecs: PROPERTY_SPECS,
      outputSpecs,
    };
  },
} satisfies NodeSpec;

type Inputs = InputType<typeof NODE_SPEC>;
type Outputs = OutputType<typeof NODE_SPEC>;

export class FromArray extends PureFunctionNode<Inputs, Outputs> {
  override async run({array, outputCount}: Inputs): Promise<Outputs> {
    if (!(array instanceof Array)) {
      throw new Error(`Expected type 'Array' but got '${typeof array}'`);
    }

    const outputs: Record<string, unknown> = {};

    for (let i = 0; i < (outputCount ?? 1); i++) {
      outputs[`output${i}`] = array[i];
    }

    return outputs;
  }
}

export const FromArrayInfo = {
  nodeSpec: NODE_SPEC,
  nodeImpl: FromArray,
} satisfies CustomNodeInfo;
