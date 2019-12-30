import React, { Component } from "react"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import { inject, observer } from "mobx-react"

const Styles = {
  container: {
    backgroundColor: Colors.backgroundLighter,
    borderBottom: `1px solid ${Colors.lineLighter}`,
    color: Colors.foregroundDark,
  },
  content: {
    height: 26,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: "space-between",
  },
  center: {
    ...AppStyles.Layout.hbox,
    flex: 1,
    paddingLeft: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    color: Colors.foregroundLight,
    textAlign: "center",
  },
}

@inject("session")
@observer
class Header extends Component {
  render() {
    const {
      session: { ui },
      title,
    } = this.props

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.center}>
            <div style={Styles.title}>{title}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
