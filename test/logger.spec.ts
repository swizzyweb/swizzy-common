import * as log from "../dist/logger.js";
import test from "node:test";

import expect from "expect";

test("Logger tests", () => {
  test(`Clone`, () => {
    test(`No overriden properties`, () => {});
    test.it("Should clone with no overriden properties", () => {
      const logger = new log.BrowserLogger({});
      const cloned = logger.clone({});
      expect(logger != cloned);
    });

    test.it("Should clone with same deep values", () => {
      const logger = new log.BrowserLogger({});
      const cloned = logger.clone({});
      expect(logger).toEqual(cloned); // Since no props overriden, deep equzl should work
    });

    test.it(
      "Should return empty loggerProps when browserlogger initialized with null props",
      () => {
        const logger = new log.BrowserLogger();
        expect(logger.getLoggerProps()).toEqual({});
      },
    );
  });
});
