import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import WorkspaceGroupRows from "./WorkspaceGroupRows.react";
import AssignOwnership from "./AssignOwnership.react";

const TransferOwnershipModal = props => {
  const renderLoading = () => <div>Loading...</div>;
  return (
    <div>
      <h1>Transfer ownership</h1>
      <p>Before you leaving, it is required to transfer your tasks, projects and workspace admin rights to other person.</p>
      {props.loading ? (
        renderLoading()
      ) : (
        <WorkspaceGroupRows workspaces={props.workspaces}>
          <AssignOwnership user={props.user} transferData={props.transferData()} onAssignToUser={props.onAssignToUser} />
        </WorkspaceGroupRows>
      )}
      <button disabled={props.disabledNextPage} onClick={props.nextPage}>
        Next
      </button>
    </div>
  );
};

TransferOwnershipModal.propTypes = {
  workspaces: PropTypes.array,
  nextPage: PropTypes.func,
  loading: PropTypes.bool,
  disabledNextPage: PropTypes.bool,
  transferData: PropTypes.func,
  onAssignToUser: PropTypes.func,
  user: PropTypes.object
};

export default TransferOwnershipModal;
