import { Lang } from "./lang";

const messages = {
  E_requiredManifestFile: {
    en: "Please specify manifest file",
    ja: "マニフェストファイルを指定してください",
  },
  Q_Domain: {
    en: "Input your kintone's domain (example.cybozu.com):",
    ja: "kintoneのドメインを入力してください (example.cybozu.com):",
  },
  Q_UserName: {
    en: "Input your username:",
    ja: "ログイン名を入力してください:",
  },
  Q_Password: {
    en: "Input your password:",
    ja: "パスワードを入力してください:",
  },
  Q_AppId: {
    en: "Input your app id:",
    ja: "アプリIDを入力してください:",
  },
  M_Updated: {
    en: "View setting has been updated!",
    ja: "一覧の設定を変更しました!",
  },
  M_UpdateManifestFile: {
    en: "Update manifest file based on the current view setting on kintone app",
    ja: "kintoneのアプリの一覧設定を元にマニフェストファイルを更新しています",
  },
  M_CommandInitFinish: {
    en: "customize-view-manifest.json file has been created",
    ja: "customize-view-manifest.json を生成しました",
  },
  M_CommandImportFinish: {
    en: "Finish importing customize views from kintone app",
    ja: "kintoneのアプリからカスタマイズビューのインポートが完了しました",
  },
  E_Updated: {
    en: "Failed to update view setting",
    ja: "一覧の設定の変更に失敗しました",
  },
  M_Deployed: {
    en: "Setting has been deployed!",
    ja: "運用環境に反映しました!",
  },
  E_Authentication: {
    en:
      "Failed to authenticate. Please confirm your username, password, and domain",
    ja:
      "認証に失敗しました。ログイン名、パスワード、ドメインを確認してください",
  },
  E_Deployed: {
    en: "Failed to deploy setting",
    ja: "運用環境への反映に失敗しました",
  },
  M_Deploying: {
    en: "Wait for deploying completed...",
    ja: "運用環境への反映の完了を待っています...",
  },
  M_Watching: {
    en: "Watching for file changes...",
    ja: "ファイルの変更を監視しています...",
  },
  E_Retry: {
    en: "An error occured, retry",
    ja: "エラーが発生しました。リトライします",
  },
  E_Exit: {
    en:
      "An error occured, exit process. Please check if you passed proper arguments and manifest file",
    ja:
      "エラーが発生しました。引数の値と、マニフェストファイルに正しい値が入力されているか確認してください",
  },
} as const;

/**
 * Returns a message for the passed lang and key
 * @param lang
 * @param key
 */
export function getMessage(lang: Lang, key: keyof typeof messages) {
  return messages[key][lang];
}

/**
 * Returns a function bound lang to getMessage
 * @param lang
 */
export function getBoundMessage(
  lang: Lang
): (key: keyof typeof messages) => string {
  return (key) => getMessage(lang, key);
}
