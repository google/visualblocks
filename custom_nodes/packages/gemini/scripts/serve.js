/**
 * @license
 * Copyright 2024 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

const express = require('express');
const esbuild = require('esbuild');
const app = express();
const port = 8080;

app.use((req, res, next) => {
  const allowedOrigin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Build and serve bundle.js on request
app.get('/', async (req, res) => {
    try {
        const result = await esbuild.build({
            entryPoints: ['src/index.ts'],
            bundle: true,
            write: false, // We set write to false to handle the file directly
            sourcemap: 'inline', // Inline sourcemap for simplicity
            format: 'esm',
        });
        res.setHeader('Content-Type', 'application/javascript');
        res.send(result.outputFiles[0].text);
    } catch (error) {
        console.error(error);
        res.status(500).send('Build failed');
    }
});

// Handle preflight requests specifically for bundle.js
app.options('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Dev server running on http://localhost:${port}`);
});
