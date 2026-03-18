/**
 * @module Loggers
 */
import { BaseLogger, BrowserLogger, ILogger } from "./logger.js";
import { createLogger, format, info, level, Logger, transports } from "winston";
import * as path from "path";
import "winston-daily-rotate-file";
import { mkdirSync } from "fs";

export interface LogLabelDisplayConfiguration {
  /**
   * Whether to display hostname.
   * Default: true
   */
  hostNameEnabled?: boolean;

  /**
   * Whether to display port.
   * Default: true
   */
  portEnabled?: boolean;

  /**
   * Whether to display instanceId.
   * Default: true
   */
  instanceIdEnabled?: boolean;

  /**
   * Whether to display appName.
   * Default: true
   */
  appNameEnabled?: boolean;

  /**
   * Whether to display pid.
   * Default: true
   */
  pidEnabled?: boolean;

  /**
   * Whether to display ownerName.
   * Default: true
   */
  ownerNameEnabled?: boolean;

  /**
   * Do not display label.
   * Default: false
   */
  none?: boolean;
}

const DefaultLabelConfiguration: LogLabelDisplayConfiguration = {
  hostNameEnabled: true,
  portEnabled: true,
  instanceIdEnabled: true,
  appNameEnabled: true,
  pidEnabled: true,
  ownerNameEnabled: true,
  none: false,
};

/**
 * Constructor props for SwizzyWinstonLogger.
 */
export interface ISwizzyLoggerProps {
  hostName: string;
  appName: string;
  instanceId?: string;
  logDir?: string;
  appDataRoot?: string; //TODO: deprecate
  port: number;
  pid?: number;
  logLevel?: string;
  ownerName?: string;
  logFileName?: string;
  noLogFile?: boolean;
  labelConfiguration?: LogLabelDisplayConfiguration;
}

/**
 * Winston based logger.
 */
export class SwizzyWinstonLogger extends BaseLogger<ISwizzyLoggerProps> {
  /**
   * Winston logger.
   **/
  logger: Logger;
  constructor(props: ISwizzyLoggerProps) {
    super(props);
    const {
      appName,
      instanceId,
      appDataRoot,
      port,
      hostName,
      logLevel,
      pid,
      ownerName,
      logFileName,
      logDir,
      noLogFile,
      labelConfiguration,
    } = props;

    let labelFields = this.buildLabel(
      labelConfiguration,
      hostName,
      port,
      instanceId,
      appName,
      pid,
      ownerName,
    );

    const label =
      labelFields && labelFields.length > 0 ? labelFields.join(":") : undefined;

    let resultMessage = "";

    const consoleLogFormat = format.combine(
      format.timestamp(),
      format.label({ label, message: label ? true : false }),
      format.colorize({
        all: true,
      }),
    );
    const loggerTransports: any[] = [
      new transports.Console({
        format: consoleLogFormat,
      }),
    ];
    resultMessage += "Setup console logger\n";
    const loggerFormat = format.combine(
      format.timestamp(),
      format.label({ label, message: label ? true : false }),
      format.json(),
    );

    // Checkout this sorcery!
    let loggerDir = noLogFile
      ? undefined
      : logDir
        ? logDir
        : appDataRoot
          ? `${appDataRoot}`
          : undefined;

    if (loggerDir) {
      const dirname = path.join(loggerDir, "/logs");
      mkdirSync(dirname, { recursive: true });

      // TODO: this seems to be async, so the logger is not always initialized
      // by the time this returns. Or something else in here is async, maybe
      // the file transport.
      loggerTransports.push(
        new transports.DailyRotateFile({
          format: loggerFormat,
          dirname,
          filename: logFileName ?? `${appName}-${hostName}-%DATE%.log`,
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          frequency: "24h",
          utc: true,
        }),
      );

      resultMessage += `loggerDir set, setting log directory to ${dirname}`;
    }

    this.logger = createLogger({
      format: loggerFormat,
      transports: loggerTransports,
      level: logLevel ?? "info",
    });
  }
  log(val: string, ...meta: any[]): void {
    this.info(val, ...meta);
  }
  info(val: string, ...meta: any[]): void {
    this.logger.info(val, ...meta);
  }
  error(val: string, ...meta: any[]): void {
    this.logger.error(val, ...meta);
  }
  warn(val: string, ...meta: any[]): void {
    this.logger.warn(val, ...meta);
  }
  debug(val: string, ...meta: any[]): void {
    this.logger.debug(val, ...meta);
  }

  private buildLabel(
    labelConfiguration: LogLabelDisplayConfiguration | undefined,
    hostName: string,
    port: number,
    instanceId: string | undefined,
    appName: string,
    pid: number | undefined,
    ownerName: string | undefined,
  ) {
    let labelFields = undefined;

    if (!labelConfiguration?.none) {
      labelFields = [];

      const configuration = {
        ...DefaultLabelConfiguration,
        ...labelConfiguration,
      };

      const {
        hostNameEnabled,
        portEnabled,
        instanceIdEnabled,
        appNameEnabled,
        pidEnabled,
        ownerNameEnabled,
      } = configuration;

      if (hostNameEnabled) {
        labelFields.push(hostName);
      }

      if (portEnabled) {
        labelFields.push(port);
      }
      if (instanceIdEnabled) {
        labelFields.push(instanceId);
      }

      if (appNameEnabled) {
        labelFields.push(appName);
      }

      if (pidEnabled) {
        labelFields.push(pid);
      }

      if (ownerNameEnabled) {
        labelFields.push(ownerName);
      }
    }
    return labelFields;
  }
}

function appendOrNothing(val?: any) {
  return val && val !== "undefined" ? `${val}:` : ":";
}
