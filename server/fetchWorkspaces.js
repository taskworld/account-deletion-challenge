const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })

module.exports = functions.https.onRequest((request, response) =>
  cors(request, response, () => {
    if (request.method !== 'GET') {
      return response.sendStatus(405)
    }

    if (request.query.userId !== 'user1') {
      return response.send(404)
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
      deleteWorkspaces: [
        {
          spaceId: 'workspace3',
          displayName: 'Moon landing',
        },
      ],
    })
  })
)
