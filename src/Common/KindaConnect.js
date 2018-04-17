import React from 'react'

const KindaConnect = (mapStateToProps) => {
  return (Component) => (
    class KindaConnectComponent extends React.Component {
      render() {
        const props = { ...mapStateToProps(this.props), goTo: this.props.goTo }
        return <Component {...props} />
      }
    }
  )
}

export default KindaConnect
