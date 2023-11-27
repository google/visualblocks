export const NODE_SPEC = {
  'id': 'make-uppercase-vanilla',
  'name': 'Make uppercase (vanilla)',
  'description': 'Transform the input text to upper case.',
  'category': 'processor',

  // Properties.
  "propertySpecs": [
    {
      "name": "option",
      "type": "string",
      "editorSpec": {
        "type": "dropdown",
        "options": [
          {
            "value": "first-letter",
            "label": "First letter only"
          },
          {
            "value": "all-letters",
            "label": "All letters"
          }
        ]
      }
    }
  ],

  // Inputs.
  'inputSpecs': [{
    'name': 'text',
    'type': 'string',
    "editorSpec": {
      "type": "text_input"
    },
  }],

  // Outputs.
  'outputSpecs': [{
    'name': 'result',
    'type': 'string',
  }],
};
