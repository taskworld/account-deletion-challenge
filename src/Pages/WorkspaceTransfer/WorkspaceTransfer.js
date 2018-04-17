import React from 'react'
import PropTypes from 'prop-types'
import KindaConnect from '../../Common/KindaConnect'
import { WorkspaceGroupRows } from './WorkspaceGroupRows'
import * as Statuses from '../../Statuses'

class WorkspaceTransfer extends React.Component {

    constructor(props) {
        super(props)

        this.goToNextStep = props.goTo('/feedback')
    }

    componentDidMount() {
      if (Statuses.isReady(this.props.status)) {
        this.props.fetchRelatedWorkspaces()
      }
    }

    getDisabledNextPage = () => {
      const isRequiredTransferFilled = Object.keys(this.props.transferList).length < (this.props.requiredTransferWorkspaces || []).length
      return (Statuses.isLoading(this.props.status)
              || Statuses.isError(this.props.status))
              || isRequiredTransferFilled
              || Statuses.isLoading(this.props.status)
    }

    renderLoading = () => (
        <div>
          Loading...
        </div>
    )

    renderError = (errorMsg) => (
      <p style={{ color: 'red' }}>{errorMsg}</p>
    )

    renderRequiredTransferWorkspace = () => {
        if (Statuses.isLoading(this.props.status)) return this.renderLoading()
        if (Statuses.isError(this.props.status)) return this.renderError(this.props.status.error)

        const assignOwnershipProps = {
            transferList: this.props.transferList,
            onAssignToUser: this.props.onAssignToUser,
        }

        return (
            <WorkspaceGroupRows
                workspaces={this.props.requiredTransferWorkspaces || []}
                groupTitle='The following workspaces require ownership transfer:'
                assignOwnership={assignOwnershipProps}
            />
        )
    }

    renderWorkspaceToDelete = () => {
        if (Statuses.isLoading(this.props.status)) return null
        if (Statuses.isError(this.props.status)) return null

        return (
            <WorkspaceGroupRows
                workspaces={this.props.deleteWorkspaces || []}
                groupTitle='The following workspaces will be deleted:'
            />
        )
    }

    render() {
        return (
            <div>
                <h1>
                    Transfer ownership
                </h1>
                <p>
                    Before you leaving, it is required to transfer your tasks, projects and workspace admin rights to other person.
                </p>
                {this.renderRequiredTransferWorkspace()}
                {this.renderWorkspaceToDelete()}
                <button
                    disabled={this.getDisabledNextPage()}
                    onClick={this.goToNextStep}
                >
                    Next
                </button>
            </div>
        )
    }
}

WorkspaceTransfer.propTypes = {
  goTo: PropTypes.func,
  transferList: PropTypes.object,
  requiredTransferWorkspaces: PropTypes.array,
  deleteWorkspaces: PropTypes.array,
  status: Statuses.StatusPropTypes,

  fetchRelatedWorkspaces: PropTypes.func,
  onAssignToUser: PropTypes.func,
}

const mapStateToProps = (state) => {
    return {
        transferList: state.transfer.transferList,
        requiredTransferWorkspaces: state.transfer.requiredTransferWorkspaces,
        deleteWorkspaces: state.transfer.deleteWorkspaces,
        status: state.transfer.status,

        // actions
        onAssignToUser: state.onAssignToUser,
        fetchRelatedWorkspaces: state.fetchRelatedWorkspaces,
     }
}

export default KindaConnect(mapStateToProps)(WorkspaceTransfer)
