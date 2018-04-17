import React from 'react'
import PropTypes from 'prop-types'
import { isSuccess, StatusPropTypes } from './Statuses'

const StatusToRedirect = (Component) => {
  class RedirectWrapperComponent extends React.Component {
    componentWillReceiveProps(nextProps) {
      if (isSuccess(nextProps.confirmation.status)) {
        this.props.redirectToHomepage()
      }
    }

    render() {
      return <Component {...this.props} />
    }
  }

  RedirectWrapperComponent.propTypes = {
    confirmation: PropTypes.shape({
      status: StatusPropTypes
    }).isRequired,
    redirectToHomepage: PropTypes.func.isRequired,
  }

  return RedirectWrapperComponent
}

export default StatusToRedirect
