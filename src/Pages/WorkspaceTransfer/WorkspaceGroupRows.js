import { size, map } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import AssignOwnership from './AssignOwnerShip'

const renderAssignOwnerShip = (workspace, assignOwnership) => {
    if (!assignOwnership) return null

    return (
        <AssignOwnership
            transferData={assignOwnership.transferList}
            onAssignToUser={assignOwnership.onAssignToUser}
            workspace={workspace}
        />
    )
}

export const WorkspaceGroupRows = (props) => {
    if (size(props.workspace)) return null

    return (
        <div>
            <h3>
            {props.groupTitle}
            </h3>
            <div>
            {map(props.workspaces, (workspace) => (
                <div key={workspace.spaceId} style={{ marginTop: '1rem' }}>
                <span>
                    Workspace: {workspace.displayName}
                </span>
                <span>
                    {renderAssignOwnerShip(workspace, props.assignOwnership)}
                </span>
                </div>
            ))}
            </div>
        </div>
    )
}

WorkspaceGroupRows.propTypes = {
  groupTitle: PropTypes.string,
  workspaces: PropTypes.array.isRequired,
  children: PropTypes.node,

  assignOwnership: PropTypes.shape({
    transferList: PropTypes.object,
    onAssignToUser: PropTypes.func,
  })
}