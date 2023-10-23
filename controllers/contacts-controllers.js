import Contact from '../models/Contact.js'
import { HttpError } from '../helpers/index.js'
import { ctrlWrapper } from '../decorators/index.js'

const getAll = async (req, res) => {
	const result = await Contact.find()
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
	const result = Contact.create(req.body)
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
