import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import { feedbackSurveyItems } from './FeedbackSurveyItems'

class FeedbackSurveyModal extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    onBackButton: PropTypes.func,
    title: PropTypes.node,
    showCommentForm: PropTypes.bool,
    comment: PropTypes.string,
    onChangeComment: PropTypes.func,
  }

  constructor(props) {
    super(props)

    const initialState = _.chain(feedbackSurveyItems)
      .map(item => [item.stack, false])
      .fromPairs()
      .value()

    this.state = {
      ...initialState,
      isFocusCommentBox: false,
    }
  }

  hasAllUnchecked = () => {
    return _.every(this.state, val => val === false) && true
  }

  onToggleFeedback(stack) {
    this.setState(state => ({ [stack]: !state[stack] }))
  }

  renderInputForm({ stack, canComment, placeHolder }) {
    const prefill = placeHolder && canComment ? placeHolder : ''
    return !this.state[stack] ? null : (
      <div style={!canComment ? { display: 'none' } : null}>
        <input type="text" name={stack} ref={stack} placeholder={prefill} />
      </div>
    )
  }

  renderCommentForm() {
    const { showCommentForm, onChangeComment, comment } = this.props

    if (!showCommentForm) return

    return (
      <div style={{ marginTop: '2rem' }}>
        Comments:
        <div>
          <textarea
            type="text"
            name="comment"
            onChange={onChangeComment}
            value={comment}
          />
        </div>
      </div>
    )
  }

  render() {
    const { title, onBackButton, onSubmit } = this.props
    const disableStatus = this.hasAllUnchecked()

    return (
      <div>
        <h1>{title}</h1>
        <div>
          {_.map(feedbackSurveyItems, (item, key) => {
            const { stack, title } = item
            const checkedStatus = this.state[stack]

            return (
              <div key={key}>
                <label>
                  <input
                    type="checkbox"
                    checked={checkedStatus}
                    onClick={() => this.onToggleFeedback(stack)}
                  />
                  {title}
                </label>

                {this.renderInputForm(item)}
              </div>
            )
          })}
        </div>

        {this.renderCommentForm()}

        <div>
          <button onClick={onBackButton}>Back</button>
          <button onClick={onSubmit} disabled={disableStatus}>
            Next
          </button>
        </div>
      </div>
    )
  }
}

export default FeedbackSurveyModal
