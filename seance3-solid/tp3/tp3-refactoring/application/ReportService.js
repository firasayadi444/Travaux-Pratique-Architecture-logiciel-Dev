import { computeStats } from '../domain/salesStats.js';
import { validateEmailAddress } from '../domain/EmailAddress.js';

export class ReportService {
  constructor({ orders, formatters, mailer, logger, policy }) {
    this.orders = orders;
    this.formatters = formatters;
    this.mailer = mailer;
    this.logger = logger;
    this.policy = policy;
  }

  generate(month, format, recipient) {
    this.policy.check(format, recipient);
    const stats = computeStats(this.orders.all(), month);
    const output = this.formatters.get(format).format(stats);
    this.logger.info(`rapport ${month} (${format}) : ${stats.count} commande(s)`);
    if (recipient) {
      this.mailer.send({
        to: validateEmailAddress(recipient),
        subject: `Rapport des ventes ${month}`,
        body: output,
      });
    }
    return output;
  }
}
