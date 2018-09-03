import React from 'react'
import { shallow, mount } from 'enzyme'
import { forEach } from 'lodash'
import StatusToRedirect from '../../StatusToRedirect'
import * as Statuses from '../../Statuses'
import FeedbackSurvey from './FeedbackSurvey'

describe('checkboxes', () => {
  it('should render checkbox feedback list from props', () => {
    const props = {
      feedback: {
        feedbackList: [
          {
            stack: 'dont_understand',
            title: 'I do not understand how to use this.',
            canComment: false,
            isChecked: false,
          },
          {
            stack: 'dont_need',
            title: 'I do not need this.',
            canComment: false,
            isChecked: true,
          },
          {
            stack: 'others',
            title: 'Other reason(s)...',
            placeHolder: 'Please specify',
            canComment: true,
            comment: 'comment',
            isChecked: true,
          }
        ],
        feedbackComment: '',
        showCommentForm: true,
      },
      onChangeFeedbackItemComment: jest.fn(),
      onToggleFeedbackCheckbox: jest.fn(),
      onChangeFeedbackComment: jest.fn(),
      goTo: jest.fn(),
    }
    const wrapper = mount(<FeedbackSurvey {...props}/>)
    const checkboxes = wrapper.childAt(1)

    const checkboxesChildren = checkboxes.children()

    forEach(props.feedback.feedbackList, (f, i) => {
      expect(checkboxes.childAt(i).find('label > input').prop('defaultChecked')).toBe(f.isChecked)
      expect(checkboxes.childAt(i).text()).toBe(f.title)

      if (f.canComment) {
        expect(checkboxes.childAt(i).find('input[name="others"]').prop('placeholder')).toBe(f.placeHolder)
        expect(checkboxes.childAt(i).find('input[name="others"]').prop('defaultValue')).toBe(f.comment)
      }
    })
  })

  describe('functionality', () => {
    it('should call onClickFeedbackItem when check/uncheck checkbox', () => {
      const props = {
        feedback: {
          feedbackList: [
            {
              stack: 'dont_understand',
              title: 'I do not understand how to use this.',
              canComment: false,
              isChecked: false,
            },
            {
              stack: 'dont_need',
              title: 'I do not need this.',
              canComment: false,
              isChecked: true,
            },
            {
              stack: 'others',
              title: 'Other reason(s)...',
              placeHolder: 'Please specify',
              canComment: true,
              comment: 'comment',
              isChecked: true,
            }
          ],
          feedbackComment: '',
          showCommentForm: true,
        },
        onChangeFeedbackItemComment: jest.fn(),
        onToggleFeedbackCheckbox: jest.fn(),
        onChangeFeedbackComment: jest.fn(),
        goTo: jest.fn(),
      }
      const wrapper = mount(<FeedbackSurvey {...props}/>)
      const checkboxes = wrapper.childAt(1)


      forEach(props.feedback.feedbackList, (f, i) => {
        props.onToggleFeedbackCheckbox.mockReset()
        checkboxes.childAt(i).find('input[type="checkbox"]').simulate('click')
        expect(props.onToggleFeedbackCheckbox).toBeCalledWith(props.feedback.feedbackList[i].stack)
      })
    })

    it('should call onChangeFeedbackItemComment when change the commentable checkbox', () => {
      const props = {
        feedback: {
          feedbackList: [
            {
              stack: 'others',
              title: 'Other reason(s)...',
              placeHolder: 'Please specify',
              canComment: true,
              comment: 'comment',
              isChecked: true,
            }
          ],
          feedbackComment: '',
          showCommentForm: true,
        },
        onChangeFeedbackItemComment: jest.fn(),
        onToggleFeedbackCheckbox: jest.fn(),
        onChangeFeedbackComment: jest.fn(),
        goTo: jest.fn(),
      }
      const wrapper = mount(<FeedbackSurvey {...props}/>)
      const checkboxes = wrapper.childAt(1)

      checkboxes.find('input[type="text"]').simulate('change', {target: { value: 'test' }})

      expect(props.onChangeFeedbackItemComment).toBeCalledWith(props.feedback.feedbackList[0].stack, 'test')
    })
  })
})


describe('comment form', () => {
  describe('render', () => {
    it('should render comment form', () => {
      const props = {
        feedback: {
          feedbackList: [],
          feedbackComment: 'feedback comment',
          showCommentForm: true,
        },
        onChangeFeedbackItemComment: jest.fn(),
        onToggleFeedbackCheckbox: jest.fn(),
        onChangeFeedbackComment: jest.fn(),
        goTo: jest.fn(),
      }
      const wrapper = mount(<FeedbackSurvey {...props}/>)
      const commentForm = wrapper.childAt(2)
      expect(commentForm.find('textarea').prop('value')).toBe(props.feedback.feedbackComment)
    })

    it('should not render comment form when showCommentForm is false', () => {
      const props = {
        feedback: {
          feedbackList: [],
          feedbackComment: 'feedback comment',
          showCommentForm: false,
        },
        onChangeFeedbackItemComment: jest.fn(),
        onToggleFeedbackCheckbox: jest.fn(),
        onChangeFeedbackComment: jest.fn(),
        goTo: jest.fn(),
      }
      const wrapper = mount(<FeedbackSurvey {...props}/>)
      expect(wrapper.children().length).toBe(3)
    })
  })

  describe('functionality', () => {
    it('should call onChangeFeedbackComment when change the text', () => {
      const props = {
        feedback: {
          feedbackList: [],
          feedbackComment: 'feedback comment',
          showCommentForm: true,
        },
        onChangeFeedbackItemComment: jest.fn(),
        onToggleFeedbackCheckbox: jest.fn(),
        onChangeFeedbackComment: jest.fn(),
        goTo: jest.fn(),
      }
      const wrapper = mount(<FeedbackSurvey {...props}/>)
      const commentForm = wrapper.childAt(2)

      commentForm.find('textarea').simulate('change', { target: { value: 'test' }})

      expect(props.onChangeFeedbackComment).toBeCalledWith('test')
    })
  })
})