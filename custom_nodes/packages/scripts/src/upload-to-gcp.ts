#!/usr/bin/env node

import {ArgumentParser} from 'argparse';
import {exec} from 'child_process';
import * as fs from 'node:fs/promises';
import * as path from 'path';
import chalk from 'chalk';

function $(command: string) {
  console.log(chalk.gray(command));
  return exec(command);
}

export async function uploadPackageToGcp(packagePath = '.') {
  packagePath = await fs.realpath(packagePath);

  const packageJsonData = await fs.readFile(
    path.join(packagePath, 'package.json')
  );

  const packageJson = JSON.parse(packageJsonData.toString('utf8'));
  const {name, version} = packageJson;

  console.log(`Uploading ${chalk.bold(name)} to GCP`);

  const versionedGcpPackagePath = `gs://tfweb/visualblocks-github-bundles/${name}@${version}/`;
  const latestGcpPackagePath = `gs://tfweb/visualblocks-github-bundles/${name}@latest/`;

  for (const gcpPath of [versionedGcpPackagePath, latestGcpPackagePath]) {
    $(`cd ${packagePath} && gcloud storage cp -r package.json ${gcpPath}`);

    // Copy the dist/ bundles and sourcemaps.
    // The src/ directory is not required for sourcemaps to work since they bundle
    // the source code themselves.
    $(`cd ${packagePath} && gcloud storage cp -r dist ${gcpPath}`);
  }
}

async function main() {
  const parser = new ArgumentParser({
    description:
      'Upload a package to the VisualBlocks GitHub GCP bucket. Run in the root directory of the package to upload.',
  });

  parser.add_argument('-p', '--package', {
    help: 'The path to the root directory of the package to upload',
    type: String,
    default: '.',
  });
  const args = parser.parse_args();

  uploadPackageToGcp(args['packagePath'] as string);
}

main().catch((e: Error) => console.error(e));
