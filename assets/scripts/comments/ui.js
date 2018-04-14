const editCommentSuccess = function () {
  $('#edit-comment-form').each(function () {
    this.reset()
  })
  $('#edit-comment-modal').modal('hide')
  notification.universalToast('success', 'Success!', 'Your comment was successfully updated!')
}

const editCommentFailure = function () {
  $('#edit-comment-form').each(function () {
    this.reset()
  })
  $('#edit-comment-modal').modal('hide')
  notification.universalToast('error', 'Failed Comment', 'Failed to post your comment. The server might be down; try again later!')
}

const addCommentSuccess = (apiResponse) => {
  const commentsArrLength = apiResponse.image.comments.length
  const index = commentsArrLength - 1
  $('#submit-comment-form').each(function () {
    this.reset()
  })
  $('#comments-wrapper').prepend('<div class="sample-comment" id="comment-template"><span id="new-comment">' + store.mostRecentComment + '</span><br /><span class="commentor-1">-</span><span class="commentor-1" id="new-commentor">' + store.user.email + '</span></div>')
  $('#comment-template').append('<button class="btn btn-default edit-comment-button" data-id="' + apiResponse.image.comments[index][0] + '" id="' + apiResponse.image.comments[index][2] + '">Edit</button>')
}

const populateEditModal = function (oldCommentText, oldCommentId) {
  $('#descr3').text(oldCommentText)
}

const addCommentFailure = () => {
  notification.universalToast('error', 'Failed Comment', 'Failed to post your comment. The server might be down; try again later!')
}
