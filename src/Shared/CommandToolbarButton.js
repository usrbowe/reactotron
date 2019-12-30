import React from "react"
import PropTypes from "prop-types"
import Colors from "../Theme/Colors"
import ReactTooltip from "react-tooltip"

const Styles = {
  container: {
    display: "flex",
    color: Colors.foregroundDark,
    cursor: "pointer",
  },
  iconSize: 24,
  icon: {},
}

const CommandToolbarButton = props => {
  const { tip, icon: Icon, onClick, size, style } = props

  return (
    <div data-tip={tip} onClick={onClick} style={Styles.container}>
      <Icon size={size || Styles.iconSize} style={style || Styles.icon} />
      <ReactTooltip place="bottom" effect="solid" html className="tooltipTheme" />
    </div>
  )
}

CommandToolbarButton.propTypes = {
  tip: PropTypes.string,
  icon: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number,
  style: PropTypes.object,
}

export default CommandToolbarButton
