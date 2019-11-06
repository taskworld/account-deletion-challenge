import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import ConfirmEmailModal from './ConfirmEmailModal.react'
import TransferOwnershipModal, {
  WorkspaceGroupRows,
} from './TransferOwnershipModal.react'
import FeedbackSurveyModal from './FeedbackSurveyModal.react'
import { submitToSurveyMonkeyDeleteAccount } from './SurveyService'
import * as LoadState from './LoadState'
import AssignOwnership from './AssignOwnership.react'

export default class TerminateModalFlow extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    requiredTransferWorkspaces: PropTypes.array,
    fetchRelatedWorkspaces: PropTypes.func,
    transferOwnership: PropTypes.func,
    terminateAccount: PropTypes.func,
    terminateAccountError: PropTypes.func,
    terminateAccountStatus: PropTypes.object,
    resetTerminateAccountStatus: PropTypes.func,
    rediectToHomepage: PropTypes.func,
  }

  state = {
    activeModal: 'transfer',
    transferData: [],
    feedbacks: [],
    comment: '',
    email: '',
  }

  componentDidMount() {
    this.props.fetchRelatedWorkspaces()
  }

  componentWillReceiveProps(nextProps) {
    if (LoadState.isLoaded(nextProps.terminateAccountStatus)) {
      this.props.rediectToHomepage()
    }
  }

  getTransferData = () => {
    const transferData = this.state.transferData
    const updateData = _.reduce(
      transferData,
      (result, assign) => {
        result.push(assign)
        return result
      },
      []
    )
    return updateData
  }

  assignToUser = (workspace, user) => {
    const assigns = _.reject(
      this.getTransferData(),
      assign => assign.workspaceId === workspace.spaceId
    )
    this.setState({
      transferData: [
        ...assigns,
        {
          workspaceId: workspace.spaceId,
          toUser: user,
          ...LoadState.pending,
        },
      ],
    })
  }

  getRefsValues(refs, refName) {
    const item = _.get(refs, refName, false)
    if (!item || _.isEmpty(item.refs)) return {}

    const keys = Object.keys(item.refs)
    const collection = []
    for (const key of keys) {
      const value = item.refs[key].value
      collection.push({ key, value })
    }
    return collection
  }

  submitSurvey = () => {
    const feedbackRefs = this.getRefsValues(this.refs, 'feedbackForm')
    const surveyPayload = {
      feedbackRefs,
      comment: '',
    }
    submitToSurveyMonkeyDeleteAccount(surveyPayload)
  }

  onSetNextPage = () => {
    if (this.state.activeModal === 'transfer') {
      this.setState({ activeModal: 'feedback' })
    } else if (this.state.activeModal === 'feedback') {
      const feedbackRefs = this.getRefsValues(this.refs, 'feedbackForm')
      this.setState({
        activeModal: 'confirm',
        feedbacks: _.map(feedbackRefs, ref => ({
          reason: ref.key,
          comment: ref.value,
        })),
      })
    }
    this.submitSurvey()
  }

  onGoToPreviousStep = () => {
    if (this.state.activeModal === 'feedback') {
      this.setState({ activeModal: 'transfer' })
    }
    if (this.state.activeModal === 'confirm') {
      this.setState({ activeModal: 'feedback' })
    }
  }

  onAssignToUser = (workspace, user) => {
    this.assignToUser(workspace, user)
  }

  onChangeComment = e => {
    this.setState({ comment: e.target.value })
  }

  onDeleteAccount = async () => {
    if (this.props.user.email === this.state.email) {
      const payload = {
        transferTargets: _.map(this.getTransferData(), assign => ({
          userId: assign.toUser._id,
          spaceId: assign.workspaceId,
        })),
        reason: this.state.feedbacks,
      }
      this.props.terminateAccount(payload)
    } else {
      const error = 'Invalid email'
      this.props.terminateAccountError(error)
    }
  }

  onTypeEmail = e => {
    this.setState({ email: e.target.value })
  }

  renderTransferModal() {
    const transferData = this.getTransferData()
    const totalAssigned = transferData.length
    const totalWorkspaceRequiredTransfer = this.props.requiredTransferWorkspaces
      .length
    const disabledNextPage =
      totalAssigned < totalWorkspaceRequiredTransfer || this.props.loading
    return (
      <TransferOwnershipModal
        nextPage={this.onSetNextPage}
        loading={this.props.loading}
        disabledNextPage={disabledNextPage}
      >
        <WorkspaceGroupRows
          workspaces={this.props.requiredTransferWorkspaces}
        >
          <AssignOwnership
            user={this.props.user}
            transferData={this.getTransferData()}
            onAssignToUser={this.onAssignToUser}
          />
        </WorkspaceGroupRows>
      </TransferOwnershipModal>
    )
  }

  render() {
    switch (this.state.activeModal) {
      case 'transfer':
        return this.renderTransferModal()
      case 'feedback':
        return (
          <FeedbackSurveyModal
            ref="feedbackForm"
            title="Why would you leave us?"
            onSubmit={this.onSetNextPage}
            onBackButton={this.onGoToPreviousStep}
            showCommentForm
            comment={this.state.comment}
            onChangeComment={this.onChangeComment}
          />
        )
      case 'confirm':
        return (
          <ConfirmEmailModal
            onClickToDelete={this.onDeleteAccount}
            onBackButton={this.onGoToPreviousStep}
            email={this.state.email}
            onTypeEmail={this.onTypeEmail}
            terminateAccountStatus={this.props.terminateAccountStatus}
            resetTerminateAccountStatus={this.props.resetTerminateAccountStatus}
          />
        )
    }
  }
}
