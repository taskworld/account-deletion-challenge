import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import { feedbackSurveyItems } from './FeedbackSurveyItems'

class FeedbackSurveyModal extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    onBackButton: PropTypes.func,
    title: PropTypes.node,
    comment: PropTypes.string,
    onChangeComment: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = _.chain(feedbackSurveyItems)
      .map(item => [item.stack, false])
      .fromPairs()
      .value()
  }

  hasAllUnchecked = () => {
    return _.every(this.state, val => val === false)
  }

  onToggleFeedback(stack) {
    this.setState(prevState => ({ [stack]: !prevState[stack] }))
  }

  renderButtons() {
    return (
      <div>
        <button onClick={this.props.onBackButton}>Back</button>
        <button onClick={this.props.onSubmit} disabled={this.hasAllUnchecked()}>
          Next
        </button>
      </div>
    )
  }

  renderCommentBox() {
    return (
      <div style={{ marginTop: '2rem' }}>
        Comments:
        <div>
          <textarea
            type="text"
            name="comment"
            onChange={this.props.onChangeComment}
            value={this.props.comment}
          />
        </div>
      </div>
    )
  }

  render() {
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
                  checked={this.state[item.stack]}
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
    )
  }
}

export default FeedbackSurveyModal
