import React from 'react'
import { reduce, find, size, forEach } from 'lodash'

export default class Pager extends React.Component {
    constructor(props) {
        super(props)

        this.pages = reduce(props.paths, (acc, p) => {
            acc[p.path] = p
            return acc
        }, {})

        const indexPath = find(this.pages, p => p.index).path

        this.state = {
            currentPath: indexPath,
        }
    }

    goTo = (path) => {
        return () => {
            if (path in this.pages) {
                this.setState((currentState) => ({ ...currentState, currentPath: path }))
            }
        }
    }

    render() {
        if (!(this.state.currentPath in this.pages)) return null

        const currentComponent = this.pages[this.state.currentPath].component
        const props = {
            ...this.props.data,
            goTo: this.goTo,
        }

        return React.createElement(currentComponent, props)
    }
}