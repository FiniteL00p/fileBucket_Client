const ui = require('./ui')

const commentHandlers = function() {
  $('#submit-comment-form').on('submit', onAddComment)
  $('#edit-comment-form').on('submit', onSubmitComment)
  $('body').on('click', '.edit-comment-button', onToggleEditComment)
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
  commentHandlers
}
