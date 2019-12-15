import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import {
  MdAdd as IconAdd,
  MdDeleteSweep as IconClear,
  MdFileDownload as IconAddBackup,
  MdNotificationsNone,
  MdImportExport,
  MdCallReceived,
  MdFileDownload,
} from "react-icons/md"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Backups from "./Backups"
import Subscriptions from "./Subscriptions"
import Button from "../Shared/CommandToolbarButton"
import Colors from "../Theme/Colors"

const toolbarButton = {
  cursor: "pointer",
}
const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  toolbarContainer: {
    display: "flex",
  },
  toolbarAdd: {
    ...toolbarButton,
    marginRight: 7,
  },
  toolbarClear: { ...toolbarButton },
  iconSize: 32,
}

// REDUX TOOLS
import { createDevTools } from "redux-devtools"
import Inspector from "redux-devtools-inspector"
const DevTools = createDevTools(<Inspector theme={Colors.theme} invertTheme={false} />)

// STORE
import { createStore, compose, applyMiddleware } from "redux"
function devToolsReducer(state = {}, action) {
  switch (action.type) {
    default:
      return action.newState || state
  }
}
export const store = createStore(devToolsReducer, [], compose(DevTools.instrument()))

@inject("session")
@observer
class State extends Component {
  render() {
    return (
      <div style={{ flex: 1 }}>
        <DevTools store={store} />
      </div>
    )
  }
}

export default State
