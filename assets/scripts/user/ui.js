const notification = require('../../../lib/notifications')
const store = require('../store.js')
const templateMyImages = require('../templates/my-images-readout.handlebars')

const templateCarousel = require('../templates/carousel-readout.handlebars')
const apiUrl = require('../config')
const Dropzone = require('../../../lib/dropzone')

const onSignInSuccess = function (apiResponse) {
  // storing API response (i.e., user object) to have quick access to
  // things like user._id, user.email, user.token, etc.
  store.user = apiResponse.user
  // end
  notification.universalToast('success', 'Success!', 'Successfully signed in!')
  // change placeholder in dropdown label to user email
  $('#user-email-dropdown').text(store.user.email)
  // end
  // making sure appropriate views/nav options are active
  $('#auth-view').hide()
  $('#my-images-page').hide()
  $('#upload-images-page').hide()
  $('#carousel-view').show()
  $('#static-nav').show()
  // clearing sign in form on sign in success
  $('#login-form').each(function () {
    this.reset()
  })
  const previews = `
    <div class="row image-table-row">
        <div class="col-md-2 dz-preview dz-file-preview image-table-col">
            <img data-dz-thumbnail class="thumbnail" />
        </div>
        <div class="col-md-3 image-table-col">
          <div class="dz-filename"><span data-dz-name></span></div>
        </div>
        <div class="col-md-2 image-table-col">
          <div class="dz-size" data-dz-size></div>
        </div>
        <div class="col-md-2 file-type image-table-col"> </div>
        <div class='col-md-3 image-table-col'>
          <div class='progress'>
            <div class='progress-bar progress-bar-striped active dz-upload' data-dz-uploadprogress role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div>
          </div>
        </div>
    </div>
  `
  // const previews = "<div class='row'><div class='col-md-2 dz-filename'><span data-dz-name></span></div><div class='col-md-2 dz-size' data-dz-size></div><div class='col-md-2'><div class='progress'><div class='progress-bar progress-bar-striped active dz-upload' data-dz-uploadprogress role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></div><div class='col-md-3 status'></div><div class='col-md-3 file-type'></div></div>"
  const dropzone = new Dropzone('#image-uploader', {
      url: apiUrl + '/images',
      paramName: 'image[file]',
      previewsContainer: '.upload-info',
      previewTemplate: previews,
      headers: {
        contentType: 'application/json',
        Authorization: 'Token token=' + store.user.token
      },
      maxFiles: 1,
      maxFilesize: 30,
  })
  dropzone.on('sending', function (file, xhr, formData) {
    const imageForm = document.forms.namedItem('image-details')
    const imageData = getFormFields(imageForm)
    formData.append("image[description]", imageData.image.description)
    formData.append("image[title]", imageData.image.title)
    formData.append("image[tags]", imageData.image.tags)
  })
  dropzone.on('success', function (file, response) {
    console.log('ransuccess')
    const previewElement = file.previewElement
    $(previewElement).find('div.progress').children().removeClass('progress-bar-striped').addClass('progress-bar-success').html('<span> 100% Complete </span>')
    $(previewElement).find('div.status').html('<span> Success </span>')
  })
  dropzone.on('error', function (file, errorMessage) {
    const previewElement = file.previewElement
    $(previewElement).find('div.progress').children().removeClass('progress-bar-striped').addClass('progress-bar-danger').css('width', '100%').html('<span> 0%</span>')
    $(previewElement).find('div.status').html('<span> Error </span>')
  })
  dropzone.on('complete', function (file) {
    console.log('complete sending')
    $(file.previewElement).find('div.file-type').html(file.type)
  })
  // end
  // storing view location to inform dom manipulation (e.g., nav button options)
  store.view = 'carousel'
  // end
}

const onSignInFailure = function () {
  notification.alert('danger', 'Login Unsuccessful')
}

const onSignUpSuccess = function () {
  notification.alert('success', 'Successfully Signed Up')
  $('#sign-up').hide()
  $('#login').show()
  // clearing sign up form on sign up success
  $('#sign-up-form').each(function () {
    this.reset()
  })
  // end
}

