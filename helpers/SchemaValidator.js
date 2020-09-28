import Joi from 'joi'
import JoiPhoneNUmber from 'joi-phone-number'

/**
 * Common validators
 *
 * @type {any}
 */
const validator = Joi.extend(JoiPhoneNUmber)

const SchemaValidator = {
  validate: validator.object,
  Name: validator.string().min(3).max(255),
  Email: validator.string().email(),
  Phone: validator.string().phoneNumber(),
  UUID: validator.string().guid({ version: 'uuidv4' }),
  Number: validator.number().integer(),
  Text: validator.string(),
  ZipCode: validator.string().regex(/^\d{5}$|^\d{5}-\d{4}$/),
  Password: validator.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
}

export default SchemaValidator
