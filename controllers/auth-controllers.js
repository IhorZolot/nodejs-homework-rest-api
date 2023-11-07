import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import gravatar from 'gravatar'
import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

import User from '../models/User.js'
import { HttpError, sendEmail } from '../helpers/index.js'
import { ctrlWrapper } from '../decorators/index.js'

const avatarPath = path.resolve('public', 'avatars')

dotenv.config()

const { JWT_SECRET, BASE_URL } = process.env

const signup = async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })
	if (user) {
		throw HttpError(409, 'email already in use')
	}
	if (!email || !password) {
		return res.status(400).json({ error: 'All fields must be filled' })
	}
	const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })
	const hashPassword = await bcrypt.hash(password, 6)
	const verificationToken = nanoid()

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken })
const verifyEmail = {
	to: email,
	subject: 'Veryfy email',
	html: `<a target='_blank' href='${BASE_URL}/api/auth/verify/${verificationToken}'>Click to verify email</a>`
}
await sendEmail(verifyEmail)
	res.status(201).json({
		username: newUser.username,
		email: newUser.email,
		avatarURL: newUser.avatarURL,
	})
}
const resendVerifyEmail = async (req, res) => {
	const {email} = req.body
	const user = await User.findOne({email})
	if(!user) {
		throw HttpError(404, 'Email not Found')
	}
	if(user.verify) {
		throw HttpError(400, 'Email already verify')
	}
	const verifyEmail = {
		to: email,
		subject: 'Veryfy email',
		html: `<a target='_blank' href='${BASE_URL}/api/auth/verify/${user.verificationToken}'>Click to verify email</a>`
	}
	await sendEmail(verifyEmail)

	res.json({
		message: 'Verify email send success'
	})

}

const verify = async (req, res) => {
	const {verificationToken} = req.params
	const user = await User.findOne({verificationToken})
  if(!user){
		throw HttpError(404, 'Email not found')
	}
	await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ''})
	res.json({
		message: 'Email verify success'
	})
}


const signin = async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })
	if (!user) {
		throw HttpError(401, 'Email or password invalid')
	}
	if(!user.verify){
		throw HttpError (401, 'Email not veryfy')
	}
	const passwordCompare = await bcrypt.compare(password, user.password)
	if (!passwordCompare) {
		throw HttpError(401, 'Email or password invalid')
	}
	const payload = {
		id: user._id,
	}
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '48h' })
	await User.findByIdAndUpdate(user._id, { token })

	res.json({
		token,
	})
}
const getCurrent = async (req, res) => {
	const { username, email } = req.user
	res.json({
		username,
		email,
	})
}
const updateAvatar = async (req, res) => {
	try {
		const user = req.user
		const { path: oldPath, filename } = req.file
		const newPath = path.join(avatarPath, filename)
		await fs.rename(oldPath, newPath)
		const avatarURL = path.join('avatars', filename)
		user.avatarURL = avatarURL
		await user.save()
		res.status(200).json(user)
	} catch (error) {
		throw HttpError(401)
	}
}
const signout = async (req, res) => {
	const { _id } = req.user
	await User.findByIdAndUpdate(_id, { token: '' })
	res.json({
		message: 'Signout success',
	})
}
export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	verify: ctrlWrapper(verify),
	signout: ctrlWrapper(signout),
	getCurrent: ctrlWrapper(getCurrent),
	updateAvatar: ctrlWrapper(updateAvatar),
}
