export class ProReportPolicy {
  check() {}
}

// Restriction explicite par composition, sans héritage du service.
export class FreeReportPolicy {
  check(format, recipient) {
    if (format !== 'csv') throw new Error('Format réservé aux comptes Pro');
    if (recipient) throw new Error('Envoi par e-mail réservé aux comptes Pro');
  }
}
