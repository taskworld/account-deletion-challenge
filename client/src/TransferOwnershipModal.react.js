import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

export const WorkspaceGroupRows = props => (
  <div>
    <h3>The following workspaces require ownership transfer:</h3>
    <div>
      {_.map(props.workspaces, workspace => (
        <div key={workspace.spaceId} style={{ marginTop: '1rem' }}>
          <span>Workspace: {workspace.displayName}</span>
          <span>
            {React.Children.count(props.children) === 0
              ? null
              : React.cloneElement(props.children, { workspace })}
          </span>
        </div>
      ))}
    </div>
  </div>
)

WorkspaceGroupRows.propTypes = {
  workspaces: PropTypes.array.isRequired,
  children: PropTypes.node,
}

const TransferOwnershipModal = props => {
  const renderLoading = () => <div>Loading...</div>
  return (
    <div>
      <h1>Transfer ownership</h1>
      <p>
        Before you leaving, it is required to transfer your tasks, projects and
        workspace admin rights to other person.
      </p>
      {props.loading ? renderLoading() : props.children}
      <button disabled={props.disabledNextPage} onClick={props.nextPage}>
        Next
      </button>
    </div>
  )
}

TransferOwnershipModal.propTypes = {
  onToggleShowModal: PropTypes.func,
  nextPage: PropTypes.func,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  disabledNextPage: PropTypes.bool,
}

export default TransferOwnershipModal
