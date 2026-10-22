export class MarkdownFormatter {
  format({ month, count, average, byCategory, revenueHT, vat, revenueTTC }) {
    let output = `# Ventes ${month}\n\n${count} commande(s), panier moyen ${average} €\n\n`;
    output += '| Catégorie | Montant HT |\n| --- | --- |\n';
    for (const category of Object.keys(byCategory).sort()) {
      output += `| ${category} | ${byCategory[category]} € |\n`;
    }
    output += `\nTotal HT : ${revenueHT} €\nTVA : ${vat} €\nTotal TTC : ${revenueTTC} €\n`;
    return output;
  }
}
