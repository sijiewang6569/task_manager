import * as UserControllers from '../controllers/user'
import auth from '../middleware/auth'

const express = require('express')
const router = new express.Router()

router.post('/users', UserControllers.postUser)
router.post('/users/login', UserControllers.postUser)
router.post('/users/logout', auth, UserControllers.logUserOut)
router.post('/users/logoutAll', auth, UserControllers.logAllUsersOut)

router.get('/users/me', auth, UserControllers.trivial)
router.patch('/users/me', auth, UserControllers.updateUserInfo)
router.delete('/users/me', auth, UserControllers.deleteUser)

router.post('/users/me/avatar', auth, UserControllers.multerUpload, UserControllers.uploadAvatar, UserControllers.handleBadUploadAvatarReq)
router.delete('/users/me/avatar', auth, UserControllers.deleteAvatar)
router.get('/users/:id/avatar', UserControllers.getUserAvatarByID)

export default router