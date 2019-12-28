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
import ErrorBoundary from "../Shared/ErrorBoundary"
import EmptyScreen from "../Shared/EmptyScreen"

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
      return action.__internalUpdate || state
  }
}

@inject("session")
@observer
class State extends Component {
  store = null
  state = {
    devToolsVisible: false,
    dispatchesId: null,
  }
  componentDidUpdate(prevProps) {
    const {
      session: { watches, dispatches },
    } = this.props
    const { dispatches: prevDispatches } = prevProps.session
    // First time we receive data initialize store
    if (!this.store && watches && watches.id !== 0) {
      // console.log("Init store after first change", watches)
      this.store = createStore(
        devToolsReducer,
        watches.latest[0].value,
        compose(DevTools.instrument())
      )
      // Show devtools once store is created
      this.setState({ devToolsVisible: true })
    }

    // Update devtools store - still bit hacky
    const hasInitStore = Boolean(this.store)
    const hasNewStateChange = watches.id !== prevProps.session.watches.id
    // FIXME: only dispatch when there is new dispatches id
    if (hasInitStore && dispatches && this.state.dispatchesId !== dispatches.id) {
      // console.log("new state updates -> ", dispatches.action, watches.latest[0])
      this.setState({
        dispatchesId: dispatches.id,
      })
      this.store.dispatch({
        ...dispatches.action,
        __internalUpdate: watches.latest[0].value,
      })
    }
  }

  componentDidMount() {
    // Add subscription for entire state if haven't done before
    const storedSubscriptions = localStorage.getItem("storedSubscriptions")
    if (!storedSubscriptions) {
      const { session } = this.props
      session.ui.watchToAdd = ""
      session.ui.submitStateWatch()
    }
  }
  render() {
    const { devToolsVisible } = this.state
    // KEEP to subscribe changes
    const { watches, dispatches } = this.props.session
    return (
      <div style={{ flex: 1, maxHeight: "100%" }}>
        <ErrorBoundary>
          {devToolsVisible ? (
            <DevTools store={this.store} />
          ) : (
            <EmptyScreen
              title={"Waiting for first dispatch..."}
              description={"Log will be shown upon first dispatched action"}
            />
          )}
        </ErrorBoundary>
      </div>
    )
  }
}

export default State
