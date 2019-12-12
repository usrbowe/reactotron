import React from "react"
import ReactDataGrid from "react-data-grid"
import ReactJson from "react-json-view"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import Colors from "../Theme/Colors"

const ColorCellFormatter = ({ value }) => {
  return <span style={{ color: value >= 400 ? "red" : "green" }}>{value}</span>
}

const columns = [
  { key: "shortUrl", name: "Name", resizable: true, sortable: true, width: 400 },
  { key: "method", name: "Method", resizable: true, sortable: true, width: 60 },
  {
    key: "status",
    name: "Status",
    resizable: true,
    sortable: true,
    formatter: ColorCellFormatter,
    width: 80,
  },
  { key: "domain", name: "Domain", resizable: true, sortable: true, width: 300 },
  { key: "time", name: "Time", resizable: true, sortable: true, width: 100 },
]

const headers = data => [
  { name: "Request URL", value: data.request.url },
  { name: "Request Method", value: data.request.method },
  { name: "Status Code", value: data.response.status },
]

const TableRenderer = ({ data }) => {
  const [activeRow, setActiveRow] = React.useState(null)
  const [rows, setRows] = React.useState(data)

  React.useEffect(() => {
    setRows(data)
  }, [data, setRows])

  const renderItem = item => (
    <div style={{ marginBottom: 5, marginLeft: 10 }}>
      <strong style={{ fontFamily: "sans-serif" }}>{item.name}: </strong>
      <span style={{ fontFamily: "monospace", fontSize: 14 }}>{item.value}</span>
    </div>
  )
  const renderSeparator = label => (
    <div
      style={{
        marginTop: 15,
        marginBottom: 5,
        padding: 5,
        marginLeft: -5,
        marginRight: -5,
        fontWeight: "bold",
        fontSize: 14,
        color: Colors.foreground,
        borderTop: `1px solid ${Colors.foreground}`,
      }}
    >
      {label}
    </div>
  )
  const createMarkup = () => {
    return { __html: activeRow ? activeRow.response.body : "No Response" }
  }
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
  const hasValidJSONResponse = typeof (activeRow && activeRow.response.body) === "object"
  let hasUrlParams = activeRow ? !!activeRow.url.split("?")[1] : false
  let urlParams = []
  if (hasUrlParams) {
    const urlParamsSplit = activeRow.url.split("?")[1].split("&")
    urlParams = urlParamsSplit.map(item => {
      const [name, value] = item.split("=")
      return { name, value }
    })
  }
  return (
    <div>
      <ReactDataGrid
        columns={columns}
        rowGetter={i => rows[i]}
        rowsCount={rows.length}
        // minHeight={"100vh"}
        rowHeight={25}
        enableCellAutoFocus={false}
        onRowClick={(index, data, columns) => setActiveRow(data)}
        onGridSort={(sortColumn, sortDirection) =>
          setRows(sortRows(data, sortColumn, sortDirection))
        }
      />
      {activeRow && (
        <div
          style={{
            position: "fixed",
            height: "50vh",
            bottom: 26,
            left: 0,
            right: 0,
            fontSize: 13,
            borderTop: "1px solid black",
            background: "rgb(30, 30, 30)",
            color: Colors.foreground,
          }}
        >
          <Tabs>
            <TabList>
              <Tab>Headers</Tab>
              <Tab>Response</Tab>
            </TabList>

            <TabPanel>
              {headers(activeRow).map(renderItem)}
              {renderSeparator("Response Headers")}
              {Object.entries(activeRow.response.headers).map(([key, value]) =>
                renderItem({ name: key, value })
              )}
              {renderSeparator("Request Headers")}
              {Object.entries(activeRow.request.headers).map(([key, value]) =>
                renderItem({ name: key, value })
              )}
              {hasUrlParams && (
                <>
                  {renderSeparator("Query String Params")}
                  {urlParams.map(renderItem)}
                </>
              )}
            </TabPanel>
            <TabPanel>
              <div>
                {hasValidJSONResponse ? (
                  <ReactJson
                    style={{ fontFamily: "sans-serif", backgroundColor: "inherit" }}
                    src={activeRow.response.body}
                    displayDataTypes={false}
                    // collapsed={false}
                    theme={"brewer"}
                    indentWidth={2}
                    displayObjectSize={false}
                    groupArraysAfterLength={99}
                    sortKeys
                    // shouldCollapse={({ name, src, type, namespace }) => {
                    //   console.log({ name, src, type, namespace })
                    //   return false
                    // }}
                  />
                ) : (
                  <div style={{ background: "white", padding: 10 }}>
                    <div dangerouslySetInnerHTML={createMarkup()} />
                  </div>
                )}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default TableRenderer
