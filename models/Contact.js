import { Schema, model } from 'mongoose'
import Joi from 'joi'

import { handleSaveError, preUpdate } from './hooks.js'

const contactSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Set name for contact'],
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	favorite: {
		type: Boolean,
		default: false,
	},
	avatar: {
		type: String,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
})
contactSchema.post('save', handleSaveError)
contactSchema.pre('findOneAndUpdate', preUpdate)
contactSchema.post('findOneAndUpdate', handleSaveError)

export const contactAddSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean().required(),
})
export const contactUpdateSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string(),
	phone: Joi.string().required(),
	favorite: Joi.boolean(),
})
export const contactUpdateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
})

const Contact = model('contact', contactSchema)

export default Contact
