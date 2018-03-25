const notification = require('../../../lib/notifications')
const store = require('../store.js')

const onSignInSuccess = function (apiResponse) {
  // storing API response (i.e., user object) to have quick access to
  // things like user._id, user.email, user.token, etc.
  store.user = apiResponse.user
  // end
  notification.notification('success', 'Successfully Signed In')
  notification.universalToast('success', 'Success!', 'Successfully signed in!')
  // change placeholder in dropdown label to user email
  $('#user-email-dropdown').text(store.user.email)
  // end
  $('#auth-view').hide()
  $('#carousel-view').show()
  $('#static-nav').show()
  // clearing sign in form on sign in success
  $('#login-form').each(function () {
    this.reset()
  })
  // end
  // storing view location to inform dom manipulation (e.g., nav button options)
  store.view = 'carousel'
  // end
}

const onSignInFailure = function () {
  notification.notification('danger', 'Login Unsuccessful')
}

const onSignUpSuccess = function () {
  notification.notification('success', 'Successfully Signed Up')
  $('#sign-up').hide()
  $('#login').show()
  // clearing sign up form on sign up success
  $('#sign-up-form').each(function () {
    this.reset()
  })
  // end
}

const onSignUpFailure = function () {
  notification.notification('danger', 'Sign Up Unsuccessful')
}

const onLogOutSuccess = () => {
  if (store.view === 'upload images') {
    $('#upload-images-page').hide()
    $('#carousel-li a').text('Upload Image')
    $('#carousel-li').prop('id', 'upload-image-li')
  }
  if (store.view === 'my images') {
    $('#my-images-page').hide()
    $('#carousel-li a').text('My Images')
    $('#carousel-li').prop('id', 'my-images-li')
  }
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
  }
  notification.notification('success', 'Successfully Logged Out')
  $('#static-nav').hide()
  $('#auth-view').show()
  store.view = 'landing page'
}

const onLogOutFailure = () => {
  notification.notification('danger', 'Log-Out Unsuccessful')
}

const onChangePwdSuccess = () => {
  $('#change-pw-modal').modal('hide')
  // clearing change pwd form on success
  $('#change-pw-form').each(function () {
    this.reset()
  })
  // end
  notification.notification('success', 'Password Successfully Changed')
}

const onChangePwdFailure = () => {
  notification.notification('danger', 'Failed to Edit Password')
}

const uploadImagesView = () => {
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
    $('#upload-images-page').show()
    $('#upload-image-li a').text('Carousel')
    $('#upload-image-li').prop('id', 'carousel-li')
    // change upload to carousel
  }
  if (store.view === 'my images') {
    $('#my-images-page').hide()
    $('#upload-images-page').show()
    $('#upload-image-li a').text('My Images')
    $('#upload-image-li').prop('id', 'my-images-li')
    // change upload to my Images
  }
  store.view = 'upload images'
}

const myImagesView = () => {
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
    $('#my-images-page').show()
    $('#my-images-li a').text('Carousel')
    $('#my-images-li').prop('id', 'carousel-li')
    // change my images to carousel
  }
  if (store.view === 'upload images') {
    $('#upload-images-page').hide()
    $('#my-images-page').show()
    $('#my-images-li a').text('Upload Image')
    $('#my-images-li').prop('id', 'upload-image-li')
    // change images to upload
  }
  store.view = 'my images'
}

const returnToCarouselView = () => {
  if (store.view === 'upload images') {
    $('#upload-images-page').hide()
    $('#carousel-view').show()
    $('#carousel-li a').text('Upload Image')
    $('#carousel-li').prop('id', 'upload-image-li')
  }
  if (store.view === 'my images') {
    $('#my-images-page').hide()
    $('#carousel-view').show()
    $('#carousel-li a').text('My Images')
    $('#carousel-li').prop('id', 'my-images-li')
  }
  store.view = 'carousel'
}

module.exports = {
  onSignInSuccess,
  onSignInFailure,
  onSignUpSuccess,
  onSignUpFailure,
  onLogOutSuccess,
  onLogOutFailure,
  onChangePwdSuccess,
  onChangePwdFailure,
  uploadImagesView,
  returnToCarouselView,
  myImagesView
}
