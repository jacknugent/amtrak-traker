import { Station, Train } from "amtrak/dist/types";
import dayjs from "dayjs";

/**
 * Flattens an array of arrays into a single array.
 *
 * @param {T[][]} arrays - An array of arrays to flatten.
 * @returns {T[]} - A flattened array containing the elements of the input arrays.
 */
export function flatten<T>(arrays: T[][]): T[] {
  return ([] as any[]).concat.apply([], arrays);
}

/**
 * Formats the meridiem part (AM/PM) of a Day.js date object.
 *
 * @param {dayjs.Dayjs} date - The Day.js date object to format.
 * @returns {string} - The formatted meridiem part, "a" for AM and "p" for PM.
 */
export const formatMeridiem = (date: dayjs.Dayjs): string => {
  const hour = date.hour();
  return hour < 12 ? "a" : "p";
};

/**
 * Formats a JavaScript Date object into a custom Amtrak time format.
 *
 * @param {Date} date - The JavaScript Date object to format.
 * @returns {string} - The formatted date string, e.g., "4:30p".
 */
export const amtrakCustomFormat = (date: Date) => {
  const dayjsDate = dayjs(date);
  return dayjsDate.format(`h:mm[${formatMeridiem(dayjsDate)}]`);
};

/**
 * Adds the specified delay (in hours and/or minutes) to the given date.
 *
 * @param {string} delayString - The delay in the format "X hours Y minutes".
 * @param {Date} date - The date to which the delay should be added.
 * @returns {Date} - The new date with the delay added.
 */
export const addDelayToDate = (delayString: string, date: Date): Date => {
  const words = delayString.toLowerCase().split(/[, ]+/);
  const newDate = new Date(date);

  for (let i = 0; i < words.length - 1; i++) {
    const value = parseInt(words[i], 10);
    if (!isNaN(value)) {
      if (words[i + 1] === "hours" || words[i + 1] === "hour") {
        newDate.setHours(newDate.getHours() + value);
      } else if (words[i + 1] === "minutes" || words[i + 1] === "minute") {
        newDate.setMinutes(newDate.getMinutes() + value);
      }
    }
  }

  return newDate;
};

/**
 * Returns a human-readable status string based on the input parameters.
 *
 * @param {string} status - The current status of the train (e.g., "Enroute").
 * @param {string} comment - Additional information about the train's status (e.g., "5 Minutes Late").
 * @param {string} expectedTime - The expected arrival/departure time of the train.
 * @returns {string} - A human-readable status string for display.
 */
export const getDisplayStatus = (
  status: string,
  comment: string,
  expectedTime: string
): string => {
  if (status === "Station") {
    return "At Station";
  }

  if (status !== "Enroute") {
    return status;
  }

  if (comment === "NaN Minutes Early") {
    return "Unknown";
  }

  if (comment === "0 Minutes Early") {
    return "On time";
  }

  if (comment.includes("Late")) {
    return `Now ${amtrakCustomFormat(
      addDelayToDate(comment, new Date(expectedTime))
    )}`;
  }
  return comment;
};

/**
 * Filters and sorts an array of trains based on their scheduled departure or arrival time.
 *
 * @param stationTrains The array of trains to filter and sort.
 * @param type Indicates whether to filter based on scheduled departure or arrival time.
 * @param lookbackDuration Time duration to look back from the current time, in hours.
 * @param lookaheadDuration Time duration to look ahead from the current time, in hours.
 * @param maxTrainsToShow Maximum number of trains to show in the output array.
 * @returns The filtered and sorted array of trains.
 */
export function filterSortTrainsByTimeRange(
  stationTrains: Array<Train & { selectedStation: Station }>,
  type: "Departure" | "Arrival",
  lookbackDuration: number,
  lookaheadDuration: number,
  maxTrainsToShow: number
): Array<Train & { selectedStation: Station }> {
  const timeKey = type === "Departure" ? "schDep" : "schArr";
  const now = new Date();
  const startTime = new Date(now.getTime() - lookbackDuration * 3600000);
  const endTime = new Date(now.getTime() + lookaheadDuration * 3600000);

  return stationTrains
    .filter(({ selectedStation }) => {
      const scheduledTime = new Date(selectedStation[timeKey]);
      return scheduledTime > startTime && scheduledTime < endTime;
    })
    .sort(
      (a, b) =>
        new Date(a.selectedStation[timeKey]).getTime() -
        new Date(b.selectedStation[timeKey]).getTime()
    )
    .slice(0, maxTrainsToShow);
}
