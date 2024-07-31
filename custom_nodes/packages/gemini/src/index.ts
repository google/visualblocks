import {CustomNodeLibrary} from '@visualblocks/custom-node-types';
import {GeminiModelInfo} from './gemini_model';

export default {
  registerCustomNodes: (register) => {
    register([GeminiModelInfo]);
  }
} satisfies CustomNodeLibrary;
