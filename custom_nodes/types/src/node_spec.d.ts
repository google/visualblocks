/**
 * The spec (blueprint) of a node.
 */
export declare interface NodeSpec {
  /** A unique id (among all the node specs in a library) */
  id: string;

  /**
   * The human-readable name of the node. This will be used as the node title
   * in the editor.
   */
  name: string;

  /**
   * The description of the node. It will be shown in a popup when hovering
   * over the "i" icon in a node's title bar.
   *
   * It can have simple html tags (<br>, <b>, etc).
   */
  description?: string;

  /** Custom data for this node. */
  // tslint:disable-next-line:no-any Allow custom types.
  customData?: any;

  /** The name of the category this node beloncs to. */
  category: string;

  /**
   * The name of the collection this node belongs to.
   *
   * Collections are one level higher than categories. A node library will first
   * group node specs by collections. Within each collection, its node specs
   * will then be grouped by categories.
   *
   * Node specs without this collection field set will be grouped into the
   * 'Default' collection.
   */
  collection?: string;

  /** The minimum node width (176px by default). */
  minWidth?: number;

  /** The outputs of the node. */
  outputSpecs?: OutputSpec[];

  /**
   * The properties of the node.
   *
   * Each property should have an associated editor that users can edit in order
   * to change certain data for the property, which might affect how node works.
   * For example, a vector math node might have an "operator" property where
   * users can select "add", "substract", etc, to tell the node which operator
   * to use.
   */
  propertySpecs?: InputSpec[];

  /**
   * The inputs of the node.
   *
   * Inputs and properties are very similar (so they use the same spec interface
   * `InputSpec`), with the only major difference being an input has a socket
   * that can be connected to edge(s). When an input's socket is connected, its
   * data will come from the other end of the edge instead of from its own
   * editor. An input can also have no editors, meaning that its data can only
   * come from the connected edge.
   */
  inputSpecs?: InputSpec[];

  /**
   * A custom function that takes the input values and generates a list input
   * and output specs.
   *
   * These generated specs will be rendered on the node in additional to the
   * static input and output specs specified above.
   */
  dynamicIoGeneratorFn?:
      (inputValues: Record<string, JsonValue>) => DynamicIoSpecs;
}

/** NodeSpec with typed custom data. */
export declare interface NodeSpecWithCustomData<T> extends NodeSpec {
  /** Custom user data. */
  customData?: T;
}

/**
 * The spec of an output.
 */
export declare interface OutputSpec {
  /** The name of the output. Should be unique among all the outputs. */
  name: string;

  /**
   * The optional display label for the input. Will use `name` above as the
   * label if this field is not set.
   */
  displayLabel?: string;

  /**
   * The data type of the output.
   *
   * For simple use cases, this should just be a string, e.g. 'number', 'image',
   * etc. The editor UI will enforce that an edge can only connect to an input
   * to an output if they have the same type (string match).
   *
   * TODO(jingjin): Complex types (e.g. inheritance, union, etc) will be
   * supported in the future.
   */
  type: IOTypeSpec|string;

  /**
   * One special and commonly used data type is a Json object (e.g. {r, g, b}
   * or {x, y, z}). `fieldSpecs` here can be used to specify the fields this
   * Json object has, and they will be displayed in the node UI as separated
   * output rows so users can easily connect edges to individual fields.
   */
  fieldSpecs?: OutputSpec[];

  /**
   * A list of nodes that are recommended to be connected to this output.
   *
   * When set, a floating button will appear next to the output socket, and will
   * show the list of candidates when hovered over. Clicking a candidate will
   * automatically add the node to the graph and connect it to the output.
   */
  recommendedNodes?: RecommendedNode[];
}

/**
 * The spec of an input.
 */
export declare interface InputSpec {
  /** The name of the input. Should be unique among all the inputs. */
  name: string;

  /**
   * The optional display label for the input. Will use `name` above as the
   * label if this field is not set.
   */
  displayLabel?: string;

  /**
   * The data type of the input. See comments in `OutputSpec` above for more
   * details.
   */
  type: IOTypeSpec|string;

  /**
   * Whether to allow multiple incoming edges connecting to this input.
   *
   * If this field is set to true, this input is expected to receive an array of
   * values with the same type (defined above).
   */
  multiple?: boolean;

  /**
   * Don't show it in the node.
   */
  noDisplay?: boolean;

  /**
   * Don't save this field's value in the pipeline json.
   */
  noSave?: boolean;

  /**
   * Don't save this field's value in the pipeline json only if the given
   * property is set to true.
   */
  noSaveWhenPropertyIsTrue?: string;

  /** Min width of the label. */
  minLabelWidth?: number;

  /**
   * Info text for this input.
   *
   * When this is set, an "i" icon will be displayed next to the input label,
   * and the info content will be shown in a tooltip when hovering over the
   * label.
   */
  info?: string;

  /**
   * The default value of the input.
   *
   * If this field is unset:
   * - Default to [] if multiple == true.
   * - Default to 0 if type == 'number'.
   * - Default to empty string if type == 'string'.
   * - Default to false if type == 'boolean'|'bool'.
   * - Default to {} if this input is a Json object (fieldSpecs is non-empty).
   */
  defaultValue?: JsonValue;

  /** The spec of the associated editor. */
  editorSpec?: EditorSpec;

  /**
   * The condition to meet to hide this input.
   *
   * See comments in `HideCondition` below for more details.
   *
   * TODO(jingjin): support this for outputs.
   */
  hideCondition?: HideCondition;

