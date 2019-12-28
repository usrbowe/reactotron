import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import EmptyScreen from "../Shared/EmptyScreen"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
    position: "absolute",
    top: 27,
    right: 0,
    left: 0,
    bottom: 25,
  },
}

export default class ReactTab extends Component {
  componentDidMount() {
    this.reactDevTools = require("react-devtools-core/standalone")
      .setContentDOMNode(document.getElementById("container"))
      .setDefaultThemeName(localStorage.getItem("themeName"))
      .startServer()
  }
  componentWillUnmount() {
    this.reactDevTools && this.reactDevTools.close()
  }
  render() {
    return (
      <div style={Styles.container} id="container">
        <EmptyScreen
          title={"Waiting for React to connect…"}
          description={"The active app will automatically connect in a few seconds."}
        />
      </div>
    )
  }
}
