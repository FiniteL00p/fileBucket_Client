'use strict'

const events = require('./user/events')

$(() => {
  // $('#login').hide()
  // $('#auth-view').hide()
  $('#sign-up').hide()
  $('#carousel-view').hide()
  $('#static-nav').hide()
  $('#upload-images-page').hide()
  $('#my-images-page').hide()

  $('#edit-pwd-li').on('click', events.onToggleEditPwdModal)
  $('#change-pw-form').on('submit', events.onEditPassword)
  $('#sign-out-li').on('click', events.onLogOut)
  $('#login-form').on('submit', events.onSignIn)
  $('#sign-up-form').on('submit', events.onSignUp)
  $('#sign-up-toggle').on('click', events.onToggleSignUp)
  $('#sign-in-toggle').on('click', events.onToggleSignIn)

  // These bottom three require special syntax because they refer to two buttons
  // whose IDs (and therefore functionality) change depending on the view the
  // user is currently in; while in Carousel view, the two buttons button bring
  // user to upload view and my images view; while in upload view, the upload
  // button becomes the carousel button; while in my images view, the my images
  // button becomes the carousel button.
  $('body').on('click', '#upload-image-li', events.onSelectUploadImagesView)
  $('body').on('click', '#carousel-li', events.onReturnToCarouselView)
  $('body').on('click', '#my-images-li', events.onSelectViewMyImagesView)
})
