import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Swal from "sweetalert2";

import * as LoadState from "../LoadState";
import { submitToSurveyMonkeyDeleteAccount } from "../SurveyService";
import { feedbackSurveyItems } from "../constants/FeedbackSurveyItems";

class FeedbackSurveyModal extends React.Component {
  static propTypes = {
    onBackButton: PropTypes.func,
    title: PropTypes.node,
    onSurveySubmitSuccess: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      surveyItems: _.chain(feedbackSurveyItems)
        .map(item => [item.stack, false])
        .fromPairs()
        .value(),
      comment: "",
      surveyStatus: {}
    };
  }

  hasAllUnchecked = () => {
    return _.every(this.state.surveyItems, val => val === false);
  };

  onToggleFeedback(stack) {
    const { surveyItems } = this.state;
    surveyItems[stack] = !surveyItems[stack];
    this.setState({ surveyItems });
  }

  getValues() {
    const { surveyItems } = this.state;
    const keys = Object.keys(surveyItems);
    const collection = keys.reduce((acc, curr) => {
      if (surveyItems[curr]) {
        acc.push({ key: curr, value: surveyItems[curr] });
        return acc;
      }
      return acc;
    }, []);

    return collection;
  }

  onChangeComment = e => {
    this.setState({ comment: e.target.value });
  };

  onSurveySubmit = () => {
    const feedbacks = this.getValues();
    const surveyPayload = {
      feedbacks,
      comment: this.state.comment
    };

    this.setState({ surveyStatus: LoadState.pending });
    submitToSurveyMonkeyDeleteAccount(surveyPayload)
      .then(() => {
        this.setState({ surveyStatus: LoadState.completed });
        this.props.onSurveySubmitSuccess(surveyPayload);
      })
      .catch(error => Swal.fire({ title: "Error", text: error.message || "Something went wrong. Please try again later." }));
  };

  renderButtons() {
    return (
      <div>
        <button onClick={this.props.onBackButton}>Back</button>
        <button onClick={this.onSurveySubmit} disabled={this.hasAllUnchecked() || LoadState.isLoading(this.state.surveyStatus)}>
          Next
        </button>
      </div>
    );
  }

  renderCommentBox() {
    return (
      <div style={{ marginTop: "2rem" }}>
        Comments:
        <div>
          <textarea type="text" name="comment" onChange={this.onChangeComment} value={this.state.comment} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <div>
          {_.map(feedbackSurveyItems, (item, key) => (
            <div key={key}>
              <label>
                <input type="checkbox" checked={this.state.surveyItems[item.stack]} onClick={() => this.onToggleFeedback(item.stack)} />
                {item.title}
              </label>
            </div>
          ))}
        </div>
        {this.renderCommentBox()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default FeedbackSurveyModal;
