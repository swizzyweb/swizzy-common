export interface ILogger<PROPS> {
  /** Default log method
   */
  log(val: string, ...meta: any[]): void;
  /**
   * Log as info.
   */
  info(val: string, ...meta: any[]): void;
  /**
   * Log as error
   */
  error(val: string, ...meta: any[]): void;
  /**
   * Log as warn.
   */
  warn(val: string, ...meta: any[]): void;
  /**
   * Log as debug.
   */
  debug(val: string, ...meta: any[]): void;
  /**
   * Clone this logger with optional overrides.
   */
  clone(props: PROPS): ILogger<PROPS>;

  /**
   *
   */
  getLoggerProps(): PROPS;
}

export abstract class BaseLogger<PROPS> implements ILogger<PROPS> {
  protected loggerProps: PROPS;
  constructor(props: PROPS) {
    this.loggerProps = props;
  }

  abstract log(val: string, ...meta: any[]): void;
  abstract info(val: string, ...meta: any[]): void;
  abstract error(val: string, ...meta: any[]): void;
  abstract warn(val: string, ...meta: any[]): void;
  abstract debug(val: string, ...meta: any[]): void;

  getLoggerProps(): PROPS {
    return { ...this.loggerProps };
  }

  clone(props: PROPS): ILogger<PROPS> {
    // @ts-ignore
    return new this.constructor(props);
  }
}

export class BrowserLogger extends BaseLogger<any> {
  constructor(props?: any) {
    super(props);
  }
  log(val: string, ...meta: any[]): void {
    console.log(val, ...meta);
  }
  info(val: string, ...meta: any[]): void {
    console.info(val, ...meta);
  }
  error(val: string, ...meta: any[]): void {
    console.error(val, ...meta);
  }
  warn(val: string, ...meta: any[]): void {
    console.warn(val, ...meta);
  }
  debug(val: string, ...meta: any[]): void {
    console.debug(val, ...meta);
  }
}