  /** See comments in `OutputSpec` above for more details. */
  fieldSpecs?: InputSpec[];
}

/**
 * TODO(jingjin): A placeholder for complex IO types, e.g. inheritance, union,
 * etc.
 */
export declare interface IOTypeSpec {
  type: string;
}

/**
 * UI related specs for io types.
 */
export declare interface IOTypeUiSpec {
  /** Which IO type this spec is for. */
  ioType: string;

  /**
   * The tag name of the custom element that will replace the corresponding IO
   * type socket UI.
   */
  socketElementTag: string;

  /** The optional custom data passed to the custom element above. */
  socketElementData?: JsonValue;

  /**
   * Which side to apply the custom socket element to. If unset, the custom
   * element will be applied to BOTH input and output socket.
   */
  side?: 'input'|'output';
}

/**
 * The condition to meet to hide input/output.
 *
 * This make the situations possible where different property values might
 * change different sets of inputs/outputs. For example, for a color picker
 * node, a property might be "mode" where users can select "rgb", "hlv", etc. By
 * using `HideCondition`, the inputs could be set up in a way where the "rgb"
 * input is hidden when the "hlv" mode is selected (and vice versa).
 */
export declare interface HideCondition {
  /**
   * The property values to match (indexed by property names). For each
   * property, it is a match if any value in the given array matches.
   */
  propertyValues: {[name: string]: JsonValue[]};
}

/**
 * A recommended node that connects to a node's output. See
 * `OutputSpec.recommendedNodes` for more info.
 */
export declare interface RecommendedNode {
  /** The id of the node spec for the candidate node. */
  nodeSpecId: string;

  /**
   * The id of the input to connect to the triggering output.
   *
   * If not specified, the first matching input will be picked to be the one to
   * connect.
   */
  inputId?: string;

  /**
   * Other input ids to be connected.
   *
   * If specified, the editor will try to find the first matching output from
   * the source node as well as its upstream nodes.
   */
  extraInputIdsToConnect?: string[];
}

/** The object returned by the `dynamicIoGeneratorFn`. */
export declare interface DynamicIoSpecs {
  inputSpecs?: InputSpec[];
  outputSpecs?: OutputSpec[];
}

/**
 * Editor spec types.
 *
 * TODO(jingjin): add more built-in editors, e.g. color picker, boolean
 * switches, etc.
 */
export declare type EditorSpec = NumberEditorSpec | DropDownEditorSpec |
    SlideToggleEditorSpec | ColorPickerEditorSpec | TextInputEditorSpec |
    TextAreaEditorSpec | ImageResourceEditorSpec | CustomEditorSpec;

/** The base of editor spec shared by all editor specs. */
export declare interface EditorSpecBase {
  /** The editor type. */
  type: EditorType;

  /** The height of the editor, default to DEFAULT_IO_HEIGHT. */
  height?: number;
}

/** Editor types. */
export enum EditorType {
  NUMBER = 'number',
  DROPDOWN = 'dropdown',
  SLIDE_TOGGLE = 'slide_toggle',
  COLOR_PICKER = 'color_picker',
  TEXT_INPUT = 'text_input',
  TEXT_AREA = 'text_area',
  IMAGE_RESOURCE = 'image_resource',
  CUSTOM = 'custom',
}

/** Spec for number editor. */
export declare interface NumberEditorSpec extends EditorSpecBase {
  type: EditorType.NUMBER;

  min?: number;
  max?: number;

  /**
   * Step per 1% change when dragging (relative to the width of the editor).
   *
   * Default to 0.1.
   */
  step?: number;

  /** Whether the editor should show and output integers. */
  integers?: boolean;

  /**
   * When scrubbing, only fire value update event when releasing the mouse if
   * this is set to true. Otherwise it will continuously fire events as users
   * are scrubbing.
   */
  fireEventOnMouseUp?: boolean;
}

/**
 * Spec for drop-down editor.
 */
export declare interface DropDownEditorSpec extends EditorSpecBase {
  type: EditorType.DROPDOWN;
  options: DropDownOption[];
}

/** An option in the drop-down editor. */
export declare interface DropDownOption {
  value: string;
  label: string;
}

/** Spec for slide toggle editor. */
export declare interface SlideToggleEditorSpec extends EditorSpecBase {
  type: EditorType.SLIDE_TOGGLE;
}

/** Spec for color picker. */
export declare interface ColorPickerEditorSpec extends EditorSpecBase {
  type: EditorType.COLOR_PICKER;
}

/** Spec for text input editor. */
export declare interface TextInputEditorSpec extends EditorSpecBase {
  type: EditorType.TEXT_INPUT;
  outputNumber?: boolean;
  password?: boolean;
}

/** Spec for text area editor. */
export declare interface TextAreaEditorSpec extends EditorSpecBase {
  type: EditorType.TEXT_AREA;
}

/** Spec for image resource editor. */
export declare interface ImageResourceEditorSpec extends EditorSpecBase {
  type: EditorType.IMAGE_RESOURCE;
}

/** Spec for custom editor. */
export declare interface CustomEditorSpec extends EditorSpecBase {
  type: EditorType.CUSTOM;

  /** The tag of the custom element for this editor. */
  tag: string;

  /** The optional custom data passed to the custom element above. */
  customData?: JsonValue;
}

/** The types of serializable values supported by editors. */
export declare type JsonValue =
    string | number | boolean | Json | object | JsonValueArray;

/** A Json object. */
export declare interface Json {
  [name: string]: JsonValue;
}

/** An array of JsonValues. */
export declare type JsonValueArray = JsonValue[];
