import _ from 'lodash'

const CANCEL_WORKSPACE = {
  PAGE_ID: '48414504',
  MULTIPLE_CHOICES_ID: '162037852',
  COMMENTS_ID: '164973120',
  CHOICE_ID: {
    DONT_UNDERSTAND: '1170264109',
    DONT_NEED: '1170264110',
    PREFER_OTHER_APPS: '1170264111',
    LACK_FEATURES: '1170264112',
    BUGS: '1170264113',
    EXPENSIVE: '1170264119',
    SLOW: '1170264120',
    OTHERS: '1170286307',
  },
}

const getChoiceID = key => {
  switch (key) {
    case 'dont_understand':
      return CANCEL_WORKSPACE.CHOICE_ID.DONT_UNDERSTAND
    case 'dont_need':
      return CANCEL_WORKSPACE.CHOICE_ID.DONT_NEED
    case 'prefer_other_apps':
      return CANCEL_WORKSPACE.CHOICE_ID.PREFER_OTHER_APPS
    case 'lack_features':
      return CANCEL_WORKSPACE.CHOICE_ID.LACK_FEATURES
    case 'bugs':
      return CANCEL_WORKSPACE.CHOICE_ID.BUGS
    case 'expensive':
      return CANCEL_WORKSPACE.CHOICE_ID.EXPENSIVE
    case 'slow':
      return CANCEL_WORKSPACE.CHOICE_ID.SLOW
    case 'others':
      return CANCEL_WORKSPACE.CHOICE_ID.OTHERS
    default:
      return ''
  }
}

const getSurveyPayload = (feedbackRefs, comment) => {
  const surveyAnswers = _.map(feedbackRefs, ref => {
    if (getChoiceID(ref.key) === CANCEL_WORKSPACE.CHOICE_ID.OTHERS) {
      return {
        text: ref.value || 'n/a',
        other_id: CANCEL_WORKSPACE.CHOICE_ID.OTHERS,
      }
    } else {
      return { choice_id: getChoiceID(ref.key) }
    }
  })
  const surveyPayload = {
    pages: [
      {
        id: CANCEL_WORKSPACE.PAGE_ID,
        questions: [
          {
            id: CANCEL_WORKSPACE.MULTIPLE_CHOICES_ID,
            answers: surveyAnswers,
          },
        ],
      },
    ],
  }
  if (comment) {
    const commentAnswers = [{ text: comment }]
    const commentQuestion = {
      id: CANCEL_WORKSPACE.COMMENTS_ID,
      answers: commentAnswers,
    }
    surveyPayload.pages[0].questions.push(commentQuestion)
  }
  return surveyPayload
}

export const submitToSurveyMonkeyDeleteAccount = async ({
  feedbackRefs,
  comment,
}) => {
  const surveyPayload = getSurveyPayload(feedbackRefs, comment)

  const response = await window.fetch(
    'https://us-central1-tw-account-deletion-challenge.cloudfunctions.net/submitSurvey',
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyPayload),
    }
  )
  if (response.status !== 200) {
    throw new Error('Error submitting SurveyMonkey')
  }
}
