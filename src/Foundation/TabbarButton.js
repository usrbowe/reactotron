import React from "react"
import PropTypes from "prop-types"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import { mergeAll } from "ramda"

const Styles = {
  container: {
    // ...AppStyles.Layout.vbox,
    alignItems: "center",
    color: Colors.foreground,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    minWidth: 35,
  },
  withText: {
    padding: "3px 14px",
  },
  containerTop: {
    borderTop: 0,
  },
  containerActive: {
    color: Colors.foregroundLight,
    background: Colors.backgroundDarker,
  },
  iconSize: 14,
  text: {
    paddingTop: 2,
    textAlign: "center",
    fontSize: 12,
    marginLeft: 5,
  },
}

const SidebarButton = props => {
  const { icon: Icon, iconSize, isActive, onClick, hideTopBorder, styles = {}, children } = props
  const containerStyles = mergeAll([
    Styles.container,
    styles,
    isActive ? Styles.containerActive : {},
    hideTopBorder ? Styles.containerTop : {},
    props.text ? Styles.withText : {},
  ])

  return (
    <div style={containerStyles} onClick={onClick}>
      {Icon && <Icon size={iconSize || Styles.iconSize} />}
      {children}
      <div style={Styles.text}>{props.text}</div>
    </div>
  )
}

SidebarButton.propTypes = {
  icon: PropTypes.any,
  iconSize: PropTypes.number,
  text: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  hideTopBorder: PropTypes.bool,
}

export default SidebarButton
