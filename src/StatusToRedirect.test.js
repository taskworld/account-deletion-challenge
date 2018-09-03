import React from 'react'
import { shallow } from 'enzyme'
import StatusToRedirect from './StatusToRedirect'
import * as Statuses from './Statuses'

test('should call redirectTo HomePage props when component will receive props', () => {
    const Component = StatusToRedirect((props) => 'mock component')
    const props = {
        confirmation: {
            status: { name: Statuses.STATUS.READY, error: null }
        },
        redirectToHomepage: jest.fn(),
    }
    const wrapper = shallow(<Component {...props} />, { lifecycleExperimental: true })
    wrapper.setProps({ ...props, confirmation: {status: { name: Statuses.STATUS.SUCCESS, error: null }}})

    expect(props.redirectToHomepage).toBeCalled()
})