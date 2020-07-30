import chokidar from "chokidar";
import fs from "fs";
import KintoneApiClient, { AuthenticationError } from "../KintoneApiClient";
import { Lang } from "../lang";
import { getBoundMessage } from "../messages";
import { wait } from "../util";

export interface Option {
  watch?: string;
  lang: Lang;
  proxy: string;
  guestSpaceId: number;
}

export interface Status {
  retryCount: number;
  updateBody: any;
  updated: boolean;
}

export interface View {
  type: "LIST" | "CALENDAR" | "CUSTOM";
  name: string;
  index: number;
  builtinType?: string;
  id?: string;
  fields?: string[];
  date?: string;
  title?: string;
  html: string;
  pager?: boolean;
  device?: "DESKTOP" | "ANY";
  filterCond?: string;
  sort?: string;
}

export interface CustomizeView extends View {
  file: string;
}

export interface FormattedCustomizeView {
  name: string;
  file: string;
}

export interface CustomizeViewManifest {
  app: string;
  customizeViews: FormattedCustomizeView[];
}

export interface GetViewsResp {
  views: { [key: string]: View };
}

const MAX_RETRY_COUNT = 3;

export async function upload(
  kintoneApiClient: KintoneApiClient,
  manifest: CustomizeViewManifest,
  status: Status,
  options: Option
): Promise<void> {
  const m = getBoundMessage(options.lang);
  const appId = manifest.app;
  let { retryCount, updateBody, updated } = status;

  try {
    if (!updated) {
      const views: GetViewsResp = await kintoneApiClient.getViews(appId);
      manifest.customizeViews.forEach(
        (customizeView: FormattedCustomizeView) => {
          if (customizeView.name in views.views) {
            views.views[customizeView.name].html = fs.readFileSync(
              customizeView.file,
              "utf8"
            );
          } else {
            views.views[customizeView.name] = {
              type: "CUSTOM",
              name: customizeView.name,
              index: Object.keys(views).length,
              html: fs.readFileSync(customizeView.file, "utf8"),
            };
          }
        }
      );
      updateBody = {
        app: appId,
        views: views.views,
      };
      try {
        await kintoneApiClient.updateViews(updateBody);
        console.log(m("M_Updated"));
        updated = true;
      } catch (e) {
        console.log(m("E_Updated"));
        throw e;
      }
    }

    try {
      await kintoneApiClient.deploySetting(appId);
      await kintoneApiClient.waitFinishingDeploy(appId, () =>
        console.log(m("M_Deploying"))
      );
      console.log(m("M_Deployed"));
    } catch (e) {
      console.log(m("E_Deployed"));
      throw e;
    }
  } catch (e) {
    const isAuthenticationError = e instanceof AuthenticationError;
    retryCount++;
    if (isAuthenticationError) {
      throw new Error(m("E_Authentication"));
    } else if (retryCount < MAX_RETRY_COUNT) {
      await wait(1000);
      console.log(m("E_Retry"));
      await upload(
        kintoneApiClient,
        manifest,
        { retryCount, updateBody, updated },
        options
      );
    } else {
      throw e;
    }
  }
}

export const run = async (
  domain: string,
  username: string,
  password: string,
  basicAuthUsername: string | null,
  basicAuthPassword: string | null,
  manifestFile: string,
  options: Option
): Promise<void> => {
  const m = getBoundMessage(options.lang);

  const manifest: CustomizeViewManifest = JSON.parse(
    fs.readFileSync(manifestFile, "utf8")
  );
  const status = {
    retryCount: 0,
    updateBody: null,
    updated: false,
  };

  const files: string[] = manifest.customizeViews.map(
    (customizeView: FormattedCustomizeView) => customizeView.file
  );

  const kintoneApiClient = new KintoneApiClient(
    username,
    password,
    basicAuthUsername,
    basicAuthPassword,
    domain,
    options
  );
  await upload(kintoneApiClient, manifest, status, options);

  if (options.watch) {
    const watcher = chokidar.watch(files, {
      // Avoid that multiple change events were fired depending on which OS or text editors you are using with
      // Note that there would be higher possibility to get errors if you set smaller value of 'stabilityThreshold'
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    });
    console.log(m("M_Watching"));
    watcher.on("change", () =>
      upload(kintoneApiClient, manifest, status, options)
    );
  }
};

export * from "./import";
export * from "./init";
