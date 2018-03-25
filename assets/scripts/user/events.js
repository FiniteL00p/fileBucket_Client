const getFormFields = require('../../../lib/get-form-fields')
const api = require('./api')
const ui = require('./ui')
const store = require('../store.js')

// const authHandlers = function () {
//   $('#login').on('submit', onSignIn)
//   $('#sign-up-toggle').on('click', onToggleSignUp)
// }

const onToggleSignUp = (event) => {
  event.preventDefault()
  $('#login').hide()
  $('#sign-up').show()
}

const onToggleSignIn = (event) => {
  event.preventDefault()
  $('#sign-up').hide()
  $('#login').show()
}

const onSignIn = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  console.log(data)
  api.signIn(data)
    .then(ui.onSignInSuccess)
    .catch(ui.onSignInFailure)
}

const onSignUp = (event) => {
  event.preventDefault()
  const packagedSignUpData = getFormFields(event.target)
  console.log(packagedSignUpData)
  api.signUp(packagedSignUpData)
    .then(ui.onSignUpSuccess)
    .catch(ui.onSignUpFailure)
}

const onLogOut = (event) => {
  event.preventDefault()
  console.log('Log Out button works!')
  console.log(store.user.token)
  api.logOut()
    .then(ui.onLogOutSuccess)
    .catch(ui.onLogOutFailure)
}

const onToggleEditPwdModal = (event) => {
  event.preventDefault()
  $('#change-pw-modal').modal('show')
}

const onEditPassword = (event) => {
  event.preventDefault()
  const packagedEditPwdData = getFormFields(event.target)
  api.changePassword(packagedEditPwdData)
    .then(ui.onChangePwdSuccess)
    .catch(ui.onChangePwdFailure)
}

const onSelectUploadImagesView = (event) => {
  event.preventDefault()
  ui.uploadImagesView()
}

const onSelectViewMyImagesView = (event) => {
  event.preventDefault()
  ui.myImagesView()
}

const onReturnToCarouselView = (event) => {
  event.preventDefault()
  ui.returnToCarouselView()
}

module.exports = {
  onSignIn,
  onToggleSignUp,
  onToggleSignIn,
  onSignUp,
  onLogOut,
  onToggleEditPwdModal,
  onSelectUploadImagesView,
  onSelectViewMyImagesView,
  onEditPassword,
  onReturnToCarouselView
}
