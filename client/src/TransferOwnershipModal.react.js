import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

export const WorkspaceGroupRows = props => {
  const { shouldDisplay, groupTitle, workspaces, children } = props

  return !shouldDisplay ? null : (
    <div>
      <h3>{groupTitle}</h3>
      <div>
        {_.map(workspaces, workspace => {
          const { spaceId, displayName } = workspace

          return (
            <div key={spaceId} style={{ marginTop: '1rem' }}>
              <span>Workspace: {displayName}</span>
              <span>
                {React.Children.count(children) === 0
                  ? null
                  : React.cloneElement(children, { workspace })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
WorkspaceGroupRows.propTypes = {
  groupTitle: PropTypes.string,
  workspaces: PropTypes.array.isRequired,
  children: PropTypes.node,
  shouldDisplay: PropTypes.bool,
}

export const TransferOwnershipModal = props => {
  const { loading, children, disabledNextPage, nextPage } = props

  return (
    <div>
      <h1>Transfer ownership</h1>
      <p>
        Before you leaving, it is required to transfer your tasks, projects and
        workspace admin rights to other person.
      </p>
      {loading ? <div>Loading...</div> : children}
      <button disabled={disabledNextPage} onClick={nextPage}>
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
