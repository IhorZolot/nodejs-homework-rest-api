import Contact from '../models/Contact.js'
import { HttpError } from '../helpers/index.js'
import { ctrlWrapper } from '../decorators/index.js'

const getAll = async (req, res) => {
	const { _id: owner } = req.user
	const { page = 1, limit = 20 } = req.query
	const skip = (page - 1) * limit
	const result = await Contact.find({ owner }, '-createdAt -updatedAt', { skip, limit }).populate(
		'owner',
		'username email'
	)
	res.json(result)
}
const getById = async (req, res) => {
	const { id } = req.params
	const result = await Contact.findById(id)
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`)
	}
	res.json(result)
}
const add = async (req, res) => {
	const { _id: owner } = req.user
	const result = Contact.create({ ...req.body, owner })
	res.status(201).json(result)
}
const updateById = async (req, res) => {
	const { id } = req.params
	const result = await Contact.findByIdAndUpdate(id, req.body)
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`)
	}
	res.json(result)
}
const updateFavorite = async (req, res) => {
	const { id } = req.params
	const { favorite } = req.body
	if (typeof favorite === 'undefined') {
		return res.status(400).json({ message: 'missing field favorite' })
	}
	const result = await Contact.findByIdAndUpdate(id, req.body)
	if (!result) {
		throw HttpError(404, ` Not found `)
	}
	res.json(result)
}
const deleteById = async (req, res) => {
	const { id } = req.params
	const result = await Contact.findByIdAndDelete(id)
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`)
	}
	res.json({
		message: 'Delete success',
	})
}

export default {
	getAll: ctrlWrapper(getAll),
	getById: ctrlWrapper(getById),
	add: ctrlWrapper(add),
	updateById: ctrlWrapper(updateById),
	updateFavorite: ctrlWrapper(updateFavorite),
	deleteById: ctrlWrapper(deleteById),
}
