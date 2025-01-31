import { Schema, model } from 'mongoose'
import Joi from 'joi'

import { handleSaveError, preUpdate } from './hooks.js'
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			match: emailRegexp,
			unique: true,
			required: [true, 'Email is required'],
		},
		password: {
			type: String,
			minlength: 8,
			required: [true, 'Set password for user'],
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		token: {
			type: String,
		},
		avatarURL: {
			type: String,
		},
			verify: {
				type: Boolean,
				default: false,
			},
			verificationToken: {
				type: String,
			},
	},
	{ versionKey: false, timestamps: true }
)
userSchema.post('save', handleSaveError)
userSchema.pre('findOneAndUpdate', preUpdate)
userSchema.post('findOneAndUpdate', handleSaveError)

export const userSignupSchema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(8).required(),
})
export const userSigninSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(8).required(),
})
export const userEmailSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
})
const User = model('user', userSchema)
export default User
