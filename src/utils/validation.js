/** Form validation */
const required = v => !!v || 'This is a required field'

const email = v => /.+@.+\..+/.test(v) || 'E-mail must be valid'

/** General rule helpers */
const isInt = v => Math.floor(v) == v

const isNumber = v => !isNaN(v)

export default {
  required,
  email,
  isInt,
  isNumber
}