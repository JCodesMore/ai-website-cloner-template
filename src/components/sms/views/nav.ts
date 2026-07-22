/** /sms 壳内的视图键（?view= 深链用同一组值；buy 是默认视图不带参数）。 */
export type SmsView = "buy" | "activation" | "orders";

export const SMS_VIEWS: SmsView[] = ["buy", "activation", "orders"];
