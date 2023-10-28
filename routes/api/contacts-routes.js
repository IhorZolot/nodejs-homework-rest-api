import express from 'express'
import contactsControllers from '../../controllers/contacts-controllers.js'
import { validateBody } from '../../decorators/index.js'
import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from '../../models/Contact.js'
import { authenticate, isValidId } from '../../middlewares/index.js'

const contactsRouter = express.Router()
contactsRouter.use(authenticate)

contactsRouter.get('/', contactsControllers.getAll)

contactsRouter.get('/:id', isValidId, contactsControllers.getById)

contactsRouter.post('/', validateBody(contactAddSchema), contactsControllers.add)

contactsRouter.put('/:id', isValidId, validateBody(contactUpdateSchema), contactsControllers.updateById)
contactsRouter.patch(
	'/:id/favorite',
	isValidId,
	validateBody(contactUpdateFavoriteSchema),
	contactsControllers.updateFavorite
),
	contactsRouter.delete('/:id', isValidId, contactsControllers.deleteById)

export default contactsRouter
