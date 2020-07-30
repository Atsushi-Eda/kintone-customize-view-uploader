import fs from "fs";
import mkdirp from "mkdirp";
import { sep } from "path";
import { Constans } from "../constants";
import {
  CustomizeViewManifest,
  View,
  CustomizeView,
  GetViewsResp,
} from "./index";
import KintoneApiClient, { AuthenticationError } from "../KintoneApiClient";
import { Lang } from "../lang";
import { getBoundMessage } from "../messages";
import { wait } from "../util";

export interface Option {
  lang: Lang;
  proxy: string;
  guestSpaceId: number;
  destDir: string;
}

export interface ImportCustomizeViewManifest {
  app: string;
}

export async function importViewSetting(
  kintoneApiClient: KintoneApiClient,
  manifest: ImportCustomizeViewManifest,
  status: {
    retryCount: number;
  },
  options: Option
): Promise<void> {
  const m = getBoundMessage(options.lang);
  const appId = manifest.app;
  let { retryCount } = status;

  try {
    const views = kintoneApiClient.getViews(appId);
    return views.then((resp: GetViewsResp) => {
      console.log(m("M_UpdateManifestFile"));
      exportAsManifestFile(appId, options.destDir, resp);
    });
  } catch (e) {
    const isAuthenticationError = e instanceof AuthenticationError;
    retryCount++;
    if (isAuthenticationError) {
      throw new Error(m("E_Authentication"));
    } else if (retryCount < Constans.MAX_RETRY_COUNT) {
      await wait(1000);
      console.log(m("E_Retry"));
      return importViewSetting(
        kintoneApiClient,
        manifest,
        { retryCount },
        options
      );
    } else {
      throw e;
    }
  }
}

function exportAsManifestFile(
  appId: string,
  destRootDir: string,
  resp: GetViewsResp
): GetViewsResp {
  const customizeViews: CustomizeView[] = Object.values(resp.views)
    .filter((view: View) => view.type === "CUSTOM")
    .map((view: View) => ({
      ...view,
      file: `${destRootDir}${sep}html${sep}${view.name}.html`,
    }));
  const customizeViewJson: CustomizeViewManifest = {
    app: appId,
    customizeViews: customizeViews.map((customizeView: CustomizeView) => ({
      name: customizeView.name,
      file: customizeView.file,
    })),
  };

  if (!fs.existsSync(`${destRootDir}`)) {
    mkdirp.sync(`${destRootDir}`);
  }
  fs.writeFileSync(
    `${destRootDir}${sep}customize-view-manifest.json`,
    JSON.stringify(customizeViewJson, null, 4)
  );
  exportHtmlFiles(destRootDir, customizeViews);
  return resp;
}

function exportHtmlFiles(
  destRootDir: string,
  customizeViews: CustomizeView[]
): void {
  if (!fs.existsSync(`${destRootDir}${sep}html`)) {
    mkdirp.sync(`${destRootDir}${sep}html`);
  }
  customizeViews.forEach((customizeView: CustomizeView) => {
    fs.writeFileSync(customizeView.file, customizeView.html);
  });
}

export const runImport = async (
  domain: string,
  username: string,
  password: string,
  basicAuthUsername: string | null,
  basicAuthPassword: string | null,
  manifestFile: string,
  options: Option
): Promise<void> => {
  const m = getBoundMessage(options.lang);
  const manifest: ImportCustomizeViewManifest = JSON.parse(
    fs.readFileSync(manifestFile, "utf8")
  );
  const status = {
    retryCount: 0,
  };

  const kintoneApiClient = new KintoneApiClient(
    username,
    password,
    basicAuthUsername,
    basicAuthPassword,
    domain,
    options
  );
  await importViewSetting(kintoneApiClient, manifest, status, options);
  console.log(m("M_CommandImportFinish"));
};
