window._console = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
}
console.log = noop => noop
console.warn = noop => noop
console.error = noop => noop
console.debhg = noop => noop

import { Provider, observer } from "mobx-react"
import React, { Component } from "react"
import { ipcRenderer, remote } from "electron"
import config from "../Lib/config"
import FilterTimelineDialog from "../Dialogs/FilterTimelineDialog"
import ExportTimelineDialog from "../Dialogs/ExportTimelineDialog"
import RenameStateDialog from "../Dialogs/RenameStateDialog"
import SendCustomDialog from "../Dialogs/SendCustomDialog"
import StateDispatchDialog from "../Dialogs/StateDispatchDialog"
import StateKeysAndValuesDialog from "../Dialogs/StateKeysAndValuesDialog"
import StateWatchDialog from "../Dialogs/StateWatchDialog"
import Home from "../Home/Home"
import Help from "../Help/Help"
import Network from "../Network/Network"
import ReactTab from "../React/React"
import State from "../State/State"
import SessionStore from "../Stores/SessionStore"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Timeline from "../Timeline/Timeline"
import Sidebar from "./Sidebar"
import Tabbar from "./Tabbar"
import StatusBar from "./StatusBar"
import CustomCommandsList from "../CustomCommands/CustomCommandsList"
import ReactotronTerminal from "./ReactotronTerminal"
import GlobalStyles from "./GlobalStyles"

const session = new SessionStore(config.get("server.port", 9090))

const Styles = {
  container: { ...AppStyles.Layout.vbox },
  content: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.background,
    color: Colors.foreground,
    height: "100vh",
    scroll: "hidden",
  },
  body: { ...AppStyles.Layout.hbox },
  app: { ...AppStyles.Layout.vbox, scroll: "none", overflow: "hidden" },
  page: { ...AppStyles.Layout.vbox, flex: 1 },
  pageHidden: { flex: 0, height: 0, visibility: "hidden" },
}

@observer
export default class App extends Component {
  componentDidMount() {
    // FORCE OPEN DEVTOOLS
    remote.getCurrentWindow().openDevTools()
    ipcRenderer.on("toggle-side-menu", this.handleSideMenuToggle)
  }

  handleSideMenuToggle() {
    session.ui.toggleSidebar()
  }

  render() {
    const { ui } = session
    const showHome = ui.tab === "home"
    const showTimeline = ui.tab === "timeline"
    const showHelp = ui.tab === "help"
    const showSettings = ui.tab === "settings"
    const showNetwork = ui.tab === "network"
    const showReact = ui.tab === "react"
    const showState = ui.tab === "state"
    const showCustomCommands = ui.tab === "customCommands"

    return (
      <Provider session={session}>
        <GlobalStyles />
        <div style={Styles.container}>
          <div style={Styles.content}>
            {!ui.inTerminal && (
              <>
                <Tabbar />
                <div style={Styles.body}>
                  {/* <Sidebar /> */}
                  <div style={Styles.app}>
                    <div style={showHome ? Styles.page : Styles.pageHidden}>
                      <Home />
                    </div>
                    <div style={showTimeline ? Styles.page : Styles.pageHidden}>
                      <Timeline />
                    </div>
                    <div style={showState ? Styles.page : Styles.pageHidden}>
                      <State />
                    </div>
                    <div style={showHelp ? Styles.page : Styles.pageHidden}>
                      <Help />
                    </div>
                    <div style={showNetwork ? Styles.page : Styles.pageHidden}>
                      <Network />
                    </div>
                    <div style={showReact ? Styles.page : Styles.pageHidden}>
                      {showReact && <ReactTab />}
                    </div>
                    <div style={showCustomCommands ? Styles.page : Styles.pageHidden}>
                      <CustomCommandsList />
                    </div>
                    <div style={showSettings ? Styles.page : Styles.pageHidden}>
                      <h1>Settings</h1>
                    </div>
                  </div>
                </div>
                {/* <div style={Styles.body}>
                  <div style={Styles.app}>
                    <div style={Styles.page}>
                      <ReactotronTerminal />
                    </div>
                  </div>
                </div> */}
              </>
            )}
            <StatusBar />
          </div>
          <StateKeysAndValuesDialog />
          <StateDispatchDialog />
          <StateWatchDialog />
          <RenameStateDialog />
          <FilterTimelineDialog />
          <ExportTimelineDialog />
          <SendCustomDialog />
        </div>
      </Provider>
    )
  }
}
