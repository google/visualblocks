export const NODE_SPEC = {
  id: 'image-grid',
  name: 'Image grid',
  description: 'Render the input image in a grid.',
  category: 'output',

  propertySpecs: [
    {
      name: 'gridSizeX',
      displayLabel: 'Grid size X',
      defaultValue: 3,
      editorSpec: {
        type: 'number',
        min: 1,
        max: 8,
        integers: true,
      },
    },
    {
      name: 'gridSizeY',
      displayLabel: 'Grid size Y',
      defaultValue: 3,
      editorSpec: {
        type: 'number',
        min: 1,
        max: 8,
        integers: true,
      },
    },
  ],
  inputSpecs: [
    {
      name: 'original',
      type: 'image',
    },
  ],
  outputSpecs: [
    {
      name: 'result',
      type: 'image',
    },
  ],
};
