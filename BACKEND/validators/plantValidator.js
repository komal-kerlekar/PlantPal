const Joi = require("joi");

const createPlantSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": "Plant name is required",
    "string.min": "Plant name must be at least 2 characters"
  }),
  location: Joi.string().optional()
});

const updatePlantSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  location: Joi.string().optional()
});

module.exports = {
  createPlantSchema,
  updatePlantSchema
};
