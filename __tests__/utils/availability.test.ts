import { describe, it, expect } from "vitest";
import { calculateAvailableSlots } from "@/lib/utils/availability";

// Monday = 1 in JS Date.getDay()
// 2026-04-06 is a Monday
const MONDAY = "2026-04-06";
// 2026-04-05 is a Sunday
const SUNDAY = "2026-04-05";

const weekSchedule = [
  { day_of_week: 0, open_time: null, close_time: null, is_closed: true },   // Sunday
  { day_of_week: 1, open_time: "09:00", close_time: "20:00", is_closed: false }, // Monday
  { day_of_week: 2, open_time: "09:00", close_time: "20:00", is_closed: false },
  { day_of_week: 3, open_time: "09:00", close_time: "20:00", is_closed: false },
  { day_of_week: 4, open_time: "09:00", close_time: "20:00", is_closed: false },
  { day_of_week: 5, open_time: "09:00", close_time: "20:00", is_closed: false },
  { day_of_week: 6, open_time: "10:00", close_time: "14:00", is_closed: false },
];

describe("calculateAvailableSlots", () => {
  it("Monday 09-20, 60min service, no reservations: returns correct slots", () => {
    const slots = calculateAvailableSlots(
      MONDAY,
      60,
      weekSchedule,
      [],
      []
    );

    // From 09:00 to 19:00 in 30min intervals where 60min fits before 20:00
    // 09:00, 09:30, 10:00, ..., 19:00 = slots at m where m+60 <= 1200 (20:00)
    // m from 540 to 1140 step 30 => (1140-540)/30 + 1 = 21 slots
    expect(slots.length).toBe(21);
    expect(slots[0]).toBe("09:00");
    expect(slots[slots.length - 1]).toBe("19:00");
  });

  it("Sunday closed: returns 0 slots", () => {
    const slots = calculateAvailableSlots(
      SUNDAY,
      60,
      weekSchedule,
      [],
      []
    );

    expect(slots).toEqual([]);
  });

  it("with existing reservation at 10:00-11:00, those slots are blocked", () => {
    const reservations = [{ start_time: "10:00", end_time: "11:00" }];

    const slots = calculateAvailableSlots(
      MONDAY,
      60,
      weekSchedule,
      [],
      reservations
    );

    // Blocked: any slot where [m, m+60) overlaps [600, 660)
    // That means m < 660 AND m+60 > 600 => m < 660 AND m > 540
    // So m in {570 (09:30), 600 (10:00)} are blocked (since 570+60=630 > 600 and 570 < 660)
    // Wait: 540 (09:00) => 540+60=600, 600 > 600? No. So 09:00 is NOT blocked.
    // 570 (09:30) => 570+60=630, 630>600 YES and 570<660 YES => blocked
    // 600 (10:00) => 600+60=660, 660>600 YES and 600<660 YES => blocked
    // 630 (10:30) => 630+60=690, 690>600 YES and 630<660 YES => blocked
    // So 3 slots blocked, 21-3 = 18
    expect(slots).not.toContain("09:30");
    expect(slots).not.toContain("10:00");
    expect(slots).not.toContain("10:30");
    expect(slots).toContain("09:00");
    expect(slots).toContain("11:00");
    expect(slots.length).toBe(18);
  });

  it("schedule exception (holiday) returns 0 slots", () => {
    const exceptions = [
      { date: MONDAY, is_closed: true, open_time: null, close_time: null },
    ];

    const slots = calculateAvailableSlots(
      MONDAY,
      60,
      weekSchedule,
      exceptions,
      []
    );

    expect(slots).toEqual([]);
  });

  it("schedule exception with custom hours overrides regular schedule", () => {
    const exceptions = [
      { date: MONDAY, is_closed: false, open_time: "10:00", close_time: "12:00" },
    ];

    const slots = calculateAvailableSlots(
      MONDAY,
      60,
      weekSchedule,
      exceptions,
      []
    );

    // 10:00 to 11:00 in 30min steps where 60min fits before 12:00
    // m: 600, 630 (630+60=690 <= 720) => 10:00, 10:30, 11:00
    expect(slots).toEqual(["10:00", "10:30", "11:00"]);
  });
});
