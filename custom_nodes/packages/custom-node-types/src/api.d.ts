import {NodeSpec} from './node_spec';

declare global {
  var visualblocks: VisualBlocksApi;
}

/** Visual Blocks API exposed to "visualblocks" global namespace. */
export interface VisualBlocksApi {
  /**
   * Register a custom node.
   *
   * If you are registering multiple nodes, set 'isLastNode' to false for all
   * but the last one. This will tell VisualBlocks when you are done registering
   * nodes. Alternatively, register them all at once with `registerCustomNodes`
   */
  registerCustomNode(info: CustomNodeInfo, isLastNode?: boolean): void;
  /**
   * Register a list of custom nodes.
   *
   * This is preferred over callling `registerCustomNode` individually for each
   * node since it's easier to control when VisualBlocks is notified that all
   * the nodes have been registered.
   */
  registerCustomNodes(info: CustomNodeInfo[]): void;
}

/**
 * ESModules API for implementing custom node libraries
 *
 * As an alternative to calling VisualBlocks's `registerCustomNode` function,
 * you can declare your custom node library as an ESModule. You will need to
 * ensure that when it is bundled (if you choose to bundle it), it bundles
 * with the ESModule format. Your final output should have an `export` statement
 * at the top level.
 *
 * Your module should implement the CustomNodeLibrary interface as its default
 * export. A conventient pattern to do this is using TypeScript's `satisfies`
 * operator:
 *
 * ```
 * export default {
 *   registerCustomNodes: (...) => {...},
 *   ...
 * } satisfies CustomNodeLibrary;
 *
 * Alternatively, Visual Blocks also supports a format where you export each of
 * the properties of the `CustomNodeLibrary` interface:
 *
 * ```
 * export const registerCustomNodes: CustomNodeLibrary['registerCustomNodes'] = (...) => {...};
 * ...
 * ```
 */
export interface CustomNodeLibrary {
  registerCustomNodes(
    register: VisualBlocksApi['registerCustomNodes']
  ): void | Promise<void>;
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
  put: (resource: any, id?: string | symbol) => string;

  get<T>(id: string | symbol): T;

  delete(id: string): any;

  getResourceId(): string;

  count(): number;
}
