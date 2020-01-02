import React, { Component } from "react"
import { MdSwapVert as ExpandIcon } from "react-icons/md"
import { inject, observer } from "mobx-react"
import countryFlagEmoji from "country-flag-emoji"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import { getPlatformName, getPlatformDetails, getShopeeInformation } from "../Lib/platformHelpers"
import DeviceSelector from "./DeviceSelector"

const Styles = {
  container: {
    cursor: "pointer",
    backgroundColor: Colors.backgroundLighter,
    borderTop: `1px solid ${Colors.lineLighter}`,
    color: Colors.foregroundDark,
  },
  content: {
    height: 27,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentOpen: {
    cursor: "auto",
    height: 85,
  },
  connectionInfo: {
    display: "flex",
    color: Colors.foregroundLight,
    textAlign: "center",
  },
  connectionIndicator: {
    height: 15,
    width: 15,
    background: `currentColor`,
    borderRadius: 15,
    marginRight: 10,
    boxShadow: `currentColor 0 0 2`,
  },
  connections: {
    display: "flex",
    overflowX: "auto",
    overflowY: "hidden",
    flexWrap: "nowrap",
    height: "100%",
  },
  expandIcon: {
    cursor: "pointer",
  },
}

@inject("session")
@observer
class StatusBar extends Component {
  handleOpenStatusBar = () => {
    this.props.session.ui.openStatusBar()
  }

  handleCloseStatusBar = () => {
    this.props.session.ui.closeStatusBar()
  }

  handleDeviceSelected = device => {
    this.props.session.setSelectedConnection(device)
  }

  areAnyDifferent() {
    const { connections } = this.props.session

    // Dump out early if we can
    if (!connections || connections.length === 0) return false

    const firstName = connections[0].name

    return connections.some(c => c.name !== firstName)
  }

  renderCollapsed() {
    const { session } = this.props

    let selectedDevice = "Waiting for connection"

    if (session.selectedConnection) {
      selectedDevice = `${getPlatformName(session.selectedConnection)} ${getPlatformDetails(
        session.selectedConnection
      )}`
    }

    const { country, appVersion, environment } = getShopeeInformation(session.selectedConnection)
    const { emoji, name: countryName } = countryFlagEmoji.get(country)
    return (
      <div style={Styles.content} onClick={this.handleOpenStatusBar}>
        <div style={Styles.connectionInfo}>
          <div
            style={{
              ...Styles.connectionIndicator,
              color: session.connections.length ? "#8BC34A" : "#9E9E9E",
            }}
          ></div>
          {session.connections.length} connections
        </div>
        <div style={Styles.connectionInfo}>Devices: {selectedDevice}</div>
        {country && (
          <div style={Styles.connectionInfo} title={countryName} alt={countryName}>
            Country: {emoji}
          </div>
        )}
        {environment && <div style={Styles.connectionInfo}>Environment: {environment}</div>}
        {appVersion && <div style={Styles.connectionInfo}>AppVersion: {appVersion}</div>}
        {/* <select
          value={session.selectedConnection.device.name}
          style={{ height: 35 }}
          onChange={e => {
            console.log(e.target.value)
            this.handleDeviceSelected(e.target.value)
          }}
        >
          {session.connections.map(item => (
            <option key={item.id} value={item.device.name}>
              {item.device.name}
            </option>
          ))}
        </select> */}
        <div style={Styles.expandIcon}>
          <ExpandIcon size={18} />
        </div>
      </div>
    )
  }

  renderExpanded() {
    const { session } = this.props

    let selectedSessionId = ""

    if (session.selectedConnection) {
      selectedSessionId = session.selectedConnection.clientId
    }

    return (
      <div style={{ ...Styles.content, ...Styles.contentOpen }}>
        <div style={Styles.connections}>
          {session.connections.map(item => (
            <DeviceSelector
              key={item.id}
              selectedDeviceClientId={selectedSessionId}
              device={item}
              showName={this.areAnyDifferent()}
              onSelect={this.handleDeviceSelected}
            />
          ))}
        </div>
        <div style={Styles.expandIcon} onClick={this.handleCloseStatusBar}>
          <ExpandIcon size={18} />
        </div>
      </div>
    )
  }

  render() {
    const {
      session: { ui },
    } = this.props

    return (
      <div style={Styles.container}>
        {ui.statusBarExpanded ? this.renderExpanded() : this.renderCollapsed()}
      </div>
    )
  }
}

export default StatusBar
