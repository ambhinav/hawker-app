/** Form validation */
const required = v => !!v || 'This is a required field'

const email = v => /.+@.+\..+/.test(v) || 'E-mail must be valid'

/** General rule helpers */
const isInt = v => Math.floor(v) == v || "Please enter numbers only"

const isNumber = v => !isNaN(v) || "Please enter numbers only"

const isPostalCode = v => String(v).length == 6 || "Please enter a valid postal code"

export default {
  required,
  email,
  isInt,
  isNumber,
  isPostalCode
}