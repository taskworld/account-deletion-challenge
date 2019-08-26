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
    const { terminateAccountStatus, email } = this.props

    if (isLoading(terminateAccountStatus)) return true
    if (this.state.markedConsequences && email) return false

    return true
  }

  onToggleMarkedConsequences = () => {
    this.setState(state => ({ markedConsequences: !state.markedConsequences }))
  }

  renderFormInputPassword = () => {
    const { terminateAccountStatus, onTypeEmail } = this.props
    const errorMessage = _.get(terminateAccountStatus, 'error', null)

    return (
      <div>
        <input
          type="text"
          placeholder="ross@example.com"
          style={{ width: '350px' }}
          onChange={onTypeEmail}
        />
        <span style={{ color: 'red' }}>{errorMessage}</span>
      </div>
    )
  }

  render() {
    const { onBackButton, onClickToDelete } = this.props
    const { markedConsequences } = this.state

    return (
      <div>
        <h1>Delete account</h1>
        <p>This action cannot be undone.</p>
        <div>Please enter your email: {this.renderFormInputPassword()}</div>
        <div style={{ marginTop: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={markedConsequences}
              onChange={this.onToggleMarkedConsequences}
            />
            I understand the consequences.
          </label>
        </div>
        <div>
          <button onClick={onBackButton}>Back</button>
          <button onClick={onClickToDelete} disabled={this.getStateButton()}>
            Delete my account
          </button>
        </div>
      </div>
    )
  }
}

export default ConfirmEmailModal
