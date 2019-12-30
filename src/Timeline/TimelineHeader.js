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
    display: "flex",
    WebkitAppRegion: "drag",
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
    padding: `10px 20px`,
  },
  iconSize: 32,
  toolbarClear: { ...toolbarButton },
  toolbarFilter: { ...toolbarButton, paddingRight: 8 },
  reverseOrderSize: 28,
  reverseOrderIcon: { paddingRight: 7, cursor: "pointer" },
}

@inject("session")
@observer
class TimelineHeader extends Component {
  render() {
    const { ui } = this.props.session
    return (
      <div style={Styles.container}>
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
          icon={MdDeleteSweep}
          onClick={ui.reset}
          tip={`Clear <span style='opacity: 0.75'>⌘ + ⌫</span>`}
          size={Styles.iconSize}
          style={Styles.toolbarClear}
        />
      </div>
    )
  }
}

export default TimelineHeader
