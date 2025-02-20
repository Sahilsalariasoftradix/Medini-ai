export const TScheduleTypes: Array<"phone" | "in_person" | "break"> = [
  "phone",
  "in_person",
  "break",
];

export type TScheduleKey =
| `phone_${"start" | "end"}_time`
| `in_person_${"start" | "end"}_time`
| `break_${"start" | "end"}_time`;