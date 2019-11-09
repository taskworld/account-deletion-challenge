import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Swal from "sweetalert2";

import ConfirmEmailModal from "./components/ConfirmEmailModal.react";
import TransferOwnershipModal from "./components/TransferOwnershipModal.react";
import FeedbackSurveyModal from "./components/FeedbackSurveyModal.react";
import { submitToSurveyMonkeyDeleteAccount } from "./SurveyService";
import * as LoadState from "./LoadState";

export default class TerminateModalFlow extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  state = {
    activeModal: "transfer",

    loading: true,
    requiredTransferWorkspaces: [],
    transferableMembers: [],

    transferData: [],
    feedbacks: []
  };

  async componentDidMount() {
    let data;
    try {
      const response = await window.fetch(
        `https://us-central1-tw-account-deletion-challenge.cloudfunctions.net/fetchWorkspaces?userId=${this.props.user._id}`,
        {
          mode: "cors"
        }
      );
      data = await response.json();
    } catch (ex) {
      Swal.fire({ title: "Error", text: "Something went wrong. Please try again later" });
      return;
    }
    this.setState({
      loading: false,
      requiredTransferWorkspaces: data.requiredTransferWorkspaces
    });
  }

  getTransferData = () => {
    const transferData = this.state.transferData;
    const updateData = _.reduce(
      transferData,
      (result, assign) => {
        result.push(assign);
        return result;
      },
      []
    );
    return updateData;
  };

  onAssignToUser = (workspace, user) => {
    const assigns = _.reject(this.getTransferData(), assign => assign.workspaceId === workspace.spaceId);
    this.setState({
      transferData: [
        ...assigns,
        {
          workspaceId: workspace.spaceId,
          toUser: user,
          ...LoadState.pending
        }
      ]
    });
  };

  onSurveySubmitSuccess = ({ feedbacks, comment }) => {
    this.setState({ feedbacks, comment });
    this.onSetNextPage();
  };

  onSetNextPage = () => {
    if (this.state.activeModal === "transfer") {
      this.setState({ activeModal: "feedback" });
    } else if (this.state.activeModal === "feedback") {
      this.setState({ activeModal: "confirm" });
    }
  };

  onGoToPreviousStep = () => {
    if (this.state.activeModal === "feedback") {
      this.setState({ activeModal: "transfer" });
    }
    if (this.state.activeModal === "confirm") {
      this.setState({ activeModal: "feedback" });
    }
  };

  renderTransferModal() {
    const transferData = this.getTransferData();
    const totalAssigned = transferData.length;
    const totalWorkspaceRequiredTransfer = this.state.requiredTransferWorkspaces.length;
    const disabledNextPage = totalAssigned < totalWorkspaceRequiredTransfer || this.state.loading;
    return (
      <TransferOwnershipModal
        nextPage={this.onSetNextPage}
        loading={this.state.loading}
        disabledNextPage={disabledNextPage}
        transferData={this.getTransferData}
        onAssignToUser={this.onAssignToUser}
        user={this.state.user}
        workspaces={this.state.requiredTransferWorkspaces}
      />
    );
  }

  render() {
    switch (this.state.activeModal) {
      case "transfer":
        return this.renderTransferModal();
      case "feedback":
        return (
          <FeedbackSurveyModal
            title="Why would you leave us?"
            onBackButton={this.onGoToPreviousStep}
            onSurveySubmitSuccess={this.onSurveySubmitSuccess}
          />
        );
      case "confirm":
        return (
          <ConfirmEmailModal
            onBackButton={this.onGoToPreviousStep}
            user={this.props.user}
            getTransferData={this.getTransferData}
            feedbacks={this.state.feedbacks}
          />
        );
    }
  }
}
