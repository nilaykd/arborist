import * as vscode from "vscode";
import { Logger } from "./logger";
import { DWorkspace } from "./workspacev2";

export function activate(context: vscode.ExtensionContext) {
  Logger.configure(context, "debug");

  // Register initWS at the absolute entry point — before any heavy imports.
  // This guarantees the command is available even if the rest of the extension
  // fails to load (e.g. no workspace detected, missing deps, etc.)
  context.subscriptions.push(
    vscode.commands.registerCommand("dendron.initWS", async () => {
      try {
        const { SetupWorkspaceCommand } = require("./commands/SetupWorkspace");
        const cmd = new SetupWorkspaceCommand();
        await cmd.run();
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `Failed to initialize workspace: ${err?.message || err}`
        );
      }
    })
  );

  try {
    require("./_extension").activate(context); // eslint-disable-line global-require
  } catch (err) {
    // Extension activation failed — initWS is still available
    Logger.error({ ctx: "activate", error: err as any });
  }

  return {
    DWorkspace,
    Logger,
  };
}

export function deactivate() {
  try {
    require("./_extension").deactivate(); // eslint-disable-line global-require
  } catch {
    // ignore
  }
}
