import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";

import * as LoadState from "../LoadState";

class ConfirmEmailModal extends React.PureComponent {
  static propTypes = {
    onBackButton: PropTypes.func,
    email: PropTypes.string,
    getTransferData: PropTypes.func,
    feedbacks: PropTypes.array
  };

  state = { markedConsequences: false, email: "", terminateAccountStatus: {} };

  getButtonState = () => {
    if (LoadState.isLoading(this.state.terminateAccountStatus)) return true;
    if (this.state.markedConsequences && this.state.email) return false;
    return true;
  };

  onToggleMarkedConsequences = () => {
    this.setState({ markedConsequences: !this.state.markedConsequences });
  };

  onTypeEmail = e => {
    this.setState({ email: e.target.value });
  };

  renderFormInputPassword = () => {
    const errorMessage = _.get(this.state.terminateAccountStatus, "error", null);
    return (
      <div>
        <input type="text" placeholder="ross@example.com" style={{ width: "350px" }} onChange={this.onTypeEmail} />
        <span style={{ color: "red" }}>{errorMessage}</span>
      </div>
    );
  };

  setError = message => {
    this.setState({
      terminateAccountStatus: LoadState.handleLoadFailedWithError(message)
    });
  };

  onDeleteAccount = async () => {
    if (this.props.user.email === this.state.email) {
      this.setState({ terminateAccountStatus: LoadState.pending });
      const payload = {
        transferTargets: _.map(this.props.getTransferData(), assign => ({
          userId: assign.toUser._id,
          spaceId: assign.workspaceId
        })),
        reason: this.props.feedbacks
      };

      // Note that there is 30% chance of getting error from the server
      const response = await window
        .fetch("https://us-central1-tw-account-deletion-challenge.cloudfunctions.net/terminateAccount", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
        .catch(() => {
          this.setError("Error deleting account");
        });

      if (response.status === 200) {
        this.setState({
          terminateAccountStatus: LoadState.handleLoaded(this.state.terminateAccountStatus)
        });
        window.location = "http://www.example.com/";
      } else {
        this.setError("Error deleting account");
      }
    } else {
      this.setError("Invalid email");
    }
  };

  render() {
    const { onBackButton } = this.props;
    return (
      <div>
        <h1>Delete account</h1>
        <p>This action cannot be undone.</p>
        <div>Please enter your email: {this.renderFormInputPassword()}</div>
        <div style={{ marginTop: "1rem" }}>
          <label>
            <input type="checkbox" checked={this.state.markedConsequences} onChange={this.onToggleMarkedConsequences} />I understand the consequences.
          </label>
        </div>
        <div>
          <button onClick={onBackButton}>Back</button>
          <button onClick={this.onDeleteAccount} disabled={this.getButtonState()}>
            Delete my account
          </button>
        </div>
      </div>
    );
  }
}

export default ConfirmEmailModal;
