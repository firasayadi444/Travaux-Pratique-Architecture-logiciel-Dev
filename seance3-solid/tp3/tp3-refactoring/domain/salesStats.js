// Calcul pur, sans dependance technique.
export function computeStats(orders, month) {
  orders = orders.filter(o => o.date.startsWith(month));
  let revenueHT = 0;
  let count = 0;
  const byCategory = {};
  for (const o of orders) {
    if (o.status === 'CANCELLED') continue;
    count++;
    for (const l of o.lines) {
      const amount = l.qty * l.unitPrice;
      revenueHT += amount;
      byCategory[l.category] = (byCategory[l.category] || 0) + amount;
    }
  }
  const vat = Math.round(revenueHT * 0.2 * 100) / 100;
  const revenueTTC = revenueHT + vat;
  const average = count === 0 ? 0 : Math.round((revenueHT / count) * 100) / 100;

  return { month, count, revenueHT, vat, revenueTTC, average, byCategory };
}
