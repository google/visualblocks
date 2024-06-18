import {NodeSpec} from './node_spec';

declare global {
  var visualblocks: VisualBlocksApi;
}

/** Visual Blocks API exposed to "visualblocks" global namespace. */
export interface VisualBlocksApi {
  registerCustomNode(info: CustomNodeInfo): void;
}

/** Info for a custom node. */
export declare interface CustomNodeInfo {
  nodeSpec: NodeSpec;
  // This should be a class that extends HTMLElement.
  nodeImpl: CustomElementConstructor;
}

/**
 * Visual Blocks node runner interface.
 *
 * The custom element class that implements the node logic should implement this
 * interface.
 */
export declare interface VisualBlocksNodeRunner {
  runWithInputs(inputs: {}, services: Services): void;
}

/** Services passed with inputs data. */
export declare interface Services {
  resourceService: ResourceService;
}

/** A service that manages resources. */
export declare interface ResourceService {
  put: (resource: any, id?: string|symbol) => string;

  get<T>(id: string|symbol): T;

  delete(id: string): any;

  getResourceId(): string;

  count(): number;
}
