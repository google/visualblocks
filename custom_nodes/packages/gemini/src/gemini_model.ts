import { Category, CustomNodeInfo, DataType, EditorType, InputType, NodeSpec, OutputType } from '@visualblocks/custom-node-types';
import { PureFunctionNode } from './pure_function_node';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';


const NODE_SPEC = {
  id: 'gemini-model',
  name: 'Gemini Language Model',
  description: 'Send queries and fetch responses from Google\'s Gemini models.',
  category: Category.MODEL,
  inputSpecs: [
    {
      name: 'prompt',
      displayLabel: 'Prompt',
      type: DataType.STRING, // TODO: Accept a custom Prompt type incl. image
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
        options: [
          'gemini-1.5-flash',
        ].map(l => ({ label: l, value: l })),
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
    }
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

  override async run(inputs: Inputs): Promise<Outputs> {
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
    };
        
    const {response} = await this.model.generateContent(inputs.prompt);

    return {
      response: response.text(),
    };
  }
}

export const GeminiModelInfo: CustomNodeInfo = {
  nodeSpec: NODE_SPEC,
  nodeImpl: GeminiModel,
};
