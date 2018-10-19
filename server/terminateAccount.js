const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const _ = require('lodash')

module.exports = functions.https.onRequest((request, response) =>
  cors(request, response, () => {
    if (request.method !== 'POST') {
      return response.sendStatus(405)
    }

    if (
      !_.isArray(request.body.transferTargets) ||
      _.some(
        request.body.transferTargets,
        assign => !assign.userId || !assign.spaceId
      )
    ) {
      return response.sendStatus(400)
    }

    setTimeout(() => {
      if (Math.random() <= 0.3) {
        response.sendStatus(409)
      } else {
        response.sendStatus(200)
      }
    }, 3000)
  })
)
