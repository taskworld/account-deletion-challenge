const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const sleep = require('./sleep')

module.exports = functions.https.onRequest((request, response) =>
  cors(request, response, async () => {
    if (request.method !== 'GET') {
      return response.sendStatus(405)
    }

    if (request.query.userId !== 'user1') {
      return response.sendStatus(404)
    }

    // Simulate an internal server error
    if (Math.random() <= 0.1) {
      return response.sendStatus(500)
    }

    // Simulate a slowness
    if (Math.random() <= 0.5) {
      await sleep(3000)
    }

    response.send({
      requiredTransferWorkspaces: [
        {
          spaceId: 'workspace1',
          displayName: 'Lightning strike',
          transferableMembers: [
            {
              _id: 'user2',
              name: 'Ryan Lynch',
            },
            {
              _id: 'user3',
              name: 'Riker Lynch',
            },
            {
              _id: 'user4',
              name: 'Rydel Lynch',
            },
          ],
        },
        {
          spaceId: 'workspace2',
          displayName: 'Time machine',
          transferableMembers: [
            {
              _id: 'user5',
              name: 'Edward Bayer',
              workspaceId: 'workspace3',
            },
            {
              _id: 'user6',
              name: 'Eli Brook',
              workspaceId: 'workspace3',
            },
          ],
        },
      ],
    })
  })
)
