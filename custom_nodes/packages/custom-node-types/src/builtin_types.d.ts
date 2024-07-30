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
    className: string,
    probability: number,
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
    xMin?: number,
    xMax?: number,
    yMin?: number,
    yMax?: number,
  };
  keypoints?: Array<{x: number, y: number, z?: number}>;
}

/** The source of the landmark result. */
export enum VisualBlocksLandmarkSource {
  FACE_LANDMARK = 'face_landmark',
  FACE_DETECTION = 'face_detection',
  POSE_LANDMARK = 'pose_landmark',
  HAND_POSE_DETECTION = 'hand_pose_detection',
  GESTURE_RECOGNITION = 'gesture_recognition'
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
    left: number,  // same as xMin
    top: number,   // same as yMin
    width: number,
    height: number,
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
