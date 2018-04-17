import { map } from 'lodash'
import * as Statuses from './Statuses'

// For the sake of better readability

export const REQUESTING_TERMINATING_ACCOUNT = (currentState) => {
    return {
        confirmation: {
            ...currentState.confirmation,
            status: { name: Statuses.STATUS.LOADING, error: null },
        }
    }
}

export const SUCCESS_TERMINATING_ACCOUNT = (currentState) => {
    return {
        confirmation: {
            ...currentState.confirmation,
            status: { name: Statuses.STATUS.SUCCESS, error: null },
        }
    }
}

export const ERROR_TERMINATING_ACCOUNT = (errorMsg) => (currentState) => {
    return {
        confirmation: {
            ...currentState.confirmation,
            status: { name: Statuses.STATUS.ERROR, error: errorMsg },
        }
    }
}

export const FAIL_FETCHING_RELATED_WORKSPACES = (errorMsg) => (currentState) => {
    return {
        transfer: {
            ...currentState.transfer,
            status: { name: Statuses.STATUS.ERROR, error: errorMsg },
        }
    }
}

export const FETCHING_RELATED_WORKSPACES = (currentState) => {
  return {
    transfer: {
      ...currentState.transfer,
      status: { name: Statuses.STATUS.LOADING, error: null },
    }
  }
}

export const SUCCESS_FETCHING_RELATED_WORKSPACES = (currentState) => {
    return {
        transfer: {
          ...currentState.transfer,
          status: { name: Statuses.STATUS.SUCCESS, error: null },
          requiredTransferWorkspaces: [
            {
              spaceId: 'workspace1',
              displayName: 'Lightning strike',
              transferableMembers: [
                {
                  _id: 'user2',
                  name: 'Ryan Lynch'
                },
                {
                  _id: 'user3',
                  name: 'Riker Lynch'
                },
                {
                  _id: 'user4',
                  name: 'Rydel Lynch'
                }
              ]
            },
            {
              spaceId: 'workspace2',
              displayName: 'Time machine',
              transferableMembers: [
                {
                  _id: 'user5',
                  name: 'Edward Bayer',
                  workspaceId: 'workspace3'
                },
                {
                  _id: 'user6',
                  name: 'Eli Brook',
                  workspaceId: 'workspace3'
                }
              ]
            }
          ],
          deleteWorkspaces: [
            {
              spaceId: 'workspace3',
              displayName: 'Moon landing'
            }
          ]
        }
    }
}

export const ON_TYPE_EMAIL = (email) => (currentState) => {
    return {
        confirmation: {
          ...currentState.confirmation,
          email,
        }
    }
}

export const ON_CLICK_READ_CONSEQUENCES = (value) => (currentState) => {
    return {
        confirmation: {
          ...currentState.confirmation,
          isCheckedReadConsequences: value,
        },
    }
}

export const ON_ASSIGN_TO_USER = (workspace, user) => (currentState) => {
    return {
        transfer: {
          ...currentState.transfer,
          transferList: {
            ...currentState.transfer.transferList,
            [workspace.spaceId]: {
              workspaceId: workspace.spaceId,
              toUser: user,
              status: { name: Statuses.STATUS.READY, error: null }
            },
          },
        },
    }
}

export const ON_TOGGLE_FEEDBACK_CHECKBOX = (stack) => (currentState) => {
    return {
        feedback: {
          ...currentState.feedback,
          feedbackList:
            map(currentState.feedback.feedbackList, f => {
              if (f.stack !== stack) return f

              return {
                ...f,
                isChecked: !f.isChecked,
              }
            }
          ),
        },
    }
}

export const ON_CHANGE_FEEDBACK_COMMENT = (value) => (currentState) => {
    return {
        feedback: {
          ...currentState.feedback,
          feedbackComment: value,
        },
    }
}

export const ON_CHANGE_FEEDBACK_ITEM_COMMENT = (stack, value) => (currentState) => {
    return {
        feedback: {
          ...currentState.feedback,
          feedbackList:
            map(currentState.feedback.feedbackList, f => {
              if (f.stack !== stack) return f

              return {
                ...f,
                comment: value,
              }
            }
          ),
        },
    }
}
