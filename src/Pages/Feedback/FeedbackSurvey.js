import { map, some, every, chain } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import KindaConnect from '../../Common/KindaConnect'

class FeedbackSurvey extends React.Component {
  constructor(props) {
    super(props)

    this.goToNextStep = props.goTo('/confirmation')
    this.goToPreviousStep = props.goTo('/transfer')
  }

  anyFeedbackItemChecked = () => {
    return some(this.props.feedbackList, (f) => {
      return f.isChecked
    })
  }

  onChangeFeedbackItemComment = (stack) => {
    return (e) => {
      this.props.onChangeFeedbackItemComment(stack, e.target.value)
    }
  }

  onClickFeedbackItem = (stack) => {
    return () => {
      this.props.onToggleFeedbackCheckbox(stack)
    }
  }

  onChangeFeedbackComment = (e) => {
    this.props.onChangeFeedbackComment(e.target.value)
  }

  renderInputForm({ stack, canComment, placeHolder, isChecked, comment }) {
    if (!isChecked || !canComment) return null

    const prefill = placeHolder && canComment ? placeHolder : ''

    return (
      <div>
        <input
          type='text'
          name={stack}
          ref={stack}
          placeholder={prefill}
          onChange={this.onChangeFeedbackItemComment(stack)}
          defaultValue={comment}
        />
      </div>
    )
  }

  renderCheckboxes = () => {
    return (
      <div>
        {map(this.props.feedbackList, (item, key) => (
          <div key={key}>
            <label>
              <input
                type='checkbox'
                defaultChecked={!!item.isChecked}
                onClick={this.onClickFeedbackItem(item.stack)}
              />
              {item.title}
            </label>
            {this.renderInputForm(item)}
          </div>
        ))}
      </div>
    )
  }

  renderCommentForm() {
    if (!this.props.showCommentForm) return null

    return (
      <div style={{ marginTop: '2rem' }}>
        Comments:
        <div>
          <textarea
            type='text'
            name='comment'
            style={{ border: '1px solid black' }}
            onChange={this.onChangeFeedbackComment}
            value={this.props.feedbackComment}
          />
        </div>
      </div>
    )
  }

  renderButtons() {
    return (
      <div>
        <button onClick={this.goToPreviousStep}>
          Back
        </button>
        <button onClick={this.goToNextStep} disabled={!this.anyFeedbackItemChecked()}>
          Next
        </button>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h1>Why would you leave us?</h1>
        {this.renderCheckboxes()}
        {this.renderCommentForm()}
        {this.renderButtons()}
      </div>
    )
  }
}

FeedbackSurvey.propTypes = {
  goTo: PropTypes.func,
  feedbackList: PropTypes.array,
  feedbackComment: PropTypes.string,
  showCommentForm: PropTypes.bool,

  onChangeFeedbackItemComment: PropTypes.func,
  onToggleFeedbackCheckbox: PropTypes.func,
  onChangeFeedbackComment: PropTypes.func,
}

const mapStateToProps = (state) => {
  return {
      feedbackList: state.feedback.feedbackList,
      feedbackComment: state.feedback.feedbackComment,
      showCommentForm: state.feedback.showCommentForm,

      // actions
      onChangeFeedbackItemComment: state.onChangeFeedbackItemComment,
      onToggleFeedbackCheckbox: state.onToggleFeedbackCheckbox,
      onChangeFeedbackComment: state.onChangeFeedbackComment,
   }
}

export default KindaConnect(mapStateToProps)(FeedbackSurvey)
