import path from "node:path";
import fs from "node:fs";
import { ILogger } from "@swizzyweb/swizzy-common";

/**
 * Resolves the app data directory for a web service and creates it if it does not exist.
 * @param props package name, app data root, and logger
 * @returns the absolute path to the created app data directory
 */
export function getAppDataPathFromPropsAndInitialize(
  props: GetAppDataPathFromPropsProps,
) {
  const appDataPath = getAppDataPathFromProps(props);
  fs.mkdirSync(appDataPath, { recursive: true });
  return appDataPath;
}

/** Props for resolving the app data directory path. */
export interface GetAppDataPathFromPropsProps {
  /** The npm package name used as a subdirectory within the app data root. */
  packageName: string;
  /** Root directory for all app data. Absolute paths are used as-is; relative paths resolve from `cwd`. */
  appDataRoot: string;
  /** Logger instance. */
  logger: ILogger<any>;
}

/**
 * Resolves the app data directory path for a web service without creating it.
 * @param props package name, app data root, and logger
 * @returns the absolute path to the app data directory
 */
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
