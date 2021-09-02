const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')

const router = express.Router();

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  const users = await Users.get()
  try {
    res.json(users)
  }
  catch (error) {
    next(error)
  }
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const user = await Users.insert({ name: req.name })
    res.status(201).json(user)
  }
  catch (error) {
    next(error)
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const updatedUser = await Users.update(req.params.id, { name: req.name })
    res.json(updatedUser)
  }
  catch (error) {
    next(error)
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await Users.remove(req.params.id)
    res.json(req.user)
  }
  catch (error) {
    next(error)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const posts = await Users.getUserPosts(req.params.id)
    res.json(posts)
  }
  catch (error) {
    next(error)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const newPost = await Posts.insert({ text: req.text, user_id: req.params.id })
    res.json(newPost)
  }
  catch (error) {
    next(error)
  }
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({ message: error.message })
});


// do not forget to export the router
module.exports = router