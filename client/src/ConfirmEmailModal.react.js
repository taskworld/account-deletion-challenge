import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import { isLoading } from './LoadState'

class ConfirmEmailModal extends React.PureComponent {
  static propTypes = {
    onClickToDelete: PropTypes.func,
    onBackButton: PropTypes.func,
    email: PropTypes.string,
    onTypeEmail: PropTypes.func,
    resetTerminateAccountStatus: PropTypes.func,
    terminateAccountStatus: PropTypes.object,
  }

  state = { markedConsequences: false }

  componentWillUnmount() {
    this.props.resetTerminateAccountStatus()
  }

  getStateButton = () => {
    if (isLoading(this.props.terminateAccountStatus)) return true
    if (this.state.markedConsequences && this.props.email) return false
    return true
  }

  onToggleMarkedConsequences = () => {
    this.setState({ markedConsequences: !this.state.markedConsequences })
  }

  renderFormInputPasssword = () => {
    const errorMessage = _.get(this.props.terminateAccountStatus, 'error', null)
    return (
      <div>
        <input
          type='text'
          placeholder='ross@example.com'
          style={{ width: '350px' }}
          onChange={this.props.onTypeEmail}
        />
        <span style={{ color: 'red' }}>
          {errorMessage}
        </span>
      </div>
    )
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
              checked={this.state.markedConsequences}
              onChange={this.onToggleMarkedConsequences}
            />
            I understand the consequences.
          </label>
        </div>
        <div>
          <button onClick={this.props.onBackButton}>
            Back
          </button>
          <button onClick={this.props.onClickToDelete} disabled={this.getStateButton()}>
            Delete my account
          </button>
        </div>
      </div>
    )
  }
}

export default ConfirmEmailModal
