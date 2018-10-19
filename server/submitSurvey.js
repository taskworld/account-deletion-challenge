const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const _ = require('lodash')

const MULTIPLE_CHOICE_ID = '162037852'
const CHOICE_IDS = [
	'1170264109',
	'1170264110',
	'1170264111',
	'1170264112',
	'1170264113',
	'1170264119',
	'1170264120',
]
const OTHER_ID = '1170286307'
const COMMENT_ID = '164973120'

module.exports = functions.https.onRequest((request, response) => cors(request, response, () => {
	if (request.method !== 'POST') {
		return response.sendStatus(405)
	}

	response.setHeader('Content-Type', 'text/plain')
	response.statusCode = 400

	if (_.isPlainObject(request.body) === false) {
		return response.send('Expected body to be an object')
	}

	if (_.isArray(request.body.pages) === false) {
		return response.send('Expected "pages" field to be an array')
	}

	if (request.body.pages.length !== 1) {
		return response.send('Expected "pages" value to have exactly 1 member')
	}

	if (_.isPlainObject(request.body.pages[0]) === false) {
		return response.send('Expected "pages" value to be an array of object')
	}

	if (_.isString(request.body.pages[0].id) === false) {
		return response.send('Expected "pages[].id" field to be a string')
	}

	if (request.body.pages[0].id !== '48414504') {
		return response.send('Expected "pages[].id" value to be "48414504"')
	}

	if (_.isArray(request.body.pages[0].questions) === false) {
		return response.send('Expected "pages[].questions" field to be an array')
	}

	if (request.body.pages[0].questions.length === 0) {
		return response.send('Expected "pages[].questions" value to have at least 1 member')
	}

	if (request.body.pages[0].questions.some(question => _.isString(question.id) === false)) {
		return response.send('Expected "pages[].questions[].id" field to be a string')
	}

	if (request.body.pages[0].questions.some(question => question.id !== MULTIPLE_CHOICE_ID && question.id !== COMMENT_ID)) {
		return response.send('Expected "pages[].questions[].id" value to either ' + MULTIPLE_CHOICE_ID + ' or ' + COMMENT_ID)
	}

	if (request.body.pages[0].questions.length !== _.uniqBy(request.body.pages[0].questions, 'id').length) {
		return response.send('Expected "pages[].questions[].id" value to be unique')
	}

	if (request.body.pages[0].questions.some(question => _.isArray(question.answers) === false || question.answers.length === 0 || question.answers.some(answer => _.isPlainObject(answer) === false))) {
		return response.send('Expected "pages[].questions[].answers" field to be an array of object')
	}

	const multipleChoiceQuestion = request.body.pages[0].questions.find(question => question.id === MULTIPLE_CHOICE_ID)
	if (multipleChoiceQuestion) {
		for (const answer of multipleChoiceQuestion.answers) {
			if (answer.choice_id) {
				if (_.difference(_.keys(answer), ['choice_id']).length > 0) {
					return response.send('Expected "pages[].questions[].answers" value to be an object containing only "choice_id" field')
				}

				if (_.includes(CHOICE_IDS, answer.choice_id) === false) {
					return response.send('Expected "pages[].questions[].answers[].choice_id" value to be one of ' + CHOICE_IDS.join(', '))
				}


			} else if (answer.other_id) {
				if (_.difference(_.keys(answer), ['other_id', 'text']).length > 0) {
					return response.send('Expected "pages[].questions[].answers" value to be an object containing only "other_id" and "text" field')
				}

				if (answer.other_id !== OTHER_ID) {
					return response.send('Expected "pages[].questions[].answers[].other_id" value to be ' + OTHER_ID)
				}

				if (_.isString(answer.text) === false || answer.text.length === 0) {
					return response.send('Expected "pages[].questions[].answers[].text" field to be a non-empty string')
				}

			} else {
				return response.send('Expected "pages[].questions[].answers" value to have the type of either { choice_id } or { other_id, text }')
			}
		}
	}

	const freeTextQuestion = request.body.pages[0].questions.find(question => question.id === COMMENT_ID)
	if (freeTextQuestion) {
		if (freeTextQuestion.answers.length !== 1) {
			return response.send('Expected "pages[].questions[].answers" value to have exactly 1 member')
		}

		if (_.isEqual(_.keys(freeTextQuestion.answers[0]), ['text']) === false) {
			return response.send('Expected "pages[].questions[].answers" value to be an object containing only "text" field')
		}

		if (_.isString(freeTextQuestion.answers[0].text) === false || freeTextQuestion.answers[0].text.length === 0) {
			return response.send('Expected "pages[].questions[].answers[].text" value to be a non-empty string')
		}
	}

	response.sendStatus(200)
}))
