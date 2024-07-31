import {IOTypeSpec, NodeSpec} from './node_spec';

/** All built-in data types. */
export enum DataType {
  IMAGE = 'image',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  STRING = 'string',
  COLOR = 'color',
  STRING_ARRAY = 'string[]',
  TENSOR = 'tensor',
  TENSOR_ARRAY = 'tensor[]',
  SIZE = 'size',
  RECT = 'rect',
  CLASSIFICATION_RESULT = 'classificationResult',
  LANDMARK_RESULT = 'landmarkResult',
  PROMPT_EXAMPLE = 'promptExample',
  OBJECT_DETECTION_RESULT = 'objectDetectionResult',
  MASKS = 'masks',
  PROTO = 'proto',
  TRIGGER = 'trigger',
  UNKNOWN = 'unknown',
  ANY = '*',
}

interface DataTypeMap {
  [DataType.IMAGE]: VisualBlocksImage;
  [DataType.NUMBER]: number;
  [DataType.BOOLEAN]: boolean;
  [DataType.STRING]: string;
  [DataType.COLOR]: string | number;
  [DataType.STRING_ARRAY]: string[];
  [DataType.TENSOR]: VisualBlocksTensor;
  [DataType.TENSOR_ARRAY]: VisualBlocksTensor[];
  [DataType.SIZE]: VisualBlocksSize;
  [DataType.RECT]: VisualBlocksRect;
  [DataType.CLASSIFICATION_RESULT]: VisualBlocksClassificationResult;
  [DataType.LANDMARK_RESULT]: VisualBlocksLandmarkResult;
  [DataType.PROMPT_EXAMPLE]: VisualBlocksPromptExample;
  [DataType.OBJECT_DETECTION_RESULT]: VisualBlocksObjectDetectionResult;
  [DataType.MASKS]: VisualBlocksSegmentationResult;
  [DataType.PROTO]: VisualBlocksProtoObject;
  [DataType.TRIGGER]: VisualBlocksTrigger;
  [DataType.UNKNOWN]: unknown;
  [DataType.ANY]: any;
}

/** An image type that used by various nodes. */
export interface VisualBlocksImage {
  canvasId: string;
}

/** A tensor type that used by various nodes. */
export interface VisualBlocksTensor {
  tensorId: string;
}

/** A rect with two end points. */
export interface VisualBlocksRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** A size with width and height. */
export interface VisualBlocksSize {
  width: number;
  height: number;
}

/** The classification result from a mobilenet model. */
export interface VisualBlocksClassificationResult {
  classes: Array<{
    className: string;
    probability: number;
  }>;
}

/** The landmark result from a landmark estimation model. */
export interface VisualBlocksLandmarkResult {
  source: VisualBlocksLandmarkSource;
  results: VisualBlocksLandmark[];
}

/** The bounding box and landmarks for a body part. */
export interface VisualBlocksLandmark {
  box?: {
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
  };
  keypoints?: Array<{x: number; y: number; z?: number}>;
}

/** The source of the landmark result. */
export enum VisualBlocksLandmarkSource {
  FACE_LANDMARK = 'face_landmark',
  FACE_DETECTION = 'face_detection',
  POSE_LANDMARK = 'pose_landmark',
  HAND_POSE_DETECTION = 'hand_pose_detection',
  GESTURE_RECOGNITION = 'gesture_recognition',
}

/** A prompt example type that used to instruct the language model. */
export interface VisualBlocksPromptExample {
  input: string;
  output: string;
}

/** The object detection result from a object detection model. */
export interface VisualBlocksObjectDetectionResult {
  results: VisualBlocksDetectedObject[];
}

/** The bounding box, label and score for a detected object. */
export interface VisualBlocksDetectedObject {
  box?: {
    /** Take the top left corner as the origin. */
    left: number; // same as xMin
    top: number; // same as yMin
    width: number;
    height: number;
  };
  label?: string;
  score?: number;
}

/** An image type that used by various nodes. */
export interface VisualBlocksSegmentationResult {
  results: VisualBlocksMask[];
}

/** An image type that used by various nodes. */
export interface VisualBlocksMask {
  maskId: string;
}

/** An interface for proto object, used as node input or output. */
export interface VisualBlocksProtoObject {
  /** The ResourceService id of the proto object. */
  protoId: string;
}

/** A trigger object. */
export interface VisualBlocksTrigger {
  ts: number;
}

/**
 * Interface for input and output specs supported by the InputType and
 * OutputType type helpers.
 */
interface SpecLike {
  readonly name: string;
  readonly type: DataType | IOTypeSpec | string;
  readonly multiple?: boolean;
}

/**
 * Turn a single spec (input or output value) into its corresponding type.
 *
 * Right now, this only supports the case where `type` is a `DataType`, i.e., a
 * key of `DataTypeMap` or the custom map provided by the user.
 *
 * TODO(msoulanille): Support more complex types when Visual Blocks implements
 * them.
 */