const onSignUpFailure = function () {
  notification.alert('danger', 'Sign Up Unsuccessful')
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
  notification.alert('success', 'Successfully Logged Out')
  $('#static-nav').hide()
  $('#auth-view').show()
  store.view = 'landing page'
}

const onLogOutFailure = () => {
  notification.alert('danger', 'Log-Out Unsuccessful')
}

const onChangePwdSuccess = () => {
  $('#change-pw-modal').modal('hide')
  // clearing change pwd form on success
  $('#change-pw-form').each(function () {
    this.reset()
  })
  // end
  notification.alert('success', 'Password Successfully Changed')
}

const onChangePwdFailure = () => {
  notification.alert('danger', 'Failed to Edit Password')
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
  // updating nav bar - END
  // populate images - START

  // filtering API response for user-owned images
  const personalImagesArr = apiResponse.images.filter(function (image) {
    return image._owner.email === store.user.email
  })
  // turn each tags array into a string for easy DOM reading
  for (let i = 0; i < personalImagesArr.length; i++) {
    personalImagesArr[i].tags = personalImagesArr[i].tags.join(' ')
  }
  // pass modified array with string for tags ro handlebars
  const myImagesReadout = templateMyImages({ images: personalImagesArr })
  $('#my-images-readout-wrapper').append(myImagesReadout)
  // using jquery to add correct image to each handlebars element
  for (let i = 0; i < apiResponse.images.length; i++) {
    $("div[data-id='image-" + apiResponse.images[i]._id + "']").css('background-image', 'url(' + apiResponse.images[i].url + ')')
  }
  // populate images - END
}

const populateCarouselSuccess = (apiResponse) => {
  // **NOTE** Need to pull user images out of the apiResponse eventually
  console.log('This will populate the carousel')
  // run images through handlebars
  console.log(apiResponse.images[0])
  const carouselReadout = templateCarousel({ images: apiResponse.images })
  // append to DOM
  $('#carousel-inner').append(carouselReadout)
}

const populateCarouselFailure = () => {
  console.log('This will not populate the carousel')
  notification.universalToast('error', 'Error!', 'Failed to populate carousel!')
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

const populateCarouselModalSuccess = (apiResponse) => {
  console.log(apiResponse.image)
  $('#single-title').text(apiResponse.image.title)
  $('#single-image').css('background-image', 'url(' + apiResponse.image.url + ')')
  $('#single-description').text(apiResponse.image.description)
  $('#single-owned-value').text(apiResponse.image._owner.email)
  if (apiResponse.image.tags.length > 0) {
    $('#single-tag-value').text(apiResponse.image.tags)
  }
}

const populateCarouselModalFailure = (apiResponse) => {
  notification.universalToast('error', 'Error!', 'Failed to populate modal!')
}

const toggleEditImageModalSuccess = (apiResponse) => {
  $('#edit-image-modal').modal('show')
  $('#title1').val(apiResponse.image.title)
  $('#description1').text(apiResponse.image.description)
  $('#tags1').val(apiResponse.image.tags.join(' '))
}

const toggleEditImageModalFailure = () => {
  notification.universalToast('error', 'Error!', 'Failed to load image!')
}

const editImageSuccess = () => {
  console.log('Edit worked!')
  console.log(store.recentEditedData)
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

const editImageFailure = () => {
  notification.universalToast('error', 'Error!', 'Failed to edit image!')
}

const noGeoTracking = () => {
  notification.universalToast('error', 'Sorry!', 'This app requires the use of location tracking. Please allow location tracking in order to proceed. If you already rejected our tracking request, you will need to reset that decision in your browser settings.')
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
  myImagesView,
  deleteImageSuccess,
  deleteImageFailure,
  populateCarouselSuccess,
  populateCarouselFailure,
  populateCarouselModalSuccess,
  populateCarouselModalFailure,
  toggleEditImageModalSuccess,
  toggleEditImageModalFailure,
  editImageSuccess,
  editImageFailure,
  noGeoTracking
}
