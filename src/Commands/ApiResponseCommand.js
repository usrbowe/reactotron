import { observer } from "mobx-react"
import PropTypes from "prop-types"
import { equals, isNil, pipe, replace, toUpper } from "ramda"
import { dotPath, isNilOrEmpty } from "ramdasauce"
import React, { Component } from "react"
import Command from "../Shared/Command"
import Content from "../Shared/Content"
import makeTable from "../Shared/MakeTable"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import SectionLink from "./SectionLink"

// Given a request body (string), attempts to coerce it to a JSON string.
// and if successful, returns that JSON object instead.  A friendlier way
// to display the request.
const getRequestText = request => {
  // nulls be nulls
  if (isNil(request)) return null

  try {
    // attemp? to parse as json
    const toJson = JSON.parse(request)

    // is it empty?
    if (isNilOrEmpty(toJson)) {
      return request
    } else {
      // embed a "root" level node
      return { " ": toJson }
    }
  } catch (e) {
    // any problems, return the original string
    return request
  }
}

const COMMAND_TITLE = "API RESPONSE"
const REQUEST_HEADER_TITLE = "Request Headers"
const RESPONSE_HEADER_TITLE = "Response Headers"
const REQUEST_BODY_TITLE = "Request"
const RESPONSE_BODY_TITLE = "Response"
const REQUEST_PARAMS_TITLE = "Request Params"
const NO_REQUEST_BODY = "Nothing sent."
const NO_REQUEST_PARAMS = "No params sent."

const Styles = {
  container: {},
  column: {
    borderRight: "1px solid #ccc",
    padding: 5,
    fontSize: 12,
    color: "#eee",
  },
}

const INITIAL_STATE = {
  showRequestHeaders: false,
  showResponseHeaders: false,
  showRequestBody: false,
  showResponseBody: false,
  showRequestParams: false,
}

@observer
class ApiResponseCommand extends Component {
  render() {
    const { command } = this.props
    const { payload } = command
    const { duration } = payload
    const status = dotPath("response.status", payload)
    const url = dotPath("request.url", payload)
    const smallUrl = pipe(
      replace(/^http(s):\/\/[^/]+/i, ""),
      replace(/\?.*$/i, "")
    )(url)
    const method = toUpper(dotPath("request.method", payload) || "")
    const requestHeaders = dotPath("request.headers", payload)
    const responseHeaders = dotPath("response.headers", payload)
    const requestBody = getRequestText(dotPath("request.data", payload))
    const responseBody = dotPath("response.body", payload)
    const requestParams = dotPath("request.params", payload)
    // const subtitle = `${method} ${smallUrl}`
    // const preview = subtitle
    // const summary = { "Status Code": status, Method: method, "Duration (ms)": duration }

    return (
      <div style={{ display: "flex", borderBottom: `1px solid grey` }}>
        <span style={Styles.column}>{smallUrl}</span>
        <span style={Styles.column}>{method}</span>
        <span style={Styles.column}>{status}</span>
        <span style={Styles.column}> {duration}</span>
      </div>
    )

    // return (
    //   <Command {...this.props} title={COMMAND_TITLE} duration={duration} preview={preview}>
    //     <div style={Styles.container}>
    //       <div style={Styles.url}>{url}</div>

    //       {makeTable(summary)}

    //       <div style={Styles.sectionLinks}>
    //         <SectionLink
    //           text={RESPONSE_BODY_TITLE}
    //           isActive={showResponseBody}
    //           onClick={this.toggleResponseBody}
    //         />
    //         <SectionLink
    //           text={RESPONSE_HEADER_TITLE}
    //           isActive={showResponseHeaders}
    //           onClick={this.toggleResponseHeaders}
    //         />
    //         {!isNilOrEmpty(requestBody) && (
    //           <SectionLink
    //             text={REQUEST_BODY_TITLE}
    //             isActive={showRequestBody}
    //             onClick={this.toggleRequestBody}
    //           />
    //         )}
    //         {!isNilOrEmpty(requestParams) && (
    //           <SectionLink
    //             text={REQUEST_PARAMS_TITLE}
    //             isActive={showRequestParams}
    //             onClick={this.toggleRequestParams}
    //           />
    //         )}
    //         <SectionLink
    //           text={REQUEST_HEADER_TITLE}
    //           isActive={showRequestHeaders}
    //           onClick={this.toggleRequestHeaders}
    //         />
    //       </div>

    //       <div style={Styles.content}>
    //         {showResponseBody && <Content value={responseBody} />}
    //         {showResponseHeaders && makeTable(responseHeaders)}
    //         {showRequestBody &&
    //           (isNilOrEmpty(requestBody) ? (
    //             NO_REQUEST_BODY
    //           ) : (
    //             <Content value={requestBody} treeLevel={1} />
    //           ))}
    //         {showRequestParams &&
    //           (isNilOrEmpty(requestParams) ? NO_REQUEST_PARAMS : <Content value={requestParams} />)}
    //         {showRequestHeaders && makeTable(requestHeaders)}
    //       </div>
    //     </div>
    //   </Command>
    // )
  }
}

export default ApiResponseCommand
