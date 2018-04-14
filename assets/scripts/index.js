'use strict'

const events = require('./user/events')
const imagesEvents = require('./images/events')
const commentEvents = require('./comments/events')
const userEvents = require('./user/events')

$(() => {
  userEvents.userHandlers()
  imagesEvents.imageHandlers()
  commentEvents.commentHandlers()
})
