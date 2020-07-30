# kintone-customize-view-uploader

A kintone customize view uploader

## Usage
```
% npm install kintone-customize-view-uploader

% ./node_modules/.bin/kintone-customize-view-uploader init
? Input your app id: {appId}

dest/customize-view-manifest.json file has been created

% ./node_modules/.bin/kintone-customize-view-uploader import dest/customize-view-manifest.json
? Input your kintone's domain (example.cybozu.com): {yourDomain}
? Input your username: {userLoginName}
? Input your password: [input is hidden] {yourPassword}

Update manifest file based on the current view setting on kintone app
Finish importing customize views from kintone app

% ./node_modules/.bin/kintone-customize-view-uploader dest/customize-manifest.json
```

or

```
% npm install -g kintone-customize-view-uploader

% kintone-customize-view-uploader init
? Input your app id: {appId}

dest/customize-view-manifest.json file has been created

% kintone-customize-view-uploader import dest/customize-view-manifest.json
? Input your kintone's domain (example.cybozu.com): {yourDomain}
? Input your username: {userLoginName}
? Input your password: [input is hidden] {yourPassword}

Update manifest file based on the current view setting on kintone app
Finish importing customize views from kintone app

% kintone-customize-view-uploader dest/customize-manifest.json
```

If you want to upload the customize views automatically when a file is updated, you can use `--watch` option.

```
% kintone-customize-view-uploader --watch dest/customize-view-manifest.json
```

## Options
```
  Usage
    $ kintone-customize-view-uploader <manifestFile>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --basic-auth-username Basic Authentication username
    --basic-auth-password Basic Authentication password
    --proxy Proxy server
    --watch Watch the changes of customize files and re-run
    --dest-dir -d option for subcommands
                  this option stands for output directory
                  default value is dest/
    --lang Using language (en or ja)
    --guest-space-id Guest space ID for uploading files

  SubCommands
    init   generate customize-view-manifest.json

    import update customize-view-manifest.json

    You can set the values through environment variables
    domain: KINTONE_DOMAIN
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    basic-auth-username: KINTONE_BASIC_AUTH_USERNAME
    basic-auth-password: KINTONE_BASIC_AUTH_PASSWORD
    proxy: HTTPS_PROXY or HTTP_PROXY
```

If you omit the options, you can input the options interactively.
```
% kintone-customize-view-uploader dest/customize-view-manifest.json
? Input your domain: example.cybozu.com
? Input your username: sato
? Input your password: [hidden]
```

## Example
This is an example of `customize-view-manifest.json` .
```json
{
    "app": "1",
    "customizeViews": [
        {
            "name": "view1",
            "file": "dest/html/view1.html"
        },
        {
            "name": "view2",
            "file": "dest/html/view2.html"
        }
    ]
}
```
- `app` : The app id where to upload customize files to (`"APP_ID"`)
- `customizeViews`: The customize views

To upload files, run `kintone-customize-view-uploader <manifestFile>`.
```
% kintone-customize-view-uploader dest/customize-view-manifest.json
? Input your domain: example.cybozu.com
? Input your username: sato
? Input your password: [hidden]

View setting has been updated!
Wait for deploying completed...
Wait for deploying completed...
Wait for deploying completed...
Setting has been deployed!
```

## LICENSE
MIT License

## Note
This tool was created by referring to ["@kintone/customize-uploader"](https://www.npmjs.com/package/@kintone/customize-uploader).
