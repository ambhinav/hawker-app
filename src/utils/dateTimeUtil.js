/** Util file for formatting, parsing of timestamps using moment JS */
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Singapore")

moment.updateLocale('en', {
  week: {
    dow: 1, // First day of week is Monday
    doy: 4  // First week of year must contain 4 Jan (7 + 1 - 4)
  }
})

const DAY = "dddd"
const TIME = "HH:mm"
const DATE_MONTH = "DDMM";
const DATE_MONTH_YEAR = "DD-MMMM-YYYY"
const DATE_MONTH_YEAR_ALT = "DD-MM-YY"
const DATE_PICKER_FORMAT = 'MMMM Do YYYY'
const DATE_PICKER_DEFAULT = "YYYY-MM-DD"

// formatting
const formatDate = v => moment(v).format(DATE_MONTH_YEAR)

const formatDateShort = v => moment(v).format(DATE_MONTH_YEAR_ALT)

const formatDayAndDate = v => moment(v).format(`${DAY}, ${DATE_MONTH_YEAR}`)

const formatTimeAndDate = v => moment(v).format(`${TIME} ${DATE_MONTH_YEAR_ALT}`)

// for date/time pickers
const formatDatePicker = v => moment(v).format(DATE_PICKER_FORMAT)

const getTimeStampFromDatePicker = v => moment(v, DATE_PICKER_DEFAULT).valueOf()

const getTimeStamp = () => moment().valueOf()

const convertTimeStampToISO = v => moment(v).toISOString().substr(0, 10)

const getCurrentDateAndMonth = () => moment().format(DATE_MONTH);

/**
 * Checks if the given timestamp falls within the current week
 * @param {*} v  unix timestamp in ms
 * @returns true if v falls within the week
 */
const isWithinTheWeek = v => moment(v).isBetween(moment().startOf("week"), moment().endOf("week"))

const isWithinTheMonth = v => moment(v).isBetween(moment().startOf("month"), moment().endOf("month"))

const isSameDay = v => { 
  var day = v.find(day => day === moment().format(DAY));
  return !!day;
}

/**
 * Checks if the current time is before the available delivery timings for the shops
 * @param {Array} v List of delivery timings shop is available for 
 * @returns the filtered list
 */
const getValidTimings = timing => {
  return moment(timing, TIME).isAfter(moment().format(TIME));
};

/**
 * Checks if two moments are equal
 * Note: v1 and v2 have to both be a unix timestamp in milliseconds
 * @param {Moment} v1 Unix timestamp in ms
 * @param {Moment} v2 Other Unix timestamp in ms
 */
const isEqual = (v1, v2) => moment(v1).isSame(v2);

/**
 * Checks if current time not more than 10 mins after order by timing.
 * @param {Time} timing order by time for a delivery slot
const isBefore = timing => {
  return moment(new Date()).isBefore(moment(timing, "HH:mm").add(10, "minutes"));
};
 */

 /**
  * Checks if current time is at least 85 mins (10 min buffer) before the delivery slot
  * @param {String} timing delivery slot in hh A format (e.g. 10 AM)
  */
 const isBefore = timing => {
	return moment().add(85, "minutes").isBefore(moment(timing, "hh A"));
 }

const isClosed = () => moment(new Date()).isAfter(moment("17:00", "HH:mm"));

export {
  formatDate,
  formatDateShort,
  formatDayAndDate,
  getTimeStampFromDatePicker,
  convertTimeStampToISO,
  formatTimeAndDate,
  formatDatePicker,
  isWithinTheMonth,
  isWithinTheWeek,
  getTimeStamp,
  isEqual,
  isSameDay,
  getValidTimings,
  getCurrentDateAndMonth,
  isClosed,
  isBefore
}