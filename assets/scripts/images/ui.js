'use strict'

const store = require('../store')

let tagCounter = 0
const addTag = function (event) {
  $('#image-upload-form').append('<div class="image-details-group tag"><button class="remove-tag">Remove Tag</button><input type="text" class="image-details-input" name="image[tags][]" placeholder="#tag" required></div>')
  tagCounter++
}

const onUploadImageSuccess = function(data) {
  const previewImage = $('.upload-info').last().children().last().children().first().children()[0]
  const statusCol = $('.upload-info').last().children().last().children().last()
  $(statusCol).append('Success')
  $(previewImage).attr('src', data.image.url)
  const uploadForm = document.getElementById('image-upload-form')
  uploadForm.reset()
  $('.tag').remove()
}

const onUploadImageError = function( jqXHR, textStatus, errorThrown) {
  const statusCol = $('.upload-info').last().children().last().children().last()
  $(statusCol).append('Error')
}

const myImagesViewFailure = () => {
  notification.universalToast('error', 'Failed to Load', 'Failed to load your images. The server might be down; try again later!')
}

const editImageFailure = () => {
  notification.universalToast('error', 'Error!', 'Failed to edit image!')
}

const uploadImagesView = () => {
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
    $('#upload-images-page').show()
    $('#upload-image-li a').text('Carousel')
    $('#upload-image-li').prop('id', 'carousel-li')
  }
  if (store.view === 'my images') {
    $('#my-images-page').hide()
    $('#upload-images-page').show()
    $('#upload-image-li a').text('My Images')
    $('#upload-image-li').prop('id', 'my-images-li')
  }
  store.view = 'upload images'
}

const populateCarouselSuccess = (apiResponse) => {
  // remove user-owned images from the apiRespose
  const publicImagesArr = apiResponse.images.filter(function (image) {
    return image._owner.email !== store.user.email
    // return image._owner.email === store.user.email
  })
  // filter array by distance
  const geoArr = publicImagesArr.filter(function (image) {
    const imageLatitude = image.latitude.toString()
    const imageLongitude = image.longitude.toString()
    const userLatitude = store.user.latitude.toString()
    const userLongitude = store.user.longitude.toString()
    image.distance = geolib.getDistance(
      {latitude: imageLatitude, longitude: imageLongitude},
      {latitude: userLatitude, longitude: userLongitude})
    return image.distance < 25000
  })
  if (geoArr.length === 0) {
    // pass the public array to handlebars
    // run first public image through this handlebars to set active status in carousel
    notification.staticToast('info', 'Empty Community!', 'Looks like no one in your community has uploaded an image. For now, here\'s a look at images from around the world!', '#1F888F')
    $('#carousel-header').text('Public Images')
    const carouselReadoutFirstImage = templateCarouselFirstImage({ image: publicImagesArr[0] })
    // remove first image from array
    publicImagesArr.splice(0, 1)
    // run subsequent public images through this handlebars so active status not set
    const carouselReadout = templateCarousel({ images: publicImagesArr })
    // append images to DOM
    $('#carousel-inner').append(carouselReadoutFirstImage)
    $('#carousel-inner').append(carouselReadout)
  } else {
    // pass the geoArr to handlebars
    // run first public image through this handlebars to set active status in carousel
    const carouselReadoutFirstImage = templateCarouselFirstImage({ image: geoArr[0] })
    // remove first image from array
    geoArr.splice(0, 1)
    // run subsequent public images through this handlebars so active status not set
    const carouselReadout = templateCarousel({ images: geoArr })
    // append images to DOM
    $('#carousel-inner').append(carouselReadoutFirstImage)
    $('#carousel-inner').append(carouselReadout)
  }
}

const myImagesView = (apiResponse) => {
  // updating nav bar - START
  if (store.view === 'carousel') {
    $('#carousel-view').hide()
    $('#my-images-page').show()
    $('#my-images-li a').text('Carousel')
    $('#my-images-li').prop('id', 'carousel-li')
  }
  if (store.view === 'upload images') {
    $('#upload-images-page').hide()
    $('#my-images-page').show()
    $('#my-images-li a').text('Upload Image')
    $('#my-images-li').prop('id', 'upload-image-li')
  }
  store.view = 'my images'
  // populate images - START
  // filtering API response for user-owned images
  const personalImagesArr = apiResponse.images.filter(function (image) {
    return image._owner.email === store.user.email
  })
  if (personalImagesArr.length === 0) {
    $('#my-images-readout-wrapper').append('<div class="no-images" id="no-images">You have no images!<br><br>Upload some images to share with your community!</div>')
  } else {
    // turn each tags array into a string for easy DOM reading
    for (let i = 0; i < personalImagesArr.length; i++) {
      personalImagesArr[i].tags = personalImagesArr[i].tags.join(' ')
    }
    // pass modified array with string for tags to handlebars
    const myImagesReadout = templateMyImages({ images: personalImagesArr })
    $('#my-images-readout-wrapper').append(myImagesReadout)
    // using jquery to add correct image to each handlebars element
    for (let i = 0; i < apiResponse.images.length; i++) {
      $("div[data-id='image-" + apiResponse.images[i]._id + "']").css('background-image', 'url(' + apiResponse.images[i].url + ')')
    }
    // populate images - END
  }
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

const deleteImageSuccess = () => {
  notification.universalToast('success', 'Success!', 'Successfully deleted image!')
  $("div[data-id='wrapper-" + store.currentImageID + "']").hide()
}

const deleteImageFailure = () => {
  notification.universalToast('error', 'Error!', 'Failed to delete image!')
}

const populateCarouselFailure = () => {
  notification.universalToast('error', 'Error!', 'Failed to populate carousel!')
}

const populateCarouselModalSuccess = (apiResponse) => {
  $('#city').text(apiResponse.image.city)
  $('#state').text(apiResponse.image.state)
  $('#single-title').text(apiResponse.image.title)
  $('#single-image').css('background-image', 'url(' + apiResponse.image.url + ')')
  $('#single-description-span').text(apiResponse.image.description)
  $('#single-owned-value').text(apiResponse.image._owner.email)
  if (apiResponse.image.tags.length > 0) {
    $('#single-tag-value').text(apiResponse.image.tags)
  }
  // iterate out the comments
  for (let i = 0; i < apiResponse.image.comments.length; i++) {
    const newTableId = 'comment-div' + i
    const newCommentSpanId = 'comment-span' + i
    const newCommentorSpanId = 'commentor-span' + i
    const $clone = $('#comment-template').clone().show()
    $clone.attr('id', newTableId)
    $clone.appendTo('#comments-wrapper')
    $('#' + newTableId + ' #new-comment').attr('id', newCommentSpanId)
    $('#' + newTableId + ' #new-commentor').attr('id', newCommentorSpanId)
    $('#' + newCommentSpanId).text(apiResponse.image.comments[i][0])
    $('#' + newCommentorSpanId).text(apiResponse.image.comments[i][1])
    if (apiResponse.image.comments[i][1] === store.user.email) {
      $('#' + newTableId).append('<button class="btn btn-default edit-comment-button" data-id="' + apiResponse.image.comments[i][0] + '" id="' + apiResponse.image.comments[i][2] + '">Edit</button>')
    }
  }
}

const populateCarouselModalFailure = (apiResponse) => {
  notification.universalToast('error', 'Error!', 'Failed to populate modal!')
}

const toggleEditImageModalSuccess = (apiResponse) => {
  $('#edit-image-modal').modal('show')
  $('#title1').val(apiResponse.image.title)
  $('#description2').text(apiResponse.image.description)
  $('#tags1').val(apiResponse.image.tags.join(' '))
}

const toggleEditImageModalFailure = () => {
  notification.universalToast('error', 'Error!', 'Failed to load image!')
}

const editImageSuccess = () => {
  // reset modal and hide
  $('#edit-image-form').each(function () {
    this.reset()
  })
  $('#edit-image-modal').modal('hide')
  // manipulate DOM
  $("span[data-id='title-" + store.currentImageID + "']").text(store.recentEditedData.image.title)
  $("span[data-id='description-" + store.currentImageID + "']").text(store.recentEditedData.image.description)
  $("span[data-id='tags-" + store.currentImageID + "']").text(store.recentEditedData.image.tags)
}

const askUser

module.exports = {
  onUploadImageSuccess,
  onUploadImageError,
  uploadImagesView
}
