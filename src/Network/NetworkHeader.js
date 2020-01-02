import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import { MdDoNotDisturb } from "react-icons/md"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Button from "../Shared/CommandToolbarButton"

const Styles = {
  container: {
    display: "flex",
    height: 26,
    backgroundColor: Colors.backgroundLighter,
    color: Colors.foregroundDark,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchContainer: {
    position: "relative",
    display: "flex",
    height: "100%",
  },
  searchInput: {
    padding: `0 7px`,
    margin: 3,
    flex: 1,
    backgroundColor: Colors.background,
    border: "none",
    color: Colors.foregroundDark,
    fontSize: 13,
  },
}

@inject("session")
@observer
class TimelineHeader extends Component {
  onTextChange = e => {
    this.props.onFilterChange(e.target.value)
  }
  render() {
    const { ui } = this.props.session

    return (
      <div style={Styles.container}>
        <div style={Styles.searchContainer}>
          <input
            style={Styles.searchInput}
            onChange={this.onTextChange}
            placeholder={"Filter based on URL"}
          />
        </div>
        <div style={Styles.right}>
          <Button
            icon={MdDoNotDisturb}
            // TODO clean only network requests
            onClick={ui.reset}
            tip={`Clear <span style='opacity: 0.75'>⌘ + ⌫</span>`}
            size={18}
          />
        </div>
      </div>
    )
  }
}

export default TimelineHeader
