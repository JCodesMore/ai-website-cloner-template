/**
 * Dropdown options shared by the site's two enquiry forms — `BorrowingPowerForm` on `/` and the
 * `ConsultDialog` modal on `/calculators`.
 *
 * Lifted out of `BorrowingPowerForm` so the two forms cannot drift apart. Only the option *data*
 * is shared: the two forms are styled deliberately differently, so their class constants are not.
 *
 * Every situation `<option>` in the source markup carries `value="Another option"` — an unedited
 * Webflow default. The label doubles as the value here instead.
 */

export const SITUATION_OPTIONS = [
  "First Home Buyer",
  "Investor",
  "Refinance",
  "Upgrading",
  "Commercial Lending",
  "Asset Finance",
] as const;

export const INCOME_OPTIONS = ["100K-150K", "150K-200K", "200K+"] as const;
