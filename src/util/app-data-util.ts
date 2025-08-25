import path from "path";
import fs from "fs";
import { ILogger } from "@swizzyweb/swizzy-common";

/**
 * Initializes the app data root of web service,
 * creating the directory for web service directory space.
 */
export function getAppDataPathFromPropsAndInitialize(
  props: GetAppDataPathFromPropsProps,
) {
  const appDataPath = getAppDataPathFromProps(props);
  fs.mkdirSync(appDataPath, { recursive: true });
  return appDataPath;
}

export interface GetAppDataPathFromPropsProps {
  packageName: string;
  appDataRoot: string;
  logger: ILogger<any>;
}

export function getAppDataPathFromProps(props: GetAppDataPathFromPropsProps) {
  const { packageName, appDataRoot, logger } = props;
  logger?.info(
    `getAppDataPathFromProps packageName: ${packageName} appDataRoot: ${appDataRoot}`,
  );
  if (appDataRoot) {
    if (appDataRoot.startsWith("/")) {
      logger?.info(`returning for '/' case`);
      return path.join(appDataRoot, "/appdata/", packageName);
    }

    return path.join(process.cwd(), appDataRoot, "appdata/", packageName);
  }

  return path.join(process.cwd(), "appdata/", packageName);
}
