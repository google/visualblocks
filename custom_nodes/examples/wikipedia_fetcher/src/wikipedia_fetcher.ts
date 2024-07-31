import '@visualblocks/custom-node-types';

import {LitElement} from 'lit';

import {NODE_SPEC} from './wikipedia_fetcher_nodespec';

////////////////////////////////////////////////////////////////////////////////
// Implement node.

declare interface Inputs {
  title: string;
}

/**
 * Fetch the wikipedia summary for the given title.
 */
export class WikipediaFetcher extends LitElement {
  private savedTitle = '';
  private cachedResult = '';

  render() {
    // This node doesn't have preview UI.
  }

  // The method can be async.
  async runWithInputs(inputs: Inputs) {
    const {title} = inputs;

    // Only send request when title changes. And cache the result.
    if (title !== this.savedTitle) {
      this.savedTitle = title;

      if (!title || title.trim() === '') {
        this.cachedResult = '';
      } else {
        try {
          const resp = await fetch(
            `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${
              title
            }&origin=*`
          );
          const json = await resp.json();
          const pagesObj = json['query']['pages'];
          this.cachedResult =
            pagesObj[[...Object.keys(pagesObj)][0]]['extract'] || '';
        } catch (e) {
          // Send error.
          this.dispatchEvent(
            new CustomEvent('outputs', {
              detail: {
                error: {
                  title: `Failed to fetch summary for "${title}"`,
                  message: e,
                },
              },
            })
          );
          return;
        }
      }
    }

    // Output result.
    this.dispatchEvent(
      new CustomEvent('outputs', {
        detail: {
          summary: this.cachedResult,
        },
      })
    );
  }
}

////////////////////////////////////////////////////////////////////////////////
// Register custom node with visual blocks.

visualblocks.registerCustomNode({
  nodeSpec: NODE_SPEC,
  nodeImpl: WikipediaFetcher,
});
