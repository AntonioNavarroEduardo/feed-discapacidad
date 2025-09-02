export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export function logInfo(message: string): void {
  console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
}

export function logError(message: string, error?: Error): void {
  console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
}

export function logWarn(message: string): void {
  console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
}

export function logDebug(message: string): void {
  console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
}
