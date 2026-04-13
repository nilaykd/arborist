import * as vscode from "vscode";

// Register initWS at module level — before ANY local imports that could fail.
// This runs the moment the module is evaluated by VS Code's extension host.
let _initWSRegistered = false;

export function activate(context: vscode.ExtensionContext) {
  // Absolute first thing: register initWS
  if (!_initWSRegistered) {
    _initWSRegistered = true;
    context.subscriptions.push(
      vscode.commands.registerCommand("dendron.initWS", async () => {
        try {
          const mod = require("./commands/SetupWorkspace");
          const cmd = new mod.SetupWorkspaceCommand();
          await cmd.run();
        } catch (err: any) {
          // If desktop SetupWorkspace fails (e.g. missing Node deps in web),
          // fall back to the web-compatible version
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

  // Now load the rest of the extension
  try {
    const { Logger } = require("./logger");
    Logger.configure(context, "debug");
    require("./_extension").activate(context);
    const { DWorkspace } = require("./workspacev2");
    return { DWorkspace, Logger };
  } catch (err) {
    // Extension failed to load — initWS is still available
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
