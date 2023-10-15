import contactService from '../models/contacts/contacts.js'
import {HttpError} from '../helpers/index.js'
import {ctrlWrapper} from '../decorators/index.js'
import { contactAddSchema, contactUpdateSchema } from '../schemas/contacts-schemas.js'


const getAll = async (req, res) => {
		const result = await contactService.listContacts()
	res.json(result)
}
const getById = async (req, res, next) => {
    const {id} = req.params
    const result = await contactService.getContactById(id)
    if(!result) {
      throw HttpError(404, `Contact with id=${id} not found`)
    }
    res.json(result)
}
const add = async(req, res) => {
    const {error} =  contactAddSchema.validate(req.body)
    if(error) {
      throw HttpError(400, error.massege)
    }
    const result = await contactService.addContact(req.body)
    res.status(201).json(result)
}
const updateById = async(req, res) => {
    const {error} = contactUpdateSchema.validate(req.body)
    if(error) {
      throw HttpError(400, error.massege)
    }
    const {id} = req.params
    const result = await contactService.updateContact(id, req.body)
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`)
    }
    res.json(result)
}
const deleteById = async(req, res) => {
    const {id} = req.params
    const result = await contactService.removeContact(id)
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`)
    }
    res.json({
      message: 'Delete success'
    })
}

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
}