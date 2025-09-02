// Silenciar console.error durante los tests para no contaminar la salida
const originalError = console.error;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('Error fetching feed:') || args[0]?.includes?.('boom')) {
      // Silenciar errores esperados en los tests
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
