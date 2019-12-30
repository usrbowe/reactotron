import { inject, observer } from "mobx-react"
import { addIndex, identity, isNil, map, reverse } from "ramda"
import React, { Component } from "react"
import Empty from "../Shared/EmptyState"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import ErrorBoundary from "../Shared/ErrorBoundary"
import Checkbox from "../Shared/Checkbox"
import Header from "../Foundation/Header"

// all possible commands grouped by functionality
const GROUPS = [
  {
    name: "Informational",
    items: [
      { value: "log", text: "Log" },
      { value: "image", text: "Image" },
      { value: "display", text: "Custom Display" },
    ],
  },
  {
    name: "General",
    items: [
      { value: "client.intro", text: "Connection" },
      { value: "benchmark.report", text: "Benchmark" },
    ],
  },
  {
    name: "Async Storage",
    items: [{ value: "asyncStorage.mutation", text: "Mutations" }],
  },
  {
    items: [
      { value: "api.response", text: "API", deprecated: true },
      { value: "state.action.complete", text: "Action", deprecated: true },
      { value: "saga.task.complete", text: "Saga", deprecated: true },
      { value: "state.values.change", text: "Subscription Changed", deprecated: true },
    ],
  },
]

const mapIndexed = addIndex(map)

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  commands: {
    margin: 0,
    padding: 0,
    overflowY: "auto",
    overflowX: "hidden",
  },

  categoryLabel: {
    color: "#606060",
    paddingLeft: 20,
    fontSize: 12,
    paddingTop: 10,
  },

  loadMore: {
    color: "#606060",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  // filter styles
  groupName: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.foregroundLight,
    paddingBottom: 2,
    borderBottom: `1px solid ${Colors.lineLighter}`,
  },
  numberContainer: {
    position: "relative",
  },
  inputStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.backgroundLighter,
    color: Colors.foregroundDark,
    border: "none",
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 10,
  },
  checkButton: {
    cursor: "pointer",
    color: Colors.tag,
  },
}

@inject("session")
@observer
class Timeline extends Component {
  render() {
    const { session } = this.props
    const { commands, ui } = session
    const isEmpty = commands.length === 0
    const reverseIf = ui.isTimelineOrderReversed ? reverse : identity

    const groups = GROUPS.map((opt, optIdx) => {
      const options = opt.items.map((itm, itmIdx) => {
        const isChecked = session.isCommandHidden(itm.value)
        const onToggle = () => session.toggleCommandVisibility(itm.value)

        // Disable deprecated options
        if (itm.deprecated) {
          if (!isChecked) session.toggleCommandVisibility(itm.value)
        }

        return <Checkbox key={itmIdx} checked={isChecked} label={itm.text} onToggle={onToggle} />
      })
      // Hide deprecated
      if (!opt.name) return null
      return (
        <div style={Styles.group} key={optIdx}>
          <div style={Styles.groupName}>{opt.name}</div>
          <div style={Styles.option}>{options}</div>
        </div>
      )
    })

    return (
      <div style={Styles.container}>
        <ErrorBoundary>
          <Header title={`Toggle visibility of commands in Console`} />
          <div style={AppStyles.Modal.body}>{groups}</div>
        </ErrorBoundary>
      </div>
    )
  }
}

export default Timeline