type SpecToType<
  S extends SpecLike,
  TypeMap extends DataTypeMap = DataTypeMap,
> = S['type'] extends keyof TypeMap
  ? S['multiple'] extends true
    ? Array<TypeMap[S['type']]> // `multiple` means the input is an array.
    : TypeMap[S['type']]
  : never;

/**
 * Turn a list of specs into a type object that represents the inputs or outputs
 * of a node.
 *
 * The type object is a map whose keys are the names of the specs and whose
 * types are looked up in the provided `TypeMap` by the `type` field of the
 * spec.
 *
 * This works for both input and output lists of specs.
 *
 * TODO(msoulanille): Support more complex types when Visual Blocks implements
 * them.
 */
type SpecsToTypeObject<
  Specs extends readonly SpecLike[],
  TypeMap extends DataTypeMap = DataTypeMap,
> = {
  -readonly [K in keyof Specs as K extends number
    ? never // Numbers get coalesced into a single type, so remove them.
    : Specs[K] extends SpecLike // Remove other properties of Array, like `get`
      ? Specs[K]['name']
      : never]+?: Specs[K] extends SpecLike
    ? SpecToType<Specs[K], TypeMap>
    : never;
};

/**
 * A type helper that turns a node spec into a type representing its inputs or
 * outputs.
 */
type GetNodeSpecType<
  T extends 'inputSpecs' | 'propertySpecs' | 'outputSpecs',
  S extends NodeSpec,
  TypeMap extends DataTypeMap,
> = [undefined] extends [S[T]]
  ? {}
  : SpecsToTypeObject<NonNullable<S[T]>, TypeMap>;

/**
 * Turn a node spec into a type representing its inputs.
 *
 * The second `TypeMap` parameter is optional, and can be provided to extend
 * the default set of supported VisualBlocks types with custom types, such as
 * when defining a custom node. For example, if you wanted to define a custom
 * node that takes a custom "TextEmbeddingVector" type as input, you could
 * define a custom `TypeMap` that includes `TextEmbeddingVector` as a key, and
 * then use that custom `TypeMap` as the second parameter to this function. e.g.,
 *
 * ```
 * const MY_NODE_SPEC = {
 *   id: 'my-node',
 *   name: 'My Node',
 *   category: Category.INPUT,
 *   inputSpecs: [
 *     {
 *       name: 'embedding',
 *       type: 'textEmbeddingVector',
 *     },
 *   ] as const,
 *   outputSpecs: [
 *     {
 *       name: 'output',
 *       type: DataType.STRING,
 *     },
 *   ] as const,
 * } satisfies NodeSpec;
 *
 * type MyCustomTypeMap = {
 *   textEmbeddingVector: TextEmbeddingVector;
 * };
 *
 * type MyCustomInput = InputType<typeof MY_NODE_SPEC, MyCustomTypeMap>;
 * ```
 */
export type InputType<
  S extends NodeSpec,
  TypeMap extends DataTypeMap = DataTypeMap,
> = GetNodeSpecType<'inputSpecs', S, TypeMap> &
  GetNodeSpecType<'propertySpecs', S, TypeMap>;

/**
 * Turn a node spec into a type representing its outputs.
 *
 * The second `TypeMap` parameter is optional, and can be provided to extend
 * the default set of supported VisualBlocks types with custom types, such as
 * when defining a custom node. For example, if you wanted to define a custom
 * node that emits a custom "TextEmbeddingVector" type as output, you could
 * define a custom `TypeMap` that includes `TextEmbeddingVector` as a key, and
 * then use that custom `TypeMap` as the second parameter to this function. e.g.,
 *
 * ```
 * const MY_NODE_SPEC = {
 *   id: 'my-node',
 *   name: 'My Node',
 *   category: Category.OUTPUT,
 *   inputSpecs: [
 *     {
 *       name: 'input',
 *       type: DataType.STRING,
 *     },
 *   ] as const,
 *   outputSpecs: [
 *     {
 *       name: 'embedding',
 *       type: 'textEmbeddingVector',
 *     },
 *   ] as const,
 * } satisfies NodeSpec;
 *
 * type MyCustomTypeMap = {
 *   textEmbeddingVector: TextEmbeddingVector;
 * };
 *
 * type MyCustomOutput = OutputType<typeof MY_NODE_SPEC, MyCustomTypeMap>;
 * ```
 */
export type OutputType<
  S extends NodeSpec,
  TypeMap extends Record<
    SpecLike['type'] extends string ? SpecLike['type'] : never,
    unknown
  > = {},
> = GetNodeSpecType<'outputSpecs', S, TypeMap & DataTypeMap>;
