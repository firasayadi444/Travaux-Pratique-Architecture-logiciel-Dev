export function validateEmailAddress(recipient) {
  if (!recipient.includes('@')) throw new Error(`Adresse invalide : ${recipient}`);
  return recipient;
}
