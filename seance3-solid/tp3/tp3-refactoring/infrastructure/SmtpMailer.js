export class SmtpMailer {
  constructor(config) {
    this.config = config;
    this.outbox = [];
  }

  send({ to, subject, body }) {
    this.outbox.push({
      via: `${this.config.host}:${this.config.port}`,
      to,
      subject,
      body,
    });
  }
}
