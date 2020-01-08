import React from "react"
import Colors from "../Theme/Colors"
import ObjectTree from "../Shared/ObjectTree"

const ResponsePreview = ({ title, data, object, raw }) => {
  if (!data && !object) return null
  const [showRaw, setShowRaw] = React.useState(false)
  const renderItem = ([name, value]) => (
    <div style={{ marginBottom: 5, marginLeft: 10 }} key={name}>
      <strong>{name}: </strong>
      <span style={{ fontFamily: "monospace", fontSize: 14 }}>{value}</span>
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
        color: Colors.foreground,
        borderTop: `1px solid ${Colors.lineLighter}`,
      }}
    >
      {label}
      {raw && (
        <span
          style={{
            fontWeight: "normal",
            fontSizel: `0.95em`,
            color: Colors.lineLighter,
            marginLeft: 15,
          }}
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? "view parsed" : "view raw"}
        </span>
      )}
    </div>
  )

  const renderRaw = () => {
    return (
      <pre style={{ whiteSpace: "pre-line" }}>
        {typeof raw === "object" ? JSON.stringify(raw) : raw}
      </pre>
    )
  }

  if (!object && (!data[0] || typeof data[0][0] !== "string")) {
    console.warn("Each item should have two strings [name, value]. Provided this data: ", data)
    return null
  }
  return (
    <>
      {title && renderSeparator(title)}
      {showRaw ? renderRaw() : object ? <ObjectTree object={object} /> : data.map(renderItem)}
    </>
  )
}
export default ResponsePreview
