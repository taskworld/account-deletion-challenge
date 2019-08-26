import _ from 'lodash'
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
    user: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool,
    requiredTransferWorkspaces: React.PropTypes.array,
    deleteWorkspaces: React.PropTypes.array,
    fetchRelatedWorkspaces: React.PropTypes.func,
    transferOwnershipStatus: React.PropTypes.object,
    transferOwnership: React.PropTypes.func,
    terminateAccount: React.PropTypes.func,
    terminateAccountError: React.PropTypes.func,
    terminateAccountStatus: React.PropTypes.object,
    resetTerminateAccountStatus: React.PropTypes.func,
    redirectToHomepage: React.PropTypes.func,
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
      this.props.redirectToHomepage()
    }
  }

  getTransferData = () => {
    const {
      transferOwnershipStatus: { workspaceId, toUserId, status },
    } = this.props

    const { transferData } = this.state
    const updateData = _.reduce(
      transferData,
      (result, assign) => {
        if (
          assign.workspaceId === workspaceId &&
          assign.toUser._id === toUserId
        ) {
          result.push(Object.assign({}, assign, { status }))
        } else {
          result.push(assign)
        }
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
    const { activeModal } = this.state

    if (activeModal === 'transfer') {
      this.setState({ activeModal: 'feedback' })
    } else if (activeModal === 'feedback') {
      const feedbackRefs = this.getRefsValues(this.refs, 'feedbackForm')

      this.setState({
        activeModal: 'confirm',
        feedbacks: _.map(feedbackRefs, ref => ({
          reason: ref.key,
          comment: ref.value,
        })),
      })

      this.submitSurvey()
    }
  }

  onGoToPreviousStep = () => {
    const { activeModal } = this.state

    if (activeModal === 'feedback') {
      this.setState({ activeModal: 'transfer' })
    }
    if (activeModal === 'confirm') {
      this.setState({ activeModal: 'feedback' })
    }
  }

  onAssignToUser = async (workspace, user) => {
    const canTransfer = await this.props.transferOwnership(user, workspace)

    if (canTransfer) {
      this.assignToUser(workspace, user)
    } else {
      alert('This user cannot transfer')
    }
  }

  onChangeComment = e => {
    this.setState({ comment: e.target.value })
  }

  onDeleteAccount = async () => {
    const {
      user: { email: userEmail },
      terminateAccount,
      terminateAccountError,
    } = this.props
    const { email, feedbacks } = this.state

    if (userEmail === email) {
      const payload = {
        transferTargets: _.map(this.getTransferData(), assign => {
          const {
            toUser: { _id },
            workspaceId,
          } = assign

          return {
            userId: _id,
            spaceId: workspaceId,
          }
        }),
        reason: feedbacks,
      }
      terminateAccount(payload)
    } else {
      terminateAccountError('Invalid email')
    }
  }

  onTypeEmail = e => {
    this.setState({ email: e.target.value })
  }

  renderDeleteWorkSpace = () => {
    const { deleteWorkspaces } = this.props

    return (
      <WorkspaceGroupRows
        workspaces={deleteWorkspaces}
        groupTitle="The following workspaces will be deleted:"
        shouldDisplay={deleteWorkspaces.length > 0}
      />
    )
  }

  renderTransferModal() {
    const { requiredTransferWorkspaces, loading, user } = this.props
    const transferData = this.getTransferData()
    const totalWorkspaceRequiredTransfer = requiredTransferWorkspaces.length

    const disabledNextPage =
      transferData.length < totalWorkspaceRequiredTransfer || loading

    return (
      <TransferOwnershipModal
        nextPage={this.onSetNextPage}
        loading={loading}
        disabledNextPage={disabledNextPage}
      >
        <WorkspaceGroupRows
          workspaces={requiredTransferWorkspaces}
          groupTitle="The following workspaces require ownership transfer:"
          shouldDisplay={totalWorkspaceRequiredTransfer > 0}
        >
          <AssignOwnership
            user={user}
            transferData={transferData}
            onAssignToUser={this.onAssignToUser}
          />
        </WorkspaceGroupRows>

        {this.renderDeleteWorkSpace()}
      </TransferOwnershipModal>
    )
  }

  render() {
    const { terminateAccountStatus, resetTerminateAccountStatus } = this.props
    const { activeModal, comment, email } = this.state

    switch (activeModal) {
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
            comment={comment}
            onChangeComment={this.onChangeComment}
          />
        )
      case 'confirm':
        return (
          <ConfirmEmailModal
            onClickToDelete={this.onDeleteAccount}
            onBackButton={this.onGoToPreviousStep}
            email={email}
            onTypeEmail={this.onTypeEmail}
            terminateAccountStatus={terminateAccountStatus}
            resetTerminateAccountStatus={resetTerminateAccountStatus}
          />
        )
    }
  }
}
