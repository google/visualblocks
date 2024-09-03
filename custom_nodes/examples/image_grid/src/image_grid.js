import {html, LitElement} from 'lit';

import {NODE_SPEC} from './image_grid_nodespec';
import {STYLES} from './styles';

////////////////////////////////////////////////////////////////////////////////
// Implement node.

/**
 * Show the input image in a grid.
 */
export class ImageGrid extends LitElement {
  static styles = STYLES;

  static properties = {
    curGridSizeX: {attribute: false},
    curGridSizeY: {attribute: false},
    hasInputImage: {attribute: false},
  };

  constructor() {
    super();

    this.canvasId = '';
    this.curGridSizeX = 0;
    this.curGridSizeY = 0;
    this.hasInputImage = false;

    // Populate select's options.
    this.options = [];
    for (let i = 1; i <= 8; i++) {
      this.options.push(html`<option value="${i}">${i}</option>`);
    }
  }

  render() {
    // The UI rendered here will be projected into its preview panel UI.
    return html` <div class="container">
      <div class="title-container">
        X:
        <select class="x-select" @change="${this._handleGridSizeXChanged}">
          ${this.options}
        </select>
        Y:
        <select class="y-select" @change="${this._handleGridSizeYChanged}">
          ${this.options}
        </select>
      </div>
      <canvas id="output-image"></canvas>
      ${this.hasInputImage
        ? html``
        : html`<div class="no-input">No input</div>`}
    </div>`;
  }

  runWithInputs(input, services) {
    // Get the ResourceService from services.
    const {resourceService} = services;

    // `original`, `gridSizeX`, and `gridSizeY` should match the `name` of this
    // node's input specs and property specs.
    const {original, gridSizeX, gridSizeY} = input;
    this.curGridSizeX = gridSizeX;
    this.curGridSizeY = gridSizeY;
    this.hasInputImage = original != null;

    // Update size selectors in preview panel UI.
    if (this._xSizeSelector) {
      this._xSizeSelector.value = this.curGridSizeX;
    }
    if (this._ySizeSelector) {
      this._ySizeSelector.value = this.curGridSizeY;
    }

    // Dispatch the `outputs` custom event without `details` to indicate that
    // this node finishes running without any results. In this case, we do this
    // because the input `original` is not available.
    if (!original) {
      this.dispatchEvent(new CustomEvent('outputs'));
      return;
    }

    // Render the source canvas in a grid.
    //
    // Get the source canvas from the ResourceService using the canvasId stored
    // in the input image `original`.
    const sourceCanvas = resourceService.get(original.canvasId);
    const {width: sourceWidth, height: sourceHeight} = sourceCanvas;
    const outputCanvas = this.shadowRoot.getElementById('output-image');
    const ctx = outputCanvas.getContext('2d');
    this._resizeCanvas(outputCanvas, {
      width: sourceWidth * this.curGridSizeX,
      height: sourceHeight * this.curGridSizeY,
    });
    const {width, height} = outputCanvas;
    ctx.clearRect(0, 0, width, height);
    for (let x = 0; x < gridSizeX; x++) {
      for (let y = 0; y < gridSizeY; y++) {
        let startX = (width / gridSizeX) * x;
        let startY = (height / gridSizeY) * y;
        let w = width / gridSizeX;
        let h = height / gridSizeY;
        ctx.drawImage(
          sourceCanvas,
          0,
          0,
          sourceWidth,
          sourceHeight,
          startX,
          startY,
          w,
          h
        );
      }
    }

    // Output canvas.
    //
    // Make sure we use a different canvasId when outputing so the downstream
    // nodes know something has changed.
    if (this.canvasId) {
      resourceService.delete(this.canvasId);
    }
    this.canvasId = resourceService.put(outputCanvas);
    const outputImage = {
      canvasId: this.canvasId,
    };
    // `result` should match the `name` of this node's outputSpec.
    this.dispatchEvent(
      new CustomEvent('outputs', {detail: {result: outputImage}})
    );
  }

  _resizeCanvas(canvas, size) {
    let resize = false;
    if (canvas.width !== size.width) {
      canvas.width = size.width;
      resize = true;
    }
    if (canvas.height !== size.height) {
      canvas.height = size.height;
      resize = true;
    }
    return resize;
  }

  _handleGridSizeXChanged(e) {
    const gridSizeX = Number(e.target.value);

    // Dispatch a custom event `pipelineRerunTrigger` to manually re-run the
    // whole pipeline. You can also pass any property values to update.
    //
    // Here, we pass `gridSizeX` to the event, meaning we want to update the
    // gridSizeX property in the node before the pipeline re-runs.
    this.dispatchEvent(
      new CustomEvent('pipelineRerunTrigger', {detail: {gridSizeX}})
    );
  }

  _handleGridSizeYChanged(e) {
    const gridSizeY = Number(e.target.value);

    // See comments above in _handleGridSizeXChanged.
    this.dispatchEvent(
      new CustomEvent('pipelineRerunTrigger', {detail: {gridSizeY}})
    );
  }

  get _xSizeSelector() {
    return this.renderRoot?.querySelector('.x-select') ?? null;
  }

  get _ySizeSelector() {
    return this.renderRoot?.querySelector('.y-select') ?? null;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Register custom node with visual blocks.

visualblocks.registerCustomNode({nodeSpec: NODE_SPEC, nodeImpl: ImageGrid});
