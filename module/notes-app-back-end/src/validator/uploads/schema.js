const Joi = require('joi');
 
const ImageHeadersSchema = Joi.object({
  //? object content type with valid MIME type below
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();
 
module.exports = { ImageHeadersSchema };