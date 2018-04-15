'use strict'

const store = require('../store')
const templateCarousel = require('../templates/carousel-readout.handlebars')
const templateMyImages = require('../templates/my-images-readout.handlebars')
const api = require('./api')

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
  $('#upload-images-page').show()
  $('#carousel-view').hide()
  $('#map-view').hide()
}

const populateCarousel = function(data) {
  const carouselReadout = templateCarousel({ images: data.images })
  $('#carousel-inner').append(carouselReadout)
  $('#carousel-inner').find('.item').first().addClass('active')
}

const populateCarouselSuccess = (data) => {
  const nonUserImages = data.images.filter(function (image) {
    return image._owner.email !== store.user.email
  })
  $('#carousel-view').show()
  $('#map-view').hide()
  $('#upload-images-page').hide()
  $('#carousel-inner').empty()
  $('.loader-wrapper').hide()
  $('#my-images-page').hide()
  if(nonUserImages.length < 1) {
    api.getImages()
    .then((data) => {
      if(data > 1) {
        $('#carousel-example-generic').show()
        populateCarousel(data)
      }
      else {
        $('#carousel-view').append('Sorry No Images Uploaded Yet')
      }
    })
  }
  else {
    $('#carousel-example-generic').show()
    populateCarousel(data)
  }
}

const onGetMyImagesSuccess = (response) => {
  $('#upload-images-page').hide()
  $('#carousel-view').hide()
  $('#my-images-page').show()
  $('#map-view').hide()
  $('#my-images-readout-wrapper').empty()
  // populate images - START
  // filtering API response for user-owned images
  const personalImagesArr = response.images.filter(function (image) {
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
    for (let i = 0; i < response.images.length; i++) {
      $("div[data-id='image-" + response.images[i]._id + "']").css('background-image', 'url(' + response.images[i].url + ')')
    }
  }
}

const returnToCarouselView = () => {
  $('#upload-images-page').hide()
  $('#carousel-view').show()
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
  console.log(apiResponse)
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

const onGetImagesForMap = function (data) {
  $('#upload-images-page').hide()
  $('#carousel-view').hide()
  $('#my-images-page').hide()
  $('#map-view').show()
  let userLocation
  if(store.user.latitude && store.user.latitude) {
    userLocation = {lat: store.user.latitude, lng: store.user.longitude}
  }
  else {
    userLocation = {lat: 42.360082, lng: -71.058880}
  }
  const map = new google.maps.Map(document.getElementById('map'), {
    center: userLocation,
    zoom: 8
  });

  data.images.forEach(function(image){
    const imageLatLng = {lat: image.loc[1], lng: image.loc[0]}

    const contentString = '<div id="content">'+
      '<h4>Title: </h4>' + image.title + '<br>' +
      '<h4> Description: </h4>' + image.description + '<br>' +
      '<h4> Latitude:</h4> ' + image.loc[1] + '<br>' +
      '<h4>Longitude:</h4>' + image.loc[0] + '<br>' +
    '</div>';

    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    const marker = new google.maps.Marker({
      map: map,
      position: imageLatLng,
      icon: {
        url: image.url,
        scaledSize: new google.maps.Size(30, 30)
      }
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  })
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

module.exports = {
  populateCarouselSuccess,
  populateCarouselModalSuccess,
  onUploadImageSuccess,
  onUploadImageError,
  uploadImagesView,
  returnToCarouselView,
  onGetMyImagesSuccess,
  onGetImagesForMap
}
