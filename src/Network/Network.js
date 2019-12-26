import { inject, observer } from "mobx-react"
import { addIndex, identity, replace, isNil, pipe, map, reverse } from "ramda"
import React, { Component } from "react"
import getCommandComponent from "../Commands"
import Empty from "../Shared/EmptyState"
import AppStyles from "../Theme/AppStyles"
import { MdNetworkWifi } from "react-icons/md"
import TableRenderer from "./TableRenderer"
import ErrorBoundary from "../Shared/ErrorBoundary"

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
}

@inject("session")
@observer
class Network extends Component {
  // fires when we will update
  componentWillUpdate() {
    const node = this.refs.commands
    // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
    // remember our height, position, and if we're at the top
    this.scrollHeight = node.scrollHeight
    this.scrollTop = node.scrollTop
    this.isPinned = this.scrollTop === 0
  }

  // fires after we did update
  componentDidUpdate() {
    // should we be pinned to top, let's not auto-scroll
    if (this.isPinned) return
    const node = this.refs.commands
    // scroll to the place we were before
    // TODO: this falls apart as we reach max queue size as the scrollHeight no longer changes
    node.scrollTop = this.scrollTop + node.scrollHeight - this.scrollHeight
  }

  renderEmpty() {
    return (
      <Empty icon={MdNetworkWifi} title="No Network Requests">
        <p>Once your app connects and starts sending network requests, they will appear here.</p>
      </Empty>
    )
  }

  renderItem = (command, index) => {
    const CommandComponent = getCommandComponent(command)
    if (isNil(CommandComponent)) return null

    // grab the commands (heads up --- they're in reverse order for display purposes)
    const { commands = [] } = this.props.session

    // is this the bottom one?
    const isLast = index == commands.length - 1

    // find the one before it
    const previousCommand = isLast ? null : commands[index + 1]

    // if we have a previous one, calculate the time difference
    const diff =
      previousCommand &&
      previousCommand.date &&
      command.date &&
      command.date.getTime() - previousCommand.date.getTime()
    // glitches in the matrix
    const deltaTime = isLast || diff < 0 ? 0 : diff

    return (
      <CommandComponent
        deltaTime={deltaTime}
        index={index}
        key={command.messageId}
        command={command}
      />
    )
  }

  render() {
    const { session } = this.props
    const { commands, ui, commandsManager } = session

    const data = commandsManager.all
      .filter(({ type }) => type === "api.response")
      .map((data, index) => {
        const {
          payload: { request, response, duration },
        } = data
        const domain = pipe(replace(/^http(s):\/\/+/i, ""))(request.url)
        // better domain
        const afterHttp = request.url.split("//")[1]
        const betterDomain = afterHttp ? afterHttp.split("/")[0] : domain.split("/")[0]
        const splitUrl = request.url.split("/")
        // FIXME: better handle of those:
        // - http://localhost:3001/get_all_special_shops/
        const fragment = splitUrl[splitUrl.length - 1] || splitUrl[splitUrl.length - 2]
        const finalUrl = fragment.startsWith("?")
          ? splitUrl[splitUrl.length - 2] + fragment
          : fragment
        return {
          id: index,
          url: request.url,
          shortUrl: finalUrl || domain,
          domain: betterDomain,
          method: request.method,
          status: response.status,
          time: `${duration}ms`,
          // hidden data
          request,
          response,
        }
      })
    const isEmpty = data.length === 0
    const reverseIf = ui.isTimelineOrderReversed ? reverse : identity

    return (
      <div style={Styles.container}>
        <ErrorBoundary>
          <div style={Styles.commands} ref="commands">
            <TableRenderer data={data} renderEmpty={this.renderEmpty} />
          </div>
        </ErrorBoundary>
      </div>
    )
  }
}

export default Network
