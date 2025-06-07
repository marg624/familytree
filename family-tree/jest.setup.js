// Jest setup file for family tree tests

// Increase timeout for API calls
jest.setTimeout(30000);

// Mock console methods for cleaner test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // Suppress console.log during tests unless there's an error
  console.log = (...args) => {
    if (process.env.VERBOSE_TESTS) {
      originalConsoleLog(...args);
    }
  };
});

afterAll(() => {
  // Restore console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Add custom matchers if needed
expect.extend({
  toBeValidRelationship(received) {
    const validRelationships = [
      'self', 'spouse', 'parent', 'child', 'sibling',
      'grandparent', 'grandchild', 'great-grandparent', 'great-grandchild',
      'aunt/uncle', 'niece/nephew', 'cousin', '2nd cousin', '3rd cousin',
      'cousin 1x removed', '2nd cousin 1x removed', '3rd cousin 1x removed',
      'not related', 'unknown', 'distant relative'
    ];
    
    const pass = validRelationships.includes(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid relationship`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid relationship. Valid relationships: ${validRelationships.join(', ')}`,
        pass: false,
      };
    }
  },
});