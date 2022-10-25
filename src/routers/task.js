import * as TaskControllers from '../controllers/task'
import auth from '../authentication/auth'

import express from 'express'
const router = new express.Router()

router.post('/tasks', auth, TaskControllers.postTask)

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, TaskControllers.getTasks)
router.get('/tasks/:id', auth, TaskControllers.getTaskByID)
router.patch('/tasks/:id', auth, TaskControllers.updateTaskByID)
router.delete('/tasks/:id', auth, TaskControllers.deleteTaskByID)

export default router