// Where the "Buy Fritz a beer" button sends donations.
// This address is fixed on purpose: it cannot be changed from the panel, and on GitHub
// changes to this file need the owner's review (see .github/CODEOWNERS).
export const DONATE_EMAIL = 'fritz.range@gmail.com';
export const DONATE_LINK = 'https://www.paypal.com/donate/?business=' + encodeURIComponent(DONATE_EMAIL) + '&no_recurring=1&currency_code=USD';
