import { deepMerge } from "./merge-util";

export type NewLoggerClass<PROPS> = new (props: PROPS) => ILogger<PROPS>;

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
  clone(props: any): ILogger<PROPS>;

  /**
   *
   */
  getLoggerProps(): PROPS;

  /**
   *
   * */
}

export abstract class BaseLogger<PROPS> implements ILogger<PROPS> {
  protected loggerProps: PROPS;
  clazz: NewLoggerClass<PROPS>;
  constructor(props: PROPS) {
    console.log(`loggerProps: ${props}`);
    this.loggerProps = props;
    this.clazz = Object.getPrototypeOf(this);
  }

  abstract log(val: string, ...meta: any[]): void;
  abstract info(val: string, ...meta: any[]): void;
  abstract error(val: string, ...meta: any[]): void;
  abstract warn(val: string, ...meta: any[]): void;
  abstract debug(val: string, ...meta: any[]): void;

  getLoggerProps(): PROPS {
    return this.loggerProps;
  }

  clone(overrides: any): ILogger<PROPS> {
    const newProps = deepMerge(this.getLoggerProps() as any, overrides);
    // @ts-ignore
    return new this.constructor(newProps);
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

function deepCopy<OUT_MODEL>(val: OUT_MODEL): OUT_MODEL {
  return JSON.parse(JSON.stringify(val));
}
