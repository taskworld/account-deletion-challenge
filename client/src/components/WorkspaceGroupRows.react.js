import React from "react";
import PropTypes from "prop-types";

const WorkspaceGroupRows = ({ workspaces, children }) => (
  <div>
    <h3>The following workspaces require ownership transfer:</h3>
    <div>
      {workspaces.map(workspace => (
        <div key={workspace.spaceId} style={{ marginTop: "1rem" }}>
          <span>Workspace: {workspace.displayName}</span>
          <span>{React.Children.count(children) === 0 ? null : <children.type {...children.props} workspace={workspace} />}</span>
        </div>
      ))}
    </div>
  </div>
);

WorkspaceGroupRows.propTypes = {
  workspaces: PropTypes.array.isRequired,
  children: PropTypes.node
};

export default WorkspaceGroupRows;
