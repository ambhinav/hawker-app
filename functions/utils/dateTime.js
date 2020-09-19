const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Singapore")

const DAY_MONTH = "DDMM";
const TWELVE_HOUR = "h:mm a";
const TWENTY_FOUR_HOUR = "HH:mm";

const formatCreateDate = v => moment(v).format(DAY_MONTH);

const getToday = () => moment();

const convertToTwelveHourFormat = (v) => moment(v, TWENTY_FOUR_HOUR).format(TWELVE_HOUR);

module.exports = {
  formatCreateDate,
  getToday,
  convertToTwelveHourFormat
}