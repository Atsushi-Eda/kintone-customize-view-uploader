import fs from "fs";
import mkdirp from "mkdirp";
import { CustomizeViewManifest } from "./index";
import { Lang } from "../lang";
import { getBoundMessage } from "../messages";

export const getInitCustomizeViewManifest = (
  appId: string
): CustomizeViewManifest => {
  return {
    app: appId,
    customizeViews: [],
  };
};

export const generateCustomizeViewManifest = (
  customizeViewManifest: CustomizeViewManifest,
  destDir: string
): Promise<any> => {
  if (!fs.existsSync(`${destDir}`)) {
    mkdirp.sync(`${destDir}`);
  }
  return new Promise((resolve, reject) => {
    return fs.writeFile(
      `${destDir}/customize-view-manifest.json`,
      JSON.stringify(customizeViewManifest, null, 4),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(customizeViewManifest, null, 4));
        }
      }
    );
  });
};

export const runInit = async (
  appId: string,
  lang: Lang,
  destDir: string
): Promise<any> => {
  const m = getBoundMessage(lang);
  const customizeViewManifest = getInitCustomizeViewManifest(appId);
  await generateCustomizeViewManifest(customizeViewManifest, destDir);
  console.log(`${destDir}/${m("M_CommandInitFinish")}`);
};
