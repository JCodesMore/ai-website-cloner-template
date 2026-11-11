// Kept separate from enquiries.ts so client components can import it without the database.
export const ENQUIRY_STATUSES = ["new", "contacted", "booked", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
