import Color from "color"
import { createStyling } from "react-base16-styling"
import * as base16Colors from "base16"

// https://github.com/chriskempson/base16/blob/master/styling.md

const getStylingFromBase16 = base16Theme => ({
  roles: {
    backgroundDarker: Color(base16Theme.base00)
      .darken(0.1)
      .hsl()
      .string(),
    modalOverlay: Color(base16Theme.base00)
      .darken(0.4)
      .hsl()
      .fade(0.05)
      .string(),
    background: base16Theme.base00, // base00 - Default Background
    backgroundSubtleLight: Color(base16Theme.base00)
      .lighten(0.05)
      .hsl()
      .string(),
    backgroundSubtleDark: Color(base16Theme.base00)
      .darken(0.3)
      .hsl()
      .string(),
    backgroundLighter: base16Theme.base01, // base01 - Lighter Background (Used for status bars)
    lineLighter: base16Theme.base03, // base03 - complimentary border for backgroundLighter
    line: Color(base16Theme.base01)
      .darken(0.1)
      .hsl()
      .string(),
    subtleLine: Color(base16Theme.base01)
      .darken(0.2)
      .hsl()
      .string(),
    backgroundHighlight: base16Theme.base02, // base02 - Selection Background
    highlight: Color(base16Theme.base03)
      .lighten(0.3)
      .hsl()
      .string(), // base03 - Comments, Invisibles, Line Highlighting
    foregroundDark: base16Theme.base04, // base04 - Dark Foreground (Used for status bars)
    foreground: base16Theme.base05, // base05 - Default Foreground, Caret, Delimiters, Operators
    foregroundLight: base16Theme.base06, // base06 - Light Foreground (Not often used)
    backgroundLight: base16Theme.base07, // base07 - Light Background (Not often used)
    tag: base16Theme.base08, // base08 - Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
    tagComplement: Color(base16Theme.base08)
      .lighten(0.65)
      .hsl()
      .string(),
    constant: base16Theme.base09, // base09 - Integers, Boolean, Constants, XML Attributes, Markup Link Url
    bold: base16Theme.base0A, // base0A - Classes, Markup Bold, Search Text Background
    glow: Color(base16Theme.base00)
      .darken(0.2)
      .fade(0.2)
      .hsl()
      .string(),
    string: base16Theme.base0B, // base0B - Strings, Inherited Class, Markup Code, Diff Inserted
    support: base16Theme.base0C, // base0C - Support, Regular Expressions, Escape Characters, Markup Quotes
    heading: base16Theme.base0D, // base0D - Functions, Methods, Attribute IDs, Headings
    keyword: base16Theme.base0E, // base0E - Keywords, Storage, Selector, Markup Italic, Diff Changed
    warning: base16Theme.base0F, // base0F - Deprecated, Opening/Closing Embedded Language Tags e.g. <?php ?>
    chrome: Color(base16Theme.base00)
      .lighten(0.1)
      .hsl()
      .string(),
    chromeLine: Color(base16Theme.base00)
      .lighten(0.25)
      .hsl()
      .string(),
  },
  theme: base16Theme, // TODO: figure out why I'm doing this?
})

export const ChromeDark = {
  base00: "#242424",
  base01: "#2a2a2a",
  base02: "#363636",
  base03: "#404040",
  base04: "#777777",
  base05: "#a5a5a5",
  special00: "#5db0d7",
  special01: "#a1f7b5",
  special02: "#f29766",
  special03: "#d2c057",
  special04: "#34d1c5",
  special05: "#9a7fd5",
  special06: "#9bbbdc",
  special07: "#777777",
  state00: "#c78626",
  state01: "#363636",
  state02: "#242424",
  state03: "#342e24",
  state04: "#66ff88",
  state05: "#242424",
  state06: "#cccccc",
}

export const ChromeDefault = {
  base00: "#ffffff",
  base01: "#f3f3f3",
  base02: "#eeeeee",
  base03: "#dadada",
  base04: "#888888",
  base05: "#5a5a5a",
  special00: "#881280",
  special01: "#222222",
  special02: "#1a1aa6",
  special03: "#c80000",
  special04: "#236e25",
  special05: "#aa0d91",
  special06: "#994500",
  special07: "#888888",
  state00: "#3879d9",
  state01: "#dadada",
  state02: "#ffffff",
  state03: "#ebf1fb",
  state04: "#FFFF00",
  state05: "#222222",
  state06: "#222222",
}

// http://chriskempson.github.io/base16/
const base16Themes = Object.keys(base16Colors).filter(t => t !== "__esModule")
const customThemes = {
  chromedark: {
    name: "chrome dark",
    colors: ChromeDark,
  },
  chromelight: {
    name: "chrome light",
    colors: ChromeDefault,
  },
}
export const themeNames = [...base16Themes, ...Object.keys(customThemes)]

// the natural or inverted look
const invertTheme = false

// some kind of wierd factory?
const createStylingFromTheme = createStyling(getStylingFromBase16, {})

// here's where I think i should be allowing user customization?
// FIXME: light mode doesn't look really good
// const isDarkMode = localStorage.getItem("isDarkMode")
// const styling = createStylingFromTheme(
//   isDarkMode === undefined ? ChromeDark : isDarkMode ? ChromeDark : ChromeDefault
// )
const userPickedTheme = localStorage.getItem("themeName")
const selectedTheme =
  (customThemes[userPickedTheme] && customThemes[userPickedTheme].colors) || userPickedTheme
const styling = createStylingFromTheme(selectedTheme || ChromeDark)

// fish out the roles because I haven't committed fully to styling in the components just yet
const roles = styling("roles").style

// awkwardly expose the theme for the ObjectTree component
const theme = styling("theme").style

export default {
  ...roles,
  theme,
  invertTheme,
}
