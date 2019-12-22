import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
    position: "absolute",
    top: 25,
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
        <div id="waiting" style={{ padding: 25 }}>
          <h2>Waiting for React to connect…</h2>
          <div>
            <h4>React Native</h4>
            <div>The active app will automatically connect in a few seconds.</div>
          </div>
          <br />
          <br />
          <div id="loading-status">Starting the server…</div>
        </div>
      </div>
    )
  }
}
