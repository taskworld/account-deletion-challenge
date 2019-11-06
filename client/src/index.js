import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import TerminateModalFlow from './TerminateModalFlow.react'

const currentUser = {
  _id: 'user1',
  name: 'Ross Lynch',
  email: 'ross@example.com',
}

ReactDOM.render(
  <TerminateModalFlow user={currentUser} />,
  document.getElementById('root')
)

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
