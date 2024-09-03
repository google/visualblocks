import {exec} from 'child_process';
import * as fs from 'node:fs/promises';
import * as path from 'path';

function $(command) {
  console.log(command);
  return exec(command);
}

const packageJsonDir = path.join(import.meta.dirname, '../');
const packageJsonData = await fs.readFile(path.join(packageJsonDir, 'package.json'));
const packageJson = JSON.parse(packageJsonData.toString('utf8'));
const {name, version} = packageJson;

const rootGcpPackagePath
      = `gs://tfweb/visualblocks-github-bundles/${name}@${version}/`;

console.log('Copying package.json to GCP');
$(`cd ${packageJsonDir} && gcloud storage cp -r package.json ${rootGcpPackagePath}`);

// Copy the dist/ bundles and sourcemaps.
// The src/ directory is not required for sourcemaps to work since they bundle
// the source code themselves.
console.log('Copying dist/ to GCP');
$(`cd ${packageJsonDir} && gcloud storage cp -r dist ${rootGcpPackagePath}`);

