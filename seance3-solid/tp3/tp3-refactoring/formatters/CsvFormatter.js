export class CsvFormatter {
  format({ month, count, revenueHT, vat, revenueTTC, average, byCategory }) {
    let output;
    output = 'categorie;montant_ht\n';
    for (const c of Object.keys(byCategory).sort())
      output += `${c};${byCategory[c]}\n`;
    output += `TOTAL HT;${revenueHT}\nTVA;${vat}\nTOTAL TTC;${revenueTTC}\n`;
    return output;
  }
}
