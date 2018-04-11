const authHeader = {
  contentType: 'application/json',
  Authorization: 'Token token=' + store.user.token
}

const createComment = (packagedData) => {
  return $.ajax({
    url: apiUrl + '/add-comment/' + store.currentImageID,
    method: 'PATCH',
    headers: authHeader,
    data: packagedData
  })
}

const editComment = (packagedData) => {
  return $.ajax({
    url: apiUrl + '/edit-comment/' + store.currentImageID,
    method: 'PATCH',
    headers: authHeader,
    data: packagedData
  })
}

module.exports = {
  createComment,
  editComment
}
