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
  OutputType,
  Services,
} from '@visualblocks/custom-node-types';
import {PureFunctionNode} from '@visualblocks/node-utils';
import {
  GenerativeModel,
  GoogleGenerativeAI,
  InlineDataPart,
  Part,
} from '@google/generative-ai';

const NODE_SPEC = {
  id: 'gemini-model',
  name: 'Gemini Language Model',
  description: "Send queries and fetch responses from Google's Gemini models.",
  category: Category.MODEL,
  inputSpecs: [
    {
      name: 'prompt',
      displayLabel: 'Prompt',
      type: DataType.ANY, // TODO: Better types. Union(DataType.STRING, DataType.IMAGE).
      multiple: true,
      editorSpec: {
        type: EditorType.TEXT_AREA,
        autoResize: true,
      },
    },
    {
      name: 'modelId',
      displayLabel: 'Model ID',
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: ['gemini-1.5-flash'].map(l => ({label: l, value: l})),
      },
    },
    {
      name: 'apiKey',
      displayLabel: 'API Key',
      type: DataType.STRING,
      noSave: true,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
        password: true,
      },
    },
  ] as const,
  outputSpecs: [
    {
      name: 'response',
      type: DataType.STRING,
    },
  ] as const,
} satisfies NodeSpec;

type Inputs = InputType<typeof NODE_SPEC>;
type Outputs = OutputType<typeof NODE_SPEC>;

export class GeminiModel extends PureFunctionNode<Inputs, Outputs> {
  private genAI?: GoogleGenerativeAI;
  private model?: GenerativeModel;

  constructor() {
    super();
  }

  override async run(inputs: Inputs, services: Services): Promise<Outputs> {
    if (!inputs.apiKey) {
      throw new Error('Please set your API key');
    }

    // Rebuild if api key is different.
    if (inputs.apiKey !== this.lastInputs?.apiKey || !this.genAI) {
      this.genAI = new GoogleGenerativeAI(inputs.apiKey);
    }

    // Get the selected model.
    if (!inputs.modelId) {
      throw new Error('Please select a model');
    }
    if (inputs.modelId !== this.lastInputs?.modelId || !this.model) {
      this.model = this.genAI.getGenerativeModel({model: inputs.modelId});
    }

    if (!inputs.prompt) {
      return {}; // Nothing to generate yet
    }

    const parts = (inputs.prompt as unknown[]).map((prompt, i): Part => {
      if (typeof prompt === 'string') {
        return {
          text: prompt,
        };
      }

      if (typeof prompt !== 'object') {
        throw new Error(`Prompt input at index ${i} is not a valid type`);
      }

      if (prompt === null) {
        throw new Error(`Prompt input at index ${i} is null`);
      }

      if ('canvasId' in prompt && typeof prompt.canvasId === 'string') {
        // TODO: This can use the image to base64 node when subgraphs work.
        const canvas = services.resourceService.get<HTMLCanvasElement>(
          prompt.canvasId
        );
        const data = canvas.toDataURL().split(';base64,')[1];
        if (data === undefined) {
          throw new Error(
            `Failed to get data for input ${i} from canvas ${prompt.canvasId}`
          );
        }

        return {
          inlineData: {
            mimeType: 'image/png',
            data,
          },
        } satisfies InlineDataPart;
      }

      throw new Error(`Prompt input at index ${i} is not a valid type`);
    });

    const {response} = await this.model.generateContent(parts);

    return {
      response: response.text(),
    };
  }
}

export const GeminiModelInfo: CustomNodeInfo = {
  nodeSpec: NODE_SPEC,
  nodeImpl: GeminiModel,
};
