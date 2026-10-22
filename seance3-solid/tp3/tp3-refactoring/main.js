import { pathToFileURL } from 'node:url';
import { ReportService } from './application/ReportService.js';
import { ProReportPolicy, FreeReportPolicy } from './domain/ReportPolicy.js';
import { CsvFormatter } from './formatters/CsvFormatter.js';
import { HtmlFormatter } from './formatters/HtmlFormatter.js';
import { JsonFormatter } from './formatters/JsonFormatter.js';
import { FormatterRegistry } from './formatters/FormatterRegistry.js';
import { JsonFileOrderRepository } from './infrastructure/JsonFileOrderRepository.js';
import { SmtpMailer } from './infrastructure/SmtpMailer.js';
import { ConsoleLogger } from './infrastructure/ConsoleLogger.js';

// Composition root : création et assemblage des dépendances.
export function buildReportService({ plan = 'pro', env = process.env } = {}) {
  const orders = new JsonFileOrderRepository(new URL('./orders.json', import.meta.url));
  const formatters = new FormatterRegistry();
  formatters.register('csv', new CsvFormatter());
  formatters.register('html', new HtmlFormatter());
  formatters.register('json', new JsonFormatter());
  const mailer = new SmtpMailer({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
  });
  const logger = new ConsoleLogger();
  const policy = plan === 'free' ? new FreeReportPolicy() : new ProReportPolicy();
  const service = new ReportService({ orders, formatters, mailer, logger, policy });
  return { service, formatters, mailer, logger };
}

export function runDemo() {
  const { service, mailer } = buildReportService();
  console.log(service.generate('2026-09', 'csv'));
  console.log(service.generate('2026-09', 'html', 'direction@shoplite.fr'));
  console.log('E-mails envoyés :', mailer.outbox.length);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runDemo();
}
