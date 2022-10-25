import { multer } from 'multer'
import { sharp } from 'sharp'
import User from '../'
import { sendWelcomeEmail, sendCancelationEmail } from '../emails/account'

export const postUser = async (req, res) => {
  const user = new User(req.body)

  try {
      await user.save()
      sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
  } catch (e) {
      res.status(400).send(e)
  }
}

export const logUserIn = async (req, res) => {
  try {
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()
      res.send({ user, token })
  } catch (e) {
      res.status(400).send()
  }
}

export const logUserOut = async (req, res) => {
  try {
      req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token
      })
      await req.user.save()

      res.send()
  } catch (e) {
      res.status(500).send()
  }
}

export const logAllUsersOut = async (req, res) => {
  try {
      req.user.tokens = []
      await req.user.save()
      res.send()
  } catch (e) {
      res.status(500).send()
  }
}

export const updateUserInfo = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      updates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
      res.send(req.user)
  } catch (e) {
      res.status(400).send(e)
  }
}

export const deleteUser = async (req, res) => {
  try {
      await req.user.remove()
      sendCancelationEmail(req.user.email, req.user.name)
      res.send(req.user)
  } catch (e) {
      res.status(500).send()
  }
}

export const deleteAvatar = async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
}

export const trivial = async (req, res) => {
  res.send(req.user)
}

export const multerUpload = multer({
  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)
  }
}).single('avatar')

export const uploadAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}

export const handleBadUploadAvatarReq = (error, req, res, next) => {
  res.status(400).send({ error: error.message })
}

export const getUserAvatarByID = async (req, res) => {
  try {
      const user = await User.findById(req.params.id)

      if (!user || !user.avatar) {
          throw new Error()
      }

      res.set('Content-Type', 'image/png')
      res.send(user.avatar)
  } catch (e) {
      res.status(404).send()
  }
}