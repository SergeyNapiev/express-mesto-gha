const usersRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.post('/users', createUser);
usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
