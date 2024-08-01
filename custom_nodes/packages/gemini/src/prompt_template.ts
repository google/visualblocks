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
  CustomNodeInfo,
  Category,
  DataType,
  DynamicIoSpecs,
  EditorType,
  InputSpec,
  InputType,
  JsonValue,
  NodeSpec,
  OutputType,
} from '@visualblocks/custom-node-types';
import {PureFunctionNode} from '@visualblocks/node-utils';
import {GeminiModelInfo} from './gemini_model';

export const NODE_SPEC = {
  id: 'prompt-template',
  name: 'Prompt Template',
  description:
    'Fill out a prompt template with a given set of inputs. Use {{ variableName }} to define variables to replace in the prompt.',
  category: Category.PROCESSOR,
  inputSpecs: [
    {
      name: 'template',
      displayLabel: 'Template',
      type: DataType.STRING,
      defaultValue:
        'Use {{ variableName }} to define variables to replace in the prompt.',
      editorSpec: {
        type: EditorType.TEXT_AREA,
        autoResize: true,
      },
    },
    {
      name: 'values',
      type: DataType.UNKNOWN,
      fieldSpecs: [],
    },
  ] as const,
  outputSpecs: [
    {
      name: 'prompt',
      type: DataType.STRING,
      recommendedNodes: [
        {
          nodeSpecId: GeminiModelInfo.nodeSpec.id,
          inputId: GeminiModelInfo.nodeSpec.inputSpecs[0].name,
        },
      ],
    },
  ] as const,
  dynamicIoGeneratorFn: (
    inputValues: Record<string, JsonValue>
  ): DynamicIoSpecs => {
    const template = inputValues['template'];
    if (!template || typeof template !== 'string') {
      return NODE_SPEC;
    }

    const variableNames = new Set<string>();
    const variables = getTemplateParts(template)
      .filter((p: TemplatePart): p is VariablePart => p.type === 'variable')
      .filter(({name}) => {
        if (variableNames.has(name)) {
          return false;
        }
        variableNames.add(name);
        return true;
      })
      .map(({name}) => name);

    const fieldSpecs: InputSpec[] = variables.map(name => ({
      name,
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    }));

    return {
      inputSpecs: [
        NODE_SPEC.inputSpecs[0],
        {
          ...NODE_SPEC.inputSpecs[1],
          fieldSpecs,
        },
      ],
      outputSpecs: NODE_SPEC.outputSpecs,
    };
  },
} satisfies NodeSpec;

type Inputs = InputType<typeof NODE_SPEC>;
type Outputs = OutputType<typeof NODE_SPEC>;

interface StringPart {
  type: 'string';
  value: string;
}

interface VariablePart {
  type: 'variable';
  name: string;
}

type TemplatePart = StringPart | VariablePart;

function getTemplateParts(prompt: string): TemplatePart[] {
  if (prompt.length === 0) {
    return [
      {
        type: 'string',
        value: '',
      },
    ];
  }

  const parts: TemplatePart[] = [];
  let inVariableUse = false;
  let pos = 0;

  while (true) {
    if (inVariableUse) {
      const variableEnd = prompt.match(' *}}');
      if (!variableEnd) {
        throw new Error(`Variable at ${pos} has no matching '}}'`);
      }
      const variableName = prompt.slice(0, variableEnd.index!);

      parts.push({
        type: 'variable',
        name: variableName,
      });

      const advance = variableEnd.index! + variableEnd[0].length;
      prompt = prompt.slice(advance);
      pos += advance;
      inVariableUse = false;
    } else {
      const nextVariableStart = prompt.match('{{ *');
      if (nextVariableStart) {
        inVariableUse = true;
        const textBeforeVariable = prompt.slice(0, nextVariableStart.index);
        parts.push({
          type: 'string',
          value: textBeforeVariable,
        });

        // Cut the variable start token out.
        const advance = nextVariableStart.index! + nextVariableStart[0].length;
        prompt = prompt.slice(advance);
        pos += advance;
      } else {
        // No more variable declarations
        parts.push({
          type: 'string',
          value: prompt,
        });
        return parts;
      }
    }
  }
}

export class PromptTemplate extends PureFunctionNode<Inputs, Outputs> {
  async run({template, values}: Inputs): Promise<Outputs> {
    if (template == null) {
      throw new Error('Template input is null or undefined');
    }
    if (typeof values !== 'object') {
      throw new Error(
        `Expected 'values' to be an object but got '${typeof values}'`
      );
    }
    if (values === null) {
      throw new Error('Values input is null');
    }

    const parts = getTemplateParts(template);

    const prompt = parts
      .map(part => {
        if (part.type === 'string') {
          return part.value;
        }

        const valuesRecord = values as Record<string, string>;
        if (!(part.name in valuesRecord)) {
          throw new Error(`Missing value for variable '${part.name}'`);
        }

        return String(valuesRecord[part.name]);
      })
      .join('');

    return {prompt};
  }
}

export const PromptTemplateNodeInfo = {
  nodeSpec: NODE_SPEC,
  nodeImpl: PromptTemplate,
} satisfies CustomNodeInfo;
