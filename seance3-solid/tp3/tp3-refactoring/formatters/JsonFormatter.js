export class JsonFormatter {
  format({ month, count, revenueHT, vat, revenueTTC, average, byCategory }) {
    let output;
    output = JSON.stringify({
      month,
      count,
      revenueHT,
      vat,
      revenueTTC,
      average,
      byCategory,
    });
    return output;
  }
}
