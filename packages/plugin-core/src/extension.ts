import * as vscode from "vscode";

let _initWSRegistered = false;

export function activate(context: vscode.ExtensionContext) {
  // Register initWS before anything else
  if (!_initWSRegistered) {
    _initWSRegistered = true;
    context.subscriptions.push(
      vscode.commands.registerCommand("dendron.initWS", async () => {
        try {
          const mod = require("./commands/SetupWorkspace");
          const cmd = new mod.SetupWorkspaceCommand();
          await cmd.run();
        } catch (err: any) {
          try {
            const webMod = require("./web/commands/SetupWorkspaceCmd");
            const cmd = new webMod.SetupWorkspaceCmd();
            await cmd.run();
          } catch (webErr: any) {
            vscode.window.showErrorMessage(
              `Failed to initialize workspace: ${webErr?.message || webErr}`
            );
          }
        }
      })
    );
  }

  // Load the rest of the extension — show errors instead of hiding them
  try {
    const { Logger } = require("./logger");
    Logger.configure(context, "debug");
    require("./_extension").activate(context);
    const { DWorkspace } = require("./workspacev2");
    return { DWorkspace, Logger };
  } catch (err: any) {
    const msg = err?.message || String(err);
    vscode.window.showErrorMessage(`Arborist Notes activation error: ${msg}`);
    // Create an output channel for detailed error info
    const channel = vscode.window.createOutputChannel("Arborist Notes");
    channel.appendLine("=== Activation Error ===");
    channel.appendLine(err?.stack || msg);
    channel.show();
    return {};
  }
}

export function deactivate() {
  try {
    require("./_extension").deactivate();
  } catch {
    // ignore
  }
}
