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
