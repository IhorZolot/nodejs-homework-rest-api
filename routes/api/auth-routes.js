import express from 'express'

import authControllers from '../../controllers/auth-controllers.js'
import { validateBody } from '../../decorators/index.js'
import { userSignupSchema, userSigninSchema } from '../../models/User.js'
import { authenticate, upload } from '../../middlewares/index.js'

const authRouter = express.Router()

authRouter.post('/signup', validateBody(userSignupSchema), authControllers.signup)
authRouter.post('/signin', validateBody(userSigninSchema), authControllers.signin)
authRouter.get('/current', authenticate, authControllers.getCurrent)
authRouter.patch('/avatars', authenticate, upload.single('avatar'), authControllers.updateAvatar)
authRouter.post('/signout', authenticate, authControllers.signout)

export default authRouter
