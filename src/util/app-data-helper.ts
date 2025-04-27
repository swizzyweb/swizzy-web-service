import path from "path";
import fs from "fs";
import { IWebServiceProps } from "../web-service-props";

export function getAppDataPathFromPropsAndInitialize(
  props: IWebServiceProps<any>,
) {
  const appDataPath = getAppDataPathFromProps(props);
  fs.mkdirSync(appDataPath, { recursive: true });
  return appDataPath;
}

export function getAppDataPathFromProps(props: IWebServiceProps<any>) {
  const { packageName, appDataRoot, logger } = props;
  logger?.info(
    `getAppDataPathFromProps packageName: ${packageName} appDataRoot: ${appDataRoot}`,
  );
  //  const appDataRoot: string | undefined = serviceArgs.appDataRoot;
  if (appDataRoot) {
    if (appDataRoot.startsWith("/")) {
      logger?.info(`returning for '/' case`);
      return path.join(appDataRoot, "/appdata/", packageName);
    }

    return path.join(process.cwd(), appDataRoot, "appdata/", packageName);
    /*return path.join(
      __dirname,
      "../../",
      appDataRoot,
      "/appdata/",
      packageName,
    );*/
  }

  /*return path.join(
    path.dirname(require.main?.filename!),
    "../appdata/",
    packageName,
  );*/
  return path.join(process.cwd(), "appdata/", packageName);
}
