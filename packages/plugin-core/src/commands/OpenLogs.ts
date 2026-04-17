import { Uri, window, workspace, version as vscodeVersion, env } from "vscode";
import * as os from "os";
import { DENDRON_COMMANDS } from "../constants";
import { ExtensionProvider } from "../ExtensionProvider";
import { Logger } from "../logger";
import { VSCodeUtils } from "../vsCodeUtils";
import { BasicCommand } from "./base";

const L = Logger;

type OpenLogsCommandOpts = {};

export class OpenLogsCommand extends BasicCommand<OpenLogsCommandOpts, void> {
  key = DENDRON_COMMANDS.OPEN_LOGS.key;
  async execute(opts?: OpenLogsCommandOpts) {
    const ctx = "OpenLogs";
    L.info({ ctx, opts });
    await this.writeDiagnosticSnapshot();
    const logPath = Logger.logPath;
    if (!logPath) {
      throw Error("logPath not defined");
    }
    const doc = await workspace.openTextDocument(Uri.file(logPath));
    window.showTextDocument(doc);
    return;
  }

  /**
   * Append a snapshot of extension/workspace state to the log so a single
   * log paste gives enough context to diagnose any issue, not just the one
   * the user happens to be reproducing.
   */
  private async writeDiagnosticSnapshot() {
    const ctx = "OpenLogs.diagnostic";
    try {
      const ext = ExtensionProvider.getExtension();
      const workspaceService = ExtensionProvider.getDWorkspace();
      const engine = ext.getEngine();
      const activeEditor = VSCodeUtils.getActiveTextEditor();

      const pkg = ext.context.extension?.packageJSON ?? {};
      const visibleEditors = window.visibleTextEditors.map(
        (e) => e.document.uri.fsPath
      );

      let noteCount: number | undefined;
      try {
        const notes = await engine.findNotes({ excludeStub: false });
        noteCount = notes.length;
      } catch (e) {
        noteCount = undefined;
      }

      L.info({
        ctx,
        msg: "=== DIAGNOSTIC SNAPSHOT ===",
        extension: {
          name: pkg.name,
          version: pkg.version,
          publisher: pkg.publisher,
        },
        runtime: {
          vscode: vscodeVersion,
          appName: env.appName,
          remoteName: env.remoteName,
          uiKind: env.uiKind,
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
        },
        workspace: {
          wsRoot: workspaceService.wsRoot,
          vaults: workspaceService.vaults.map((v) => ({
            name: v.name,
            fsPath: v.fsPath,
            selfContained: v.selfContained,
          })),
          vaultCount: workspaceService.vaults.length,
          noteCount,
        },
        editors: {
          activePath: activeEditor?.document.uri.fsPath,
          activeLanguageId: activeEditor?.document.languageId,
          activeIsDirty: activeEditor?.document.isDirty,
          visibleCount: visibleEditors.length,
          visible: visibleEditors,
        },
      });
    } catch (err) {
      L.error({
        ctx,
        msg: `failed to write diagnostic snapshot: ${
          err instanceof Error ? err.message : String(err)
        }`,
      });
    }
  }
}
