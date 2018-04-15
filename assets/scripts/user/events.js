const getFormFields = require('../../../lib/get-form-fields')
const api = require('./api')
const ui = require('./ui')
const store = require('../store.js')

const userHandlers = function () {
  $('#edit-pwd-li').on('click', onToggleEditPwdModal)
  $('#change-pw-form').on('submit', onEditPassword)
  $('#sign-out-li').on('click', onLogOut)
  $('#login-form').on('submit', onSignIn)
  $('#sign-up-form').on('submit', onSignUp)
  $('#sign-up-toggle').on('click', onToggleSignUp)
  $('#sign-in-toggle').on('click', onToggleSignIn)
}

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
  api.signIn(data)
    .then(ui.onSignInSuccess)
    .catch(ui.onSignInFailure)
}

const onSignUp = (event) => {
  event.preventDefault()
  const packagedSignUpData = getFormFields(event.target)
  api.signUp(packagedSignUpData)
    .then(ui.onSignUpSuccess)
    .catch(ui.onSignUpFailure)
}

const onLogOut = (event) => {
  event.preventDefault()
  // hide spinner so it won't show on return to landing page
  $('#spinner').hide()
  api.logOut()
    .then(ui.onLogOutSuccess)
    .catch(ui.onLogOutFailure)
  // emptying my images view so it doesn't duplicate on return to my images
  $('#my-images-readout-wrapper').empty()
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

module.exports = {
  userHandlers,
  onSignIn,
  onToggleSignUp,
  onToggleSignIn,
  onSignUp,
  onLogOut,
  onToggleEditPwdModal,
  onEditPassword
}
