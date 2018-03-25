const apiUrl = require('../config')
const store = require('../store.js')

const signIn = function (data) {
  return $.ajax({
    url: apiUrl + '/sign-in',
    method: 'POST',
    headers: {
      contentType: 'application/json'
    },
    data
  })
}

const signUp = function (data) {
  return $.ajax({
    url: apiUrl + '/sign-up',
    method: 'POST',
    headers: {
      contentType: 'application/json'
    },
    data
  })
}

const changePw = function (data) {
  return $.ajax({
    url: apiUrl + '/change-password',
    method: 'PATCH',
    headers: {
      contentType: 'application/json'
    },
    data
  })
}

const logOut = () => {
  return $.ajax({
    url: apiUrl + '/sign-out/' + store.user._id,
    method: 'DELETE',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const changePassword = (editPwdData) => {
  return $.ajax({
    url: apiUrl + '/change-password/' + store.user._id,
    method: 'PATCH',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    },
    data: editPwdData
  })
}

module.exports = {
  signIn,
  signUp,
  changePw,
  logOut,
  changePassword
}
