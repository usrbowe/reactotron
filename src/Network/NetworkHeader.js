import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import {
  MdDeleteSweep as IconClear,
  MdFilterList as IconFilter,
  MdFileDownload as IconDownload,
  MdSearch as IconSearch,
  MdSwapVert as IconReverseOrder,
  MdSearch,
  MdFilterList,
  MdSwapVert,
  MdFileDownload,
  MdDeleteSweep,
} from "react-icons/md"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Button from "../Shared/CommandToolbarButton"

const TITLE = "Timeline"

const toolbarButton = {
  cursor: "pointer",
}

const Styles = {
  container: {
    WebkitAppRegion: "drag",
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: "space-between",
  },
  left: { ...AppStyles.Layout.hbox, width: 100, alignItems: "center" },
  right: { ...AppStyles.Layout.hbox, justifyContent: "flex-end", alignItems: "center", width: 100 },
  center: { ...AppStyles.Layout.vbox, flex: 1 },
  title: { color: Colors.foregroundLight, textAlign: "center" },
  iconSize: 32,
  toolbarClear: { ...toolbarButton },
  toolbarFilter: { ...toolbarButton, paddingRight: 8 },
  searchContainer: {
    position: "relative",
    display: "flex",
    padding: "5px 10px",
  },
  searchLabel: { fontSize: 12, paddingLeft: 10, paddingRight: 10 },
  searchInput: {
    borderRadius: 4,
    padding: 10,
    flex: 1,
    backgroundColor: Colors.backgroundSubtleDark,
    border: "none",
    color: Colors.foregroundDark,
    fontSize: 14,
  },
  searchIconSize: 28,
  searchIcon: { paddingRight: 7, cursor: "pointer" },
  searchIconEnabled: { color: "white" },
  reverseOrderSize: 28,
  reverseOrderIcon: { paddingRight: 7, cursor: "pointer" },
}

@inject("session")
@observer
class TimelineHeader extends Component {
  state = {
    filterValue: null,
  }
  onTextChange = e => {
    const value = e.target.value
    // this.setState({
    //   filterValue: value,
    // })
    this.props.onFilterChange(value)
  }
  render() {
    const { ui } = this.props.session
    const { filterValue } = this.state

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.center}>
            <div style={Styles.searchContainer}>
              <input
                style={Styles.searchInput}
                // onInput={this.props.onFilter ? this.getValue : undefined}
                onChange={this.onTextChange}
                // value={filterValue}
                placeholder={"Filter based on URL"}
              />
            </div>
          </div>
          <div style={Styles.right}>
            <Button
              icon={MdDeleteSweep}
              onClick={ui.reset}
              tip={`Clear <span style='opacity: 0.75'>⌘ + ⌫</span>`}
              size={Styles.iconSize}
              style={Styles.toolbarClear}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default TimelineHeader
