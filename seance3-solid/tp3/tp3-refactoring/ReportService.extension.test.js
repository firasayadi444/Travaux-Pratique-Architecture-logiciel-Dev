import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReportService } from './main.js';
import { MarkdownFormatter } from './formatters/MarkdownFormatter.js';

test('un format Markdown s’ajoute sans modifier ReportService', () => {
  const { service, formatters } = buildReportService();
  formatters.register('md', new MarkdownFormatter());
  assert.equal(service.generate('2026-09', 'md'),
    '# Ventes 2026-09\n\n3 commande(s), panier moyen 183.67 €\n\n' +
    '| Catégorie | Montant HT |\n| --- | --- |\n' +
    '| informatique | 416 € |\n| livres | 135 € |\n' +
    '\nTotal HT : 551 €\nTVA : 110.2 €\nTotal TTC : 661.2 €\n');
});
