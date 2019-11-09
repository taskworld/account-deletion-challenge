import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Swal from "sweetalert2";

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
      comment: ""
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

  getRefsValues() {
    const keys = Object.keys(this.refs);
    const collection = [];
    for (const key of keys) {
      const value = this.refs[key].checked;
      if (value) {
        collection.push({ key, value });
      }
    }
    return collection;
  }

  onChangeComment = e => {
    this.setState({ comment: e.target.value });
  };

  onSurveySubmit = () => {
    const feedbackRefs = this.getRefsValues();
    const surveyPayload = {
      feedbacks: feedbackRefs,
      comment: this.state.comment
    };
    submitToSurveyMonkeyDeleteAccount(surveyPayload)
      .then(() => {
        this.props.onSurveySubmitSuccess(surveyPayload);
      })
      .catch(error => Swal.fire({ title: "Error", text: error.message || "Something went wrong. Please try again later." }));
  };

  renderButtons() {
    return (
      <div>
        <button onClick={this.props.onBackButton}>Back</button>
        <button onClick={this.onSurveySubmit} disabled={this.hasAllUnchecked()}>
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
    console.log(this.state.surveyItems);
    return (
      <div>
        <h1>{this.props.title}</h1>
        <div>
          {_.map(feedbackSurveyItems, (item, key) => (
            <div key={key}>
              <label>
                <input
                  type="checkbox"
                  ref={item.stack}
                  checked={this.state.surveyItems[item.stack]}
                  onClick={() => this.onToggleFeedback(item.stack)}
                />
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
