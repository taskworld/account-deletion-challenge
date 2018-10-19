const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })

module.exports = functions.https.onRequest((request, response) => cors(request, response, () => {
  if (request.method !== 'POST') {
    return response.sendStatus(405)
  }

  if (!request.body.workspaceId || !request.body.fromUserId || !request.body.toUserId) {
    return response.sendStatus(400)
  }

  if (request.body.toUserId === 'user4') {
    response.sendStatus(409)
  } else {
    response.sendStatus(200)
  }
}))
