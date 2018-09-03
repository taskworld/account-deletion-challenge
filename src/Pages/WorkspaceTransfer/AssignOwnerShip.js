import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

export default class AssignOwnership extends React.Component {
  static propTypes = {
    workspace: PropTypes.object,
    transferList: PropTypes.array,
    onAssignToUser: PropTypes.func,
  }

  defaultSelectedUser = () => {
    const { workspace, transferData } = this.props
    return _.chain(transferData)
      .find(t => t.workspaceId === workspace.spaceId)
      .get('toUser._id', '')
      .value()
  }

  onChangeUser = (e) => {
    const user = this.props.workspace.transferableMembers.find(user => user._id === e.target.value)
    this.props.onAssignToUser(this.props.workspace, user)
  }

  render() {
    return (
      <div style={{ textDecoration: 'underline', cursor: 'pointer' }}>
        <select
          value={this.defaultSelectedUser()}
          onChange={this.onChangeUser}
          style={{ minWidth: '3rem' }}
        >
          <option value='' disabled></option>
          {this.props.workspace.transferableMembers.map(user =>
            <option key={user._id} value={user._id}>{user.name}</option>
          )}
        </select>
      </div>
    )
  }
}
