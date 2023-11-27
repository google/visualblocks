import {css} from 'lit';

export const STYLES = css`
    .container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .title-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      box-sizing: border-box;
    }

    .x-select {
      margin-right: 8px;
    }

    select {
      margin-left: 4px;
    }

    canvas {
      width: 100%;
      flex-grow: 1;
      min-height: 0;
      object-fit: contain;
    }

    .no-input {
      position: absolute;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
    }
  `;
