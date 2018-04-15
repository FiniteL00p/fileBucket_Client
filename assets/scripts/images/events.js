'use strict'

const ui = require('./ui')
const getFormFields = require('../../../lib/get-form-fields')
const api = require('./api')
const getExifData = require('../../../lib/get-exif-data')
const store = require('../store')

const imageHandlers = function () {
  $('#add-tag-btn').on('click', ui.addTag)
  $('#image-upload-form').on('submit', onUploadImage)
  $('#upload-btn').on('change', getExifData)
  $('body').on('click', '.delete-image-button', onDeleteImage)
  $('body').on('click', '.carousel-img-handler-class', onSelectCarousel)
  $('body').on('click', '.edit-image-button', onToggleEditImageModal)
  $('body').on('submit', '#edit-image-form', onEditImage)
  $('body').on('click', '#upload-image-li', onSelectUploadImagesView)
  $('body').on('click', '#carousel-link', onReturnToCarouselView)
  $('body').on('click', '#my-images-li', onSelectViewMyImagesView)
  $('body').on('click', '#map-link', onSelectMap)
  $('body').on('click', '.remove-tag', (event) => {
    $(event.target).parent().remove()
    $(event.target).parent().parent().siblings().remove()
  })
}

const onSelectMap = function() {
  api.getImages()
  .then(ui.onGetImagesForMap)
}

const onUploadImage = function (event) {
  event.preventDefault()
  const file = $("input[type=file]").get(0).files[0]
  const imageRow = `
    <div class='row image-table-row'>
      <div class="col-md-2 image-table-col"><img src="https://i.imgur.com/Z48QqPW.jpg" class="thumbnail"></div>
      <div class="col-md-3 image-table-col">` + file.name + `</div>
      <div class="col-md-2 image-table-col">` + file.size + `</div>
      <div class="col-md-2 image-table-col">` + file.type + `</div>
      <div class="col-md-3 image-table-col"></div>
    </div>
  `
  $('.upload-info').append(imageRow)
  const formData = new FormData(event.target)
  const imageDetails = getFormFields(event.target)
  formData.append('image[loc][longitude]', store.exifData.longitude)
  formData.append('image[loc][latitude]', store.exifData.latitude)
  formData.append('image[city]', store.exifData.city)
  formData.append('image[state]', store.exifData.state)
  formData.append('image[country]', store.exifData.country)
  api.uploadImage(formData)
    .then(ui.onUploadImageSuccess)
    .catch(ui.onUploadImageError)
}

const onSelectCarousel = (event) => {
  event.preventDefault()
  $('#comments-wrapper').empty()
  const imageId = $(event.target).data().id
  console.log($(event.target).data().id)
  $('#single-image-readout-modal').modal('show')
  api.findImageById(imageId)
    .then(ui.populateCarouselModalSuccess)
    .catch(ui.populateCarouselModalFailure)
}

const onReturnToCarouselView = (event) => {
  event.preventDefault()
  if(store.user.latitude && store.user.longitude) {
    api.getImagesByDistance()
      .then(ui.populateCarouselSuccess)
      .catch(ui.populateCarouselFailure)
  }
  else {
    api.getImages()
    .then(ui.populateCarouselSuccess)
    .catch(ui.populateCarouselFailure)
  }
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

const onSelectUploadImagesView = (event) => {
  event.preventDefault()
  ui.uploadImagesView()
  // emptying my images view so it doesn't duplicate on return to my images
  $('#my-images-readout-wrapper').empty()
}

const onSelectViewMyImagesView = (event) => {
  event.preventDefault()
  api.getImages()
    .then(ui.onGetMyImagesSuccess)
    .catch(ui.onGetMyImagesFailure)
}

module.exports = {
  imageHandlers
}
