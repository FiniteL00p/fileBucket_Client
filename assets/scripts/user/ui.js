const notification = require('../../../lib/notifications')
const store = require('../store.js')
const templateMyImages = require('../templates/my-images-readout.handlebars')
const geolib = require('geolib')
const api = require('./api')
const imagesApi = require('../images/api')
const imagesUi = require('../images/ui')

const onSignInSuccess = function (apiResponse) {
  store.user = apiResponse.user
  api.getUserLocation()
  .then((location) => {
    console.log(location)
    store.user.latitude = location.coords.latitude
    store.user.longitude = location.coords.longitude
    console.log(store.user)
  })
  .then(() => {
    imagesApi.getImagesByDistance()
    .then(imagesUi.populateCarouselSuccess)
  })
  .catch(() => {
    getUserLocationTimeout()
    imagesApi.getImages()
    .then(imagesUi.populateCarouselSuccess)
  })
  notification.staticToast('success', 'Success!', 'Successfully signed in!', '#1F888F')
  const loginForm = document.getElementById('login-form')
  loginForm.reset()
  // change placeholder in dropdown label to user email
  $('#user-email-dropdown').text(store.user.email)
  // making sure appropriate views/nav options are active
  $('#footer').show()
  $('#auth-view').hide()
  $('#my-images-page').hide()
  $('#upload-images-page').hide()
  $('#carousel-view').show()
  $('#static-nav').show()
}

const onSignInFailure = function (error) {
  $('#login-form').each(function () {
    this.reset()
  })
  if (error.code === 1) {
    // user rejects geo locator
    notification.staticToast('error', 'Sorry!', 'This app requires the use of location tracking. Please allow location tracking in order to proceed. If you already rejected our tracking request, you will need to reset that decision in your browser settings.', 'red')
  } else {
    // wrong password, etc.
    notification.alert('danger', 'Login Unsuccessful. Please make sure you used the correct password!')
  }
}

const onSignUpSuccess = function () {
  notification.alert('success', 'Successfully Signed Up')
  $('#sign-up').hide()
  $('#login').show()
  // clearing sign up form on sign up success
  $('#sign-up-form').each(function () {
    this.reset()
  })
}

const onSignUpFailure = function () {
  $('#sign-up-form').each(function () {
    this.reset()
  })
  notification.alert('danger', 'Sign Up Unsuccessful')
}

const onLogOutSuccess = () => {
  notification.alert('success', 'Successfully Logged Out')
  $('#static-nav').hide()
  $('#footer').hide()
  $('#auth-view').show()
  $('#carousel-inner').empty()
  $('#carousel-view').hide()
  $('#upload-images-page').hide()
  $('#my-images-page').hide()
  $('#carousel-header').text('Your Community') // in case timeout changed it
}

const onLogOutFailure = (apiResponse) => {
  notification.alert('danger', 'Log-Out Unsuccessful')
}

const onChangePwdSuccess = () => {
  $('#change-pw-modal').modal('hide')
  // clearing change pwd form on success
  $('#change-pw-form').each(function () {
    this.reset()
  })
  notification.universalToast('success', 'Success!', 'Password successfully changed.')
}

const onChangePwdFailure = () => {
  $('#change-pw-modal').modal('hide')
  // clearing change pwd form on success
  $('#change-pw-form').each(function () {
    this.reset()
  })
  notification.universalToast('error', 'Error!', 'Failed to edit password. Make sure you\'re entering the correct password!')
}

const noGeoTracking = () => {
  notification.staticToast('error', 'Sorry!', 'This app requires the use of location tracking. Please allow location tracking in order to proceed. If you already rejected our tracking request, you will need to reset that decision in your browser settings.', 'red')
}

const getUserLocationTimeout = () => {
  notification.staticToast('info', 'Location Tracker Timed-Out!', 'Geolocation was taking too long. To avoid excessive wait times, we\'re populating your carousel with images from around the world (instead of your local community).', '#1F888F')
  $('#carousel-header').text('Public Images')
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
  noGeoTracking
}
