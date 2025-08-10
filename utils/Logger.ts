// utils/Logger.ts
export class Logger {
  static info(message: string) {
    console.log(`[INFO] ${message}`);
    // Optionally, write to a file or external system here
  }
  static error(message: string) {
    console.error(`[ERROR] ${message}`);
    // Optionally, write to a file or external system here
  }
  // Add more levels as needed
}
