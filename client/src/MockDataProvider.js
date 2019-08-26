import PropTypes from 'prop-types'
import React from 'react'

import * as LoadState from './LoadState'

function postData(url = '', data = {}) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  }).then(response =>
    typeof response === 'object' ? response : response.json()
  )
}

export default class MockDataProvider extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      user: {
        _id: 'user1',
        name: 'Ross Lynch',
        email: 'ross@example.com',
      },

      transferableMembers: [],

      loading: true,

      // Get work space data
      requiredTransferWorkspaces: [],
      deleteWorkspaces: [],
      fetchRelatedWorkspaces: async () => {
        const data = await fetch(
          `https://us-central1-tw-account-deletion-challenge.cloudfunctions.net/fetchWorkspaces?userId=${this.state.user._id}`,
          {
            mode: 'cors',
          }
        ).then(response => response.json())

        const { requiredTransferWorkspaces, deleteWorkspaces } = data

        this.setState({
          loading: false,
          requiredTransferWorkspaces,
          deleteWorkspaces,
        })
      },

      // Transfer section
      transferOwnershipStatus: {
        workspaceId: null,
        toUserId: null,
        ...LoadState.pending,
      },
      transferOwnership: async (user, workspace) => {
        this.setState({
          transferOwnershipStatus: {
            workspaceId: workspace.spaceId,
            toUserId: this.state.user._id,
            ...LoadState.loading,
          },
        })

        const response = await postData(
          'https://us-central1-tw-account-deletion-challenge.cloudfunctions.net/checkOwnership',
          {
            workspaceId: workspace.spaceId,
            fromUserId: this.state.user._id,
            toUserId: user._id,
          }
        )

        if (response.status === 200) {
          this.setState({
            transferOwnershipStatus: {
              workspaceId: workspace.spaceId,
              toUserId: user._id,
              ...LoadState.completed,
            },
          })

          return true
        } else {
          this.setState({
            transferOwnershipStatus: {
              workspaceId: workspace.spaceId,
              toUserId: user._id,
              ...LoadState.error,
            },
          })

          return false
        }
      },

      // Terminate section
      terminateAccountStatus: {},
      terminateAccount: async payload => {
        // Note that there is 30% chance of getting error from the server

        const response = await postData(
          'https://us-central1-tw-account-deletion-challenge.cloudfunctions.net/terminateAccount',
          payload
        )

        if (response.status === 200) {
          this.setState(state => ({
            terminateAccountStatus: LoadState.handleLoaded(
              state.terminateAccountStatus
            ),
          }))
        } else {
          this.setState(state => ({
            terminateAccountStatus: LoadState.handleLoadFailedWithError(
              'Error deleting account'
            )(state.terminateAccountStatus),
          }))
        }
      },

      terminateAccountError: error => {
        this.setState(state => ({
          terminateAccountStatus: LoadState.handleLoadFailedWithError(error)(
            state.terminateAccountStatus
          ),
        }))
      },

      resetTerminateAccountStatus: () => {
        this.setState({
          terminateAccountStatus: LoadState.pending,
        })
      },

      redirectToHomepage: () => {
        window.location = 'http://www.example.com/'
      },
    }
  }

  render() {
    return this.props.children(this.state)
  }
}
