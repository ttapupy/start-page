global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

// Mock fetch globally
global.fetch = jest.fn();

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
