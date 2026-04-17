import { NextjsExportPodUtils } from "@dendronhq/pods-core";
import _ from "lodash";
import * as vscode from "vscode";
import { env, Uri, window } from "vscode";
import { DENDRON_COMMANDS } from "../constants";
import { NextJSPublishUtils } from "../utils/site";
import { BasicCommand } from "./base";

type CommandOutput = {
  nextPath: string;
  url: string;
};

const NEXT_DEV_DEFAULT_PORT = 3000;

export class PublishDevCommand extends BasicCommand<void, CommandOutput> {
  key = DENDRON_COMMANDS.PUBLISH_DEV.key;

  async gatherInputs(): Promise<any> {
    return {};
  }

  async execute() {
    const ctx = "PublishDevCommand";
    this.L.info({ ctx, msg: "enter" });

    const prepareOut = await NextJSPublishUtils.prepareNextJSExportPod();
    const { enrichedOpts, cmd, nextPath } = prepareOut;

    if (_.isUndefined(enrichedOpts)) {
      window.showWarningMessage(
        "Cancelled: no pod configuration was selected."
      );
      return { nextPath, url: "" };
    }

    const nextPathExists = await NextjsExportPodUtils.nextPathExists({
      nextPath,
    });
    if (!nextPathExists) {
      await NextJSPublishUtils.initialize(nextPath);
    }

    const skipBuild = await NextJSPublishUtils.promptSkipBuild();
    if (!skipBuild) {
      const { podChoice, config } = enrichedOpts;
      await NextJSPublishUtils.build(cmd, podChoice, config);
    }

    await NextJSPublishUtils.dev(nextPath);

    const externalUri = await env.asExternalUri(
      Uri.parse(`http://localhost:${NEXT_DEV_DEFAULT_PORT}`)
    );
    const url = externalUri.toString();

    this.L.info({ ctx, msg: "dev server url", url });

    window
      .showInformationMessage(
        `Arborist dev server running at ${url}`,
        "Open in Browser"
      )
      .then((choice) => {
        if (choice === "Open in Browser") {
          vscode.env.openExternal(Uri.parse(url));
        }
      });

    return { nextPath, url };
  }

  async showResponse(_opts: CommandOutput) {
    // Notification is surfaced inline in execute() so a second click doesn't
    // stack another message on top.
    return;
  }
}
