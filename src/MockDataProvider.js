import PropTypes from 'prop-types'
import React from 'react'

import * as StateChanges from './StateChanges'
import * as Statuses from './Statuses'

export default class MockDataProvider extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      user: {
        _id: 'user1',
        name: 'Ross Lynch',
        email: 'ross@example.com'
      },
      transfer: {
        transferList: {},
        requiredTransferWorkspaces: [],
        deleteWorkspaces: [],
        status: { name: Statuses.STATUS.READY, error: null },
      },
      feedback: {
        feedbackList: [
          {
            stack: 'dont_understand',
            title: 'I do not understand how to use this.',
            canComment: false,
          },
          {
            stack: 'dont_need',
            title: 'I do not need this.',
            canComment: false,
          },
          {
            stack: 'prefer_other_apps',
            title: 'I prefer other apps.',
            canComment: false,
          },
          {
            stack: 'lack_features',
            title: 'I cannot find the features that I want.',
            canComment: false,
          },
          {
            stack: 'bugs',
            title: 'I found this had too many bugs.',
            canComment: false,
          },
          {
            stack: 'expensive',
            title: 'I found this was too expensive.',
            canComment: false,
          },
          {
            stack: 'slow',
            title: 'I found this was too slow.',
            canComment: false,
          },
          {
            stack: 'others',
            title: 'Other reason(s)...',
            placeHolder: 'Please specify',
            canComment: true,
          }
        ],
        feedbackComment: '',
        showCommentForm: true,
      },
      confirmation: {
        isCheckedReadConsequences: false,
        email: '',
        status: { name: Statuses.STATUS.READY, error: null },
      },

      onChangeFeedbackItemComment: (stack, value) => {
        this.setState(StateChanges.ON_CHANGE_FEEDBACK_ITEM_COMMENT(stack, value))
      },

      onChangeFeedbackComment: (value) => {
        this.setState(StateChanges.ON_CHANGE_FEEDBACK_COMMENT(value))
      },

      onToggleFeedbackCheckbox: (stack) => {
        this.setState(StateChanges.ON_TOGGLE_FEEDBACK_CHECKBOX(stack))
      },

      onAssignToUser: (workspace, user) => {
        this.setState(StateChanges.ON_ASSIGN_TO_USER(workspace, user))
      },

      onClickReadConsequnces: (value) => {
        this.setState(StateChanges.ON_CLICK_READ_CONSEQUENCES(value))
      },

      onTypeEmail: (email) => {
        this.setState(StateChanges.ON_TYPE_EMAIL(email))
      },

      fetchRelatedWorkspaces: () => {
        this.setState(StateChanges.FETCHING_RELATED_WORKSPACES, () => {
          // Simulate fetching requiredTransferWorkspaces, deleteWorkspaces, and transferableMembers from the server
          setTimeout(() => {
            if (Math.random() < 0.7) {
              this.setState(StateChanges.SUCCESS_FETCHING_RELATED_WORKSPACES)
            } else {
              this.setState(StateChanges.FAIL_FETCHING_RELATED_WORKSPACES('Error fetching related workspaces'))
            }

          }, 1500)
        })
      },

      terminateAccount: (payload) => {
        // Simulate sending payload to the server
        // Note that there is 30% chance of getting error from the server
        this.setState(StateChanges.REQUESTING_TERMINATING_ACCOUNT,
          () => {
          setTimeout(() => {
            if (Math.random() < 0.7) {
              this.setState(StateChanges.SUCCESS_TERMINATING_ACCOUNT)
            } else {
              this.state.terminateAccountError('Error deleting account')
            }
          }, 3000)
        })
      },

      terminateAccountError: (errorMsg) => {
        this.setState(StateChanges.ERROR_TERMINATING_ACCOUNT(errorMsg))
      },

      redirectToHomepage: () => {
        window.location = 'http://www.example.com/'
      },
    }
  }

  render() {
    return this.props.children(this.state)
  }
}