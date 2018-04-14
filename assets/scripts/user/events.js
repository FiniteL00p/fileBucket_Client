const getFormFields = require('../../../lib/get-form-fields')
const api = require('./api')
const ui = require('./ui')
const store = require('../store.js')
const userLocator = require('../geo-locator-api')

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
  // show spinner
  $('#spinner').fadeIn()
  const data = getFormFields(event.target)
  api.signIn(data)
    // passing geo-locator the apiResponse so it can use in its update user requests
    .then(function (signInApiResponse) {
      store.user = signInApiResponse.user
      return signInApiResponse
    })
    .then(signInApiResponse => userLocator.getUserLocation(signInApiResponse))
    // The geolocator updates user with lat/long and returns the sign-in apiResponse
    // if lat is truthy, continue the chain
    .then(function (geoResponse) {
      return geoResponse
    })
    .then(function (updatedApiResponse) {
      if (updatedApiResponse.user.latitude) {
        ui.onSignInSuccess(updatedApiResponse)
        api.getImages()
          .then(ui.populateCarouselSuccess)
          .catch(ui.populateCarouselFailure)
        store.view = 'carousel'
      } else {
        ui.noGeoTracking()
      }
    })
    .catch(function (error) {
      if (error.code === 3) {
        ui.timeOutMessage()
        ui.onSignInSuccess(store.user)
        api.getImages()
          .then(ui.populateCarouselSuccess)
          .catch(ui.populateCarouselFailure)
        store.view = 'carousel'
      } else {
        // hide spinner on failed sign in
        $('#spinner').hide()
        ui.onSignInFailure(error)
      }
    })
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

const onSelectUploadImagesView = (event) => {
  event.preventDefault()
  ui.uploadImagesView()
  // emptying my images view so it doesn't duplicate on return to my images
  $('#my-images-readout-wrapper').empty()
}

const onSelectViewMyImagesView = (event) => {
  event.preventDefault()
  api.getImages()
    .then(ui.myImagesView)
    .catch(ui.myImagesViewFailure)
}

const onReturnToCarouselView = (event) => {
  event.preventDefault()
  ui.returnToCarouselView()
  // emptying my images view so it doesn't duplicate on return to my images
  $('#my-images-readout-wrapper').empty()
}

const onDeleteImage = (event) => {
  event.preventDefault()
  // we set the "delete" data property of the delete button to image ID so we
  // could access it from the event and use to AJAX/DOM delete
  store.currentImageID = $(event.target).data().delete
  api.deleteImage()
    .then(ui.deleteImageSuccess)
    .catch(ui.deleteImageFailure)
}

const onSelectCarousel = (event) => {
  event.preventDefault()
  $('#comments-wrapper').empty()
  store.currentImageID = $(event.target).data().id
  $('#single-image-readout-modal').modal('show')
  api.findImageById()
    .then(ui.populateCarouselModalSuccess)
    .catch(ui.populateCarouselModalFailure)
}

const onToggleEditImageModal = (event) => {
  event.preventDefault()
  store.currentImageID = $(event.target).data().edit
  api.findImageById()
    .then(ui.toggleEditImageModalSuccess)
    .catch(ui.toggleEditImageModalFailure)
}

const onEditImage = (event) => {
  event.preventDefault()
  const editImageData = getFormFields(event.target)
  store.recentEditedData = editImageData
  api.editImage(editImageData)
    .then(ui.editImageSuccess)
    .catch(ui.editImageFailure)
}

const onAddComment = (event) => {
  event.preventDefault()
  const packagedData = getFormFields(event.target)
  // save for DOM manipulation
  store.mostRecentComment = packagedData.image.comments
  api.createComment(packagedData)
    .then(ui.addCommentSuccess)
    .catch(ui.addCommentFailure)
}

const onToggleEditComment = function (event) {
  event.preventDefault()
  $('#single-image-readout-modal').modal('hide')
  $('#edit-comment-modal').modal('show')
  const data = $(event.target).data()
  const id = $(event.target).val('id')
  const oldCommentText = data.id
  const oldCommentId = id[0].id
  store.commentId = oldCommentId
  ui.populateEditModal(oldCommentText, oldCommentId)
}

const onSubmitComment = function (event) {
  event.preventDefault()
  const newData = getFormFields(event.target)
  newData.image.commentId = store.commentId
  api.editComment(newData)
    .then(ui.editCommentSuccess)
    .catch(ui.editCommentFailure)
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
  onReturnToCarouselView,
  onDeleteImage,
  onSelectCarousel,
  onToggleEditImageModal,
  onEditImage,
  onAddComment,
  onToggleEditComment,
  onSubmitComment
}
