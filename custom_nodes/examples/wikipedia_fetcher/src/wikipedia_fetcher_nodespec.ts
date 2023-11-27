import {Category, DataType, NodeSpec} from '@visualblocks/custom-node-types';

export const NODE_SPEC: NodeSpec = {
  id: 'wikipedia-fetcher',
  name: 'Wikipedia fetcher',
  description: 'Fetch the wikipedia summary for the given title.',
  category: Category.SEARCH,

  // Inputs.
  inputSpecs: [{
    name: 'title',
    type: DataType.STRING,
  }],

  // Outputs.
  outputSpecs: [{
    'name': 'summary',
    'type': DataType.STRING,
  }],
};
