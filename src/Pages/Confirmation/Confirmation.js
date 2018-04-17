import { get, map, chain, reject } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import KindaConnect from '../../Common/KindaConnect'
import * as Statuses from '../../Statuses'

class Confirmation extends React.PureComponent {
  constructor(props) {
    super(props)

    this.goToPrevious = this.props.goTo('/feedback')
  }

  onTypeEmail = (e) => {
    this.props.onTypeEmail(e.target.value)
  }

  renderError = () => {
    if (Statuses.isError(this.props.status)) {
      return <span style={{ color: 'red' }}>{this.props.status.error}</span>
    }

    return null
  }

  renderFormInputPasssword = () => {
    return (
      <div>
        <input
          type='text'
          placeholder='ross@example.com'
          style={{ width: '350px' }}
          onChange={this.onTypeEmail}
          defaultValue={this.props.typedEmail}
          disabled={this.isFetching()}
        />
        {this.renderError()}
      </div>
    )
  }

  onClickReadConsequnces = (e) => {
    this.props.onClickReadConsequnces(e.target.checked)
  }

  isFetching = () => {
    return Statuses.isLoading(this.props.status)
  }

  shouldDisableDeleteButton = () => {
    return Statuses.isLoading(this.props.status) || !this.props.isCheckedReadConsequences || !this.props.typedEmail
  }

  onDeleteAccount = async () => {
    if (this.props.userEmail === this.props.typedEmail) {
      const payload = {
        transferTargets: map(this.props.transferList, t => ({
          userId: t.toUser._id,
          spaceId: t.workspaceId
        })),
        reason:
          map(reject(this.props.feedbackList, f => !f.isChecked),
            f => ({
              stack: f.stack,
              comment: f.comment
            })
          ),
        comment: this.props.feedbackComment,
      }
      this.props.terminateAccount(payload)
    } else {
      this.props.terminateAccountError('Invalid email')
    }
  }

  render() {
    return (
      <div>
        <h1>
          Delete account
        </h1>
        <p>
          This action cannot be undone.
        </p>
        <div>
          Please enter your email: {this.renderFormInputPasssword()}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>
            <input
              type='checkbox'
              defaultChecked={this.props.isCheckedReadConsequences}
              onClick={this.onClickReadConsequnces}
              disabled={this.isFetching()}
            />
            I understand the consequences.
          </label>
        </div>
        <div>
          <button onClick={this.goToPrevious} disabled={this.isFetching()}>
            Back
          </button>
          <button onClick={this.onDeleteAccount} disabled={this.shouldDisableDeleteButton()}>
            Delete my account
          </button>
        </div>
      </div>
    )
  }
}

Confirmation.propTypes = {
  typedEmail: PropTypes.string,
  feedbackList: PropTypes.array,
  feedbackComment: PropTypes.string,
  userEmail: PropTypes.string,
  status: Statuses.StatusPropTypes,
  isCheckedReadConsequences: PropTypes.bool,
  transferList: PropTypes.object,

  // actions
  onClickReadConsequnces: PropTypes.func,
  onTypeEmail: PropTypes.func,
  terminateAccount: PropTypes.func,
  terminateAccountError: PropTypes.func,
  rediectToHomepage: PropTypes.func,
}

const mapStateToProps = (state) => {
  return {
    typedEmail: state.confirmation.email,
    feedbackList: state.feedback.feedbackList,
    feedbackComment: state.feedback.feedbackComment,
    userEmail: state.user.email,
    status: state.confirmation.status,
    transferList: state.transfer.transferList,
    isCheckedReadConsequences: state.confirmation.isCheckedReadConsequences,

    // actions
    onClickReadConsequnces: state.onClickReadConsequnces,
    onTypeEmail: state.onTypeEmail,
    terminateAccount: state.terminateAccount,
    terminateAccountError: state.terminateAccountError,
    rediectToHomepage: state.rediectToHomepage,
  }
}

export default KindaConnect(mapStateToProps)(Confirmation)
