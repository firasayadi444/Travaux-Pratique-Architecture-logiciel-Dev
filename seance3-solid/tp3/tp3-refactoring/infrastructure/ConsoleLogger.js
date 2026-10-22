export class ConsoleLogger {
  constructor() {
    this.history = [];
  }

  info(message) {
    const line = `[${new Date().toISOString()}] ${message}`;
    console.log(line);
    this.history.push(line);
  }
}
