'use strict'

const events = require('./user/events')
const imagesEvents = require('./images/events')
const commentEvents = require('./comments/events')
const userEvents = require('./user/events')
// const userLocator = require('./geo-locator-api')

$(() => {
  // userLocator.getUserLocation()
  // $('#login').hide()
  // $('#auth-view').hide()
  $('#footer').hide()
  $('#sign-up').hide()
  $('#carousel-view').hide()
  $('#static-nav').hide()
  $('#upload-images-page').hide()
  $('#my-images-page').hide()
  $('#comment-template').hide()
  userEvents.userHandlers()
  imagesEvents.imageHandlers()
  commentEvents.commentHandlers()
})
