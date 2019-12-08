import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import TabbarButton from "./TabbarButton"
import { inject, observer } from "mobx-react"
import { MdHome, MdReorder, MdAssignment, MdNetworkWifi, MdLiveHelp } from "react-icons/md"
import { FaMagic } from "react-icons/fa"

const Styles = {
  container: {
    zIndex: 5,
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.line}`,
    WebkitAppRegion: "drag",
    transition: "margin 0.2s ease-out",
  },
  content: { ...AppStyles.Layout.vbox, height: "100%", alignItems: "center" },
  tabs: { display: "flex", width: "100%", paddingLeft: 75 },
}

@inject("session")
@observer
class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.handleClickHome = () => {
      this.props.session.ui.switchTab("home")
    }
    this.handleClickTimeline = () => {
      this.props.session.ui.switchTab("timeline")
    }
    this.handleClickState = () => {
      this.props.session.ui.switchTab("state")
    }
    this.handleClickHelp = () => {
      this.props.session.ui.switchTab("help")
    }
    this.handleClickNetwork = () => {
      this.props.session.ui.switchTab("network")
    }
    this.handleClickCustomCommands = () => {
      this.props.session.ui.switchTab("customCommands")
    }
  }

  render() {
    const { session } = this.props
    const { ui } = session
    const isHome = ui.tab === "home"
    const imageFilter = {
      filter: `grayscale(${isHome ? 0 : 100}%) brightness(${isHome ? 100 : 70}%)`,
    }

    return (
      <div
        style={{
          ...Styles.container,
          ...(!ui.isSidebarVisible ? { marginLeft: -Styles.container.maxWidth } : {}),
        }}
      >
        <div style={Styles.content}>
          <div style={Styles.tabs}>
            <TabbarButton
              text="Home"
              icon={MdHome}
              isActive={isHome}
              onClick={this.handleClickHome}
            />
            <TabbarButton
              text="Timeline"
              icon={MdReorder}
              isActive={ui.tab === "timeline"}
              onClick={this.handleClickTimeline}
            />
            <TabbarButton
              text="Network"
              icon={MdNetworkWifi}
              isActive={ui.tab === "network"}
              onClick={this.handleClickNetwork}
            />
            <TabbarButton
              text="State"
              icon={MdAssignment}
              isActive={ui.tab === "state"}
              onClick={this.handleClickState}
            />
            <TabbarButton
              text="Custom Commands"
              icon={FaMagic}
              isActive={ui.tab === "customCommands"}
              onClick={this.handleClickCustomCommands}
            />
            <TabbarButton
              icon={MdLiveHelp}
              styles={{ marginLeft: "auto" }}
              isActive={ui.tab === "help"}
              onClick={this.handleClickHelp}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
