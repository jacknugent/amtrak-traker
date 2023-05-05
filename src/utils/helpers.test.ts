import { addDelayToDate } from "./helpers";

describe("addDelayToDate", () => {
  it("should return the same date when no delay is present", () => {
    const date = new Date("2023-01-01T12:00:00");
    const delayString = "No delay";
    const result = addDelayToDate(delayString, date);
    expect(result).toEqual(date);
  });

  it("should add the specified hours to the date", () => {
    const date = new Date("2023-01-01T12:00:00");
    const delayString = "2 hours late";
    const result = addDelayToDate(delayString, date);
    expect(result).toEqual(new Date("2023-01-01T14:00:00"));
  });

  it("should add the specified minutes to the date", () => {
    const date = new Date("2023-01-01T12:00:00");
    const delayString = "30 minutes late";
    const result = addDelayToDate(delayString, date);
    expect(result).toEqual(new Date("2023-01-01T12:30:00"));
  });

  it("should add the specified hours and minutes to the date", () => {
    const date = new Date("2023-01-01T12:00:00");
    const delayString = "1 hour 15 minutes late";
    const result = addDelayToDate(delayString, date);
    expect(result).toEqual(new Date("2023-01-01T13:15:00"));
  });

  it("should add the specified hours and minutes to Amtrak's usual syntax", () => {
    const date = new Date("2023-01-01T12:00:00");
    const delayString = "1 Hours, 15 Minutes Late";
    const result = addDelayToDate(delayString, date);
    expect(result).toEqual(new Date("2023-01-01T13:15:00"));
  });

  it("should handle uppercase and lowercase strings", () => {
    const date = new Date("2023-01-01T12:00:00");
    const delayString = "1 HOUR 15 MINUTES LATE";
    const result = addDelayToDate(delayString, date);
    expect(result).toEqual(new Date("2023-01-01T13:15:00"));
  });

  it("should return the same date when delay string is not formatted correctly", () => {
    const date = new Date("2023-01-01T12:00:00");
    const delayString = "2 hrs 30 mins late";
    const result = addDelayToDate(delayString, date);
    expect(result).toEqual(date);
  });
});
