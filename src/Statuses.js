import PropTypes from 'prop-types'

export const STATUS = {
    READY: 'ready',
    SUCCESS: 'success',
    ERROR: 'error',
    LOADING: 'loading',
}

export const StatusPropTypes = PropTypes.shape({
    name: PropTypes.oneOf([STATUS.READY, STATUS.SUCCESS, STATUS.ERROR, STATUS.LOADING]).isRequired,
    error: PropTypes.string,
})

export const isReady = (status) => {
    return status && status.name === STATUS.READY
}

export const isSuccess = (status) => {
    return status && status.name === STATUS.SUCCESS
}

export const isError = (status) => {
    return status && status.name === STATUS.ERROR
}

export const isLoading = (status) => {
    return status && status.name === STATUS.LOADING
}