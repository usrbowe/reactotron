import React from "react"
import PropTypes from "prop-types"
import JSONTree from "react-json-tree"
import Colors from "../Theme/Colors"
import ErrorBoundary from "./ErrorBoundary"

const theme = { ...Colors.theme }

const Styles = {
  container: {},
  theme: {
    tree: { backgroundColor: "transparent", marginTop: -3 },
    ...theme,
  },
  muted: {
    color: Colors.lineLighter,
  },
  preview: {
    color: Colors.warning,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
    width: "50%",
    verticalAlign: "bottom",
  },
}

function getShortTypeString(val) {
  if (val === null) {
    return "null"
  } else if (val === undefined) {
    return "undef"
  } else if (Array.isArray(val)) {
    return val.length > 0 ? "[…]" : "[]"
  } else if (typeof val === "object") {
    return Object.keys(val).length > 0 ? "{…}" : "{}"
  } else if (typeof val === "function") {
    return "fn"
  } else if (typeof val === "string") {
    return `"${val.substr(0, 10) + (val.length > 10 ? "…" : "")}"`
  } else if (typeof val === "symbol") {
    return "symbol"
  } else {
    return val
  }
}

const getTheme = base16Theme => ({
  extend: base16Theme,
  nestedNode: ({ style }, keyPath, nodeType, expanded) => ({
    style: {
      ...style,
      whiteSpace: expanded ? "inherit" : "nowrap",
    },
  }),
  nestedNodeItemString: ({ style }, keyPath, nodeType, expanded) => ({
    style: {
      ...style,
      display: expanded ? "none" : "inline",
    },
  }),
})

const ObjectTree = props => {
  const { object, level = 1 } = props

  return (
    <div style={Styles.container}>
      <ErrorBoundary>
        <JSONTree
          data={object}
          hideRoot
          // shouldExpandNode={(keyName, data, minLevel) => minLevel <= level}
          theme={getTheme(theme)}
          invertTheme={Colors.invertTheme}
          invertTheme={false}
          getItemString={(type, data, itemType, itemString) => {
            if (type === "Object") {
              const keys = Object.keys(data)
              if (!keys) return "{}"
              const str = keys
                .slice(0, 3)
                .map(key => `${key}: ${getShortTypeString(data[key])}`)
                .concat(keys.length > 3 ? ["…"] : [])
                .join(", ")

              return `{ ${str} }`
            }
            return (
              <span style={Styles.muted}>
                {itemType} {itemString}
              </span>
            )
          }}
          valueRenderer={(transformed, untransformed) => {
            return `${untransformed || transformed}`
          }}
        />
      </ErrorBoundary>
    </div>
  )
}

ObjectTree.propTypes = {
  object: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  level: PropTypes.number,
}

export default ObjectTree
