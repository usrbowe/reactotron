import React from "react"
import { clipboard } from "electron"
import ReactDataGrid from "react-data-grid"
import { Menu } from "react-data-grid-addons"
import httpStatus from "http-status"
import ObjectTree from "../Shared/ObjectTree"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import Colors from "../Theme/Colors"
import NetworkHeader from "./NetworkHeader"
import ResponsePreview from "./ResponsePreview"
import { apiRequestToCurl } from "../Lib/api-to-curl"

const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu

const UrlCellFormatter = ({ value, row }) => {
  return <span title={row.url}>{value}</span>
}

const ColorCellFormatter = ({ value }) => {
  return (
    <span style={[value >= 400 && { color: "red" }]} title={`${value} ${httpStatus[value]}`}>
      {value}
    </span>
  )
}

const columns = [
  {
    key: "shortUrl",
    name: "Name",
    formatter: UrlCellFormatter,
    resizable: true,
    sortable: true,
    width: 300,
  },
  { key: "method", name: "Method", resizable: true, sortable: true, width: 60 },
  {
    key: "status",
    name: "Status",
    resizable: true,
    sortable: true,
    formatter: ColorCellFormatter,
    width: 60,
  },
  { key: "domain", name: "Domain", resizable: true, sortable: true, width: 200 },
  { key: "time", name: "Time", resizable: true, sortable: true, width: 60 },
]

const headers = data => [
  { name: "Request URL", value: data.request.url },
  { name: "Request Method", value: data.request.method },
  { name: "Status Code", value: data.response.status },
]

const TableRenderer = ({ data, renderEmpty }) => {
  const [activeRow, setActiveRow] = React.useState(null)
  const [rows, setRows] = React.useState(data)
  const [activeFilter, setActiveFilter] = React.useState("")

  const betterMatch = (data, filter) =>
    data.filter(({ url }) => filter.split(" ").every(i => url.includes(i)))

  React.useEffect(() => {
    setRows(activeFilter ? betterMatch(data, activeFilter) : data)
  }, [data, setRows])

  const onFilterChange = value => {
    if (!value) {
      setRows(data)
      setActiveFilter("")
    } else {
      setActiveFilter(value)
      setRows(betterMatch(data, value))
    }
  }

  // Reset active selected response
  React.useEffect(() => {
    if (!activeRow) return
    // If there are no visible rows (either filtered out, or cleared responses)
    if (rows.length === 0) {
      setActiveRow(null)
    }
  }, [rows, activeRow])

  const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1
      }
    }
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer)
  }

  const ExampleContextMenu = ({ idx, id, rowIdx }) => {
    return (
      <ContextMenu id={id}>
        <MenuItem
          data={{ rowIdx, idx }}
          onClick={() => {
            let index = 0
            let tempValue = `$temp${index}`
            do {
              index++
              tempValue = `$temp${index}`
            } while (global[tempValue] !== undefined)
            window._console.log(
              `Stored new global variable ${tempValue}`,
              (global[tempValue] = rows[rowIdx].response.body)
            )
          }}
        >
          Store response as global variable
        </MenuItem>
        <MenuItem
          data={{ rowIdx, idx }}
          onClick={() => {
            clipboard.writeText(JSON.stringify(rows[rowIdx].response.body))
          }}
        >
          Copy response to clipboard
        </MenuItem>
        <MenuItem
          data={{ rowIdx, idx }}
          onClick={() => {
            clipboard.writeText(apiRequestToCurl({ request: rows[rowIdx].request }))
          }}
        >
          Copy request as cURL
        </MenuItem>
      </ContextMenu>
    )
  }

  const hasValidJSONResponse = typeof (activeRow && activeRow.response.body) === "object"
  const urlQueryParams = activeRow && activeRow.url.split("?")[1]
  let hasUrlParams = activeRow ? !!urlQueryParams : false
  let urlParams = []
  if (hasUrlParams) {
    const urlParamsSplit = urlQueryParams.split("&")
    urlParams = urlParamsSplit.map(item => item.split("="))
  }

  return (
    <div>
      <NetworkHeader onFilterChange={onFilterChange} />
      <div>
        <ReactDataGrid
          columns={columns}
          rowGetter={i => rows[i]}
          rowsCount={rows.length}
          minHeight={"50vh"}
          rowHeight={25}
          enableCellAutoFocus={false}
          onRowClick={(index, data, columns) => setActiveRow(data)}
          onGridSort={(sortColumn, sortDirection) =>
            setRows(sortRows(data, sortColumn, sortDirection))
          }
          // Context Menu
          contextMenu={<ExampleContextMenu />}
          RowsContainer={ContextMenuTrigger}
        />
        <div
          style={{
            height: "50vh",
            fontSize: 13,
            borderTop: `1px solid ${Colors.lineLighter}`,
            background: Colors.background,
            color: Colors.foreground,
          }}
        >
          {activeRow ? (
            <Tabs>
              <TabList>
                <Tab>Headers</Tab>
                <Tab>Response</Tab>
                <Tab>Cookies 🍪</Tab>
              </TabList>

              <TabPanel>
                <ResponsePreview data={headers(activeRow).map(item => [item.name, item.value])} />
                <ResponsePreview
                  title={"Response Headers"}
                  data={activeRow.response.headers && Object.entries(activeRow.response.headers)}
                  raw={activeRow.response.headers}
                />
                <ResponsePreview
                  title={"Request Headers"}
                  data={activeRow.request.headers && Object.entries(activeRow.request.headers)}
                  raw={activeRow.request.headers}
                />
                {hasUrlParams && (
                  <ResponsePreview
                    title={"Query String Params"}
                    data={urlParams}
                    raw={urlQueryParams}
                  />
                )}

                {activeRow.request.data && (
                  <ResponsePreview
                    title={"Request Payload"}
                    object={JSON.parse(activeRow.request.data)}
                    raw={activeRow.request.data}
                  />
                )}
              </TabPanel>
              <TabPanel>
                {hasValidJSONResponse ? (
                  <ObjectTree object={activeRow.response.body} />
                ) : (
                  <iframe
                    style={{ width: "100%", height: "100%", border: 0 }}
                    src={`data:text/html,${activeRow.response.body || "No Response"}`}
                  ></iframe>
                )}
              </TabPanel>
              <TabPanel>
                {activeRow.request.headers.cookie && (
                  <ResponsePreview
                    data={activeRow.request.headers.cookie.split("; ").map(item => item.split("="))}
                    raw={activeRow.request.headers.cookie}
                  />
                )}
              </TabPanel>
            </Tabs>
          ) : (
            <h3 style={{ padding: 15, textAlign: "center" }}>Select request to see more details</h3>
          )}
        </div>
      </div>
    </div>
  )
}

export default TableRenderer
