import { ConfigUtils, CONSTANTS } from "@dendronhq/common-all";
import * as vscode from "vscode";
import { DENDRON_COMMANDS } from "../../constants";
import YAML from "js-yaml";

const GITIGNORE_CONTENT = [
  "node_modules",
  ".dendron.*",
  "build",
  "seeds",
  ".next",
  "pods/service-connections",
].join("\n");

const ROOT_NOTE_BODY = [
  "# Welcome to Arborist Notes",
  "",
  "This is the root of your vault. You are free to customize this page.",
].join("\n");

function makeRootNote(vault: string): string {
  const now = Date.now();
  return [
    "---",
    "id: root",
    `title: ${vault}`,
    "desc: ''",
    `updated: ${now}`,
    `created: ${now}`,
    "---",
    "",
    ROOT_NOTE_BODY,
    "",
  ].join("\n");
}

function makeRootSchema(): string {
  return [
    "version: 1",
    "imports: []",
    "schemas:",
    "  - id: root",
    "    title: root",
    "    parent: root",
    "",
  ].join("\n");
}

function makeDendronConfig(vaultName: string): string {
  const config = ConfigUtils.genLatestConfig();
  config.workspace.vaults = [{ fsPath: vaultName }];
  return YAML.dump(config);
}

async function writeText(uri: vscode.Uri, content: string): Promise<void> {
  await vscode.workspace.fs.writeFile(uri, Buffer.from(content, "utf-8"));
}

/**
 * Web-compatible workspace initialization.
 * Uses vscode.workspace.fs exclusively — works in Codespaces and VS Code Web.
 */
export class SetupWorkspaceCmd {
  static key = DENDRON_COMMANDS.INIT_WS.key;

  async run(): Promise<void> {
    // Ask user to pick a folder
    const folders = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
      openLabel: "Create Workspace Here",
    });

    if (!folders || folders.length === 0) return;

    const wsRoot = folders[0];
    const vaultName = "vault";
    const vaultUri = vscode.Uri.joinPath(wsRoot, vaultName);

    try {
      // Create vault directory
      await vscode.workspace.fs.createDirectory(vaultUri);

      // Write dendron.yml
      await writeText(
        vscode.Uri.joinPath(wsRoot, CONSTANTS.DENDRON_CONFIG_FILE),
        makeDendronConfig(vaultName)
      );

      // Write .gitignore
      await writeText(
        vscode.Uri.joinPath(wsRoot, ".gitignore"),
        GITIGNORE_CONTENT
      );

      // Write root note
      await writeText(
        vscode.Uri.joinPath(vaultUri, "root.md"),
        makeRootNote(vaultName)
      );

      // Write root schema
      await writeText(
        vscode.Uri.joinPath(vaultUri, "root.schema.yml"),
        makeRootSchema()
      );

      vscode.window.showInformationMessage("Workspace created. Reloading...");

      // Open the workspace folder
      await vscode.commands.executeCommand("vscode.openFolder", wsRoot);
    } catch (err: any) {
      vscode.window.showErrorMessage(
        `Failed to create workspace: ${err.message || err}`
      );
    }
  }
}
