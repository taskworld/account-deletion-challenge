import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import * as LoadState from './LoadState'

export default class AssignOwnership extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    workspace: PropTypes.object,
    transferData: PropTypes.array,
    onAssignToUser: PropTypes.func,
  }

  getAddedMember() {
    const { workspace, transferData } = this.props

    return _.chain(transferData)
      .reject(LoadState.isError || LoadState.isLoading)
      .find(assign => assign.workspaceId === workspace.spaceId)
      .get('toUser._id', '')
      .value()
  }

  onAssignToUser = e => {
    const { onAssignToUser, workspace } = this.props
    const user = workspace.transferableMembers.find(
      user => user._id === e.target.value
    )

    onAssignToUser(workspace, user)
  }

  render() {
    const { workspace } = this.props

    return (
      <div style={{ textDecoration: 'underline', cursor: 'pointer' }}>
        <select
          value={this.getAddedMember()}
          onChange={this.onAssignToUser}
          style={{ minWidth: '3rem' }}
        >
          <option value="" disabled />
          {workspace.transferableMembers.map(user => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    )
  }
}
