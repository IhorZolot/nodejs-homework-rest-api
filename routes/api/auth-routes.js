import express from 'express'

import authControllers from '../../controllers/auth-controllers.js'
import { validateBody } from '../../decorators/index.js'
import { userSignupSchema, userSigninSchema, userEmailSchema } from '../../models/User.js'
import { authenticate, upload } from '../../middlewares/index.js'

const authRouter = express.Router()

authRouter.post('/signup', validateBody(userSignupSchema), authControllers.signup)
authRouter.post('/verify', validateBody(userEmailSchema), authControllers.resendVerifyEmail)
authRouter.get('/verify/:verificationToken', authControllers.verify)
authRouter.post('/signin', validateBody(userSigninSchema), authControllers.signin)
authRouter.get('/current', authenticate, authControllers.getCurrent)
authRouter.patch('/avatars', authenticate, upload.single('avatar'), authControllers.updateAvatar)
authRouter.post('/signout', authenticate, authControllers.signout)

export default authRouter
