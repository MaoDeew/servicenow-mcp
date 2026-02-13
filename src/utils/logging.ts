type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const logger = {
  debug(message: string, data?: unknown): void {
    console.debug(`[DEBUG] ${message}`, data || '');
  },
  info(message: string, data?: unknown): void {
    console.info(`[INFO] ${message}`, data || '');
  },
  warn(message: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data || '');
  },
  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error || '');
  },
};
