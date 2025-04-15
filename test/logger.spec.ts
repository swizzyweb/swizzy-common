const log = require("../src/logger");

describe("Logger tests", () => {
  describe(`Clone`, () => {
    describe(`No overriden properties`, () => {});
    it("Should clone with no overriden properties", () => {
      const logger = new log.BrowserLogger({});
      const cloned = logger.clone({});
      expect(logger != cloned);
    });

    it("Should clone with same deep values", () => {
      const logger = new log.BrowserLogger({});
      const cloned = logger.clone({});
      expect(logger).toEqual(cloned); // Since no props overriden, deep equzl should work
    });
  });
});
