/* eslint-disable no-console */

/**
 * Compiles all code for Dendron Plugin
 */

const execa = require("execa");

const $ = (cmd) => {
  console.log(`$ ${cmd}`);
  return execa.commandSync(cmd, { stdout: process.stdout, buffer: false });
};

console.log("building all...");
$(`npx lerna run build --scope @dendronhq/common-all`);
$(`npx lerna run build --scope @dendronhq/unified`);
$(`npx lerna run build --scope @dendronhq/common-server`);
$(`npx lerna run build --scope @dendronhq/dendron-viz`);
$(`npx lerna run build --scope @dendronhq/engine-server`);
$(`npx lerna run build --scope @dendronhq/pods-core`);
$(`npx lerna run build --scope @dendronhq/common-test-utils`);
$(`npx lerna run build --scope @dendronhq/api-server`);
$(`npx lerna run build --scope @dendronhq/common-assets`);
$(`npx lerna run build --scope @dendronhq/common-frontend`);
$(`npx lerna run build --scope @dendronhq/dendron-cli`);
$(`npx lerna run build --scope @dendronhq/engine-test-utils`);
$(`npx lerna run build --scope @dendronhq/dendron-plugin-views`);
$(`npx lerna run build --scope @dendronhq/plugin-core`);
$(`npx yarn dendron dev sync_assets --fast`);
console.log("done");
