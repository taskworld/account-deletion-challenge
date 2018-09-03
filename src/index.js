import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import MockDataProvider from './MockDataProvider'

import Pager from './Common/Pager'
import WorkspaceTransfer from './Pages/WorkspaceTransfer/WorkspaceTransfer'
import FeedbackSurvey from './Pages/Feedback/FeedbackSurvey'
import Confirmation from './Pages/Confirmation/Confirmation'
import StatusToRedirect from './StatusToRedirect'

const paths = [
  { path: '/transfer', index: true, component: StatusToRedirect(WorkspaceTransfer) },
  { path: '/feedback', component: StatusToRedirect(FeedbackSurvey) },
  { path: '/confirmation', component: StatusToRedirect(Confirmation) },
]

ReactDOM.render(
  <MockDataProvider>
    {(props) => <Pager paths={paths} data={{...props}} />}
  </MockDataProvider>,
  document.getElementById('root')
)

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
