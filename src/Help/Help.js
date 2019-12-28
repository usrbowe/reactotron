import React from "react"
import Colors, { themeNames } from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import Header from "../Foundation/Header"
import HelpKeystrokes from "./HelpKeystrokes"
import HelpFeedback from "./HelpFeedback"
import ErrorBoundary from "../Shared/ErrorBoundary"

const FEEDBACK = "Let's Connect!"
const KEYSTROKES = "Keystrokes"
const SETTINGS = "Settings 💅"
const pjson = require("../../package.json")

const logoUrl = require("../Theme/Reactotron-128.png")

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  content: {
    padding: 20,
    overflowY: "scroll",
    overflowX: "hidden",
    ...AppStyles.Layout.vbox,
  },
  logoPanel: {
    alignSelf: "center",
  },
  logo: {
    alignSelf: "center",
    height: 128,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.foregroundLight,
    paddingBottom: 2,
    borderBottom: `1px solid ${Colors.lineLighter}`,
  },
}

const Help = () => {
  const [theme, setTheme] = React.useState(localStorage.getItem("themeName"))
  return (
    <div style={Styles.container}>
      <ErrorBoundary>
        <Header title={`Using ${pjson.productName} ${pjson.version}`} />
        <div style={Styles.content}>
          <div style={Styles.title}>{SETTINGS}</div>
          <form>
            <select
              value={theme}
              style={{ height: 35 }}
              onChange={e => {
                console.log(e.target.value)
                setTheme(e.target.value)
                localStorage.setItem("themeName", e.target.value)
              }}
            >
              {themeNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </form>
          <span>Changing theme needs restarting the app 🙏</span>

          <div style={Styles.title}>{FEEDBACK}</div>
          <HelpFeedback />

          <div style={Styles.title}>{KEYSTROKES}</div>
          <HelpKeystrokes />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default Help
