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
    backgroundColor: Colors.backgroundLighter,
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
  getValue = evt => {
    this.props.onFilter(evt.target.value)
  }

  /**
   * Moves the focus to the search input.
   *
   * This is called when we show the search ui.
   */
  setFocusToSearch = () => {
    // unclear why i need to do this after a timeout?  is it because
    // i'm rendering?
    setTimeout(() => {
      this.searchInput.focus()
    }, 10)
  }

  componentDidMount() {
    this.props.session.ui.toggleTimelineSearch()
    // when the isTimelineSearchVisible becomes `true`...
    this.unsubscribe = reaction(
      () => this.props.session.ui.isTimelineSearchVisible,
      value => {
        if (value) {
          this.setFocusToSearch()
        }
      }
    )
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  handleKeyDown = e => {
    // have to do this here
    if (e.keyCode === 27) {
      this.props.session.ui.hideTimelineSearch()
    }
  }

  render() {
    const { ui } = this.props.session
    const { isTimelineSearchVisible } = ui
    const searchIconStyle = {
      ...Styles.searchIcon,
      ...(isTimelineSearchVisible ? Styles.searchIconEnabled : {}),
    }
    const searchContainerStyle = {
      ...Styles.searchContainer,
    }

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.center}>
            <div style={searchContainerStyle}>
              <input
                ref={ref => (this.searchInput = ref)}
                style={Styles.searchInput}
                onInput={this.props.onFilter ? this.getValue : undefined}
                onChange={e => ui.setSearchPhrase(e.target.value)}
                onKeyDown={this.handleKeyDown}
                value={ui.searchPhrase}
                placeholder={"Search"}
              />
            </div>
          </div>
          <div style={Styles.right}>
            <Button
              icon={MdFilterList}
              onClick={ui.openFilterTimelineDialog}
              tip={`Filter <span style='opacity: 0.75'>⌘ + ⇧ + K</span>`}
              size={Styles.iconSize}
              style={Styles.toolbarFilter}
            />
            <Button
              icon={MdSwapVert}
              onClick={ui.toggleTimelineOrder}
              tip="Reverse Order"
              size={Styles.reverseOrderSize}
              style={Styles.reverseOrderIcon}
            />
            <Button
              icon={MdFileDownload}
              onClick={ui.openExportTimelineDialog}
              tip="Download"
              size={Styles.iconSize}
              style={Styles.toolbarFilter}
            />
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
