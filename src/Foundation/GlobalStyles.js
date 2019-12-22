import React from "react"

import Colors from "../Theme/Colors"

const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
  * {
    --color-background: ${Colors.background};
    --color-backgroundDarker: ${Colors.backgroundDarker};
    --color-backgroundLighter: ${Colors.backgroundLighter};
    --color-foregroundDark: ${Colors.foregroundDark};
    --color-foregroundLight: ${Colors.foregroundLight};
    --color-highlight: ${Colors.theme.state00};
    --color-lineLighter: ${Colors.lineLighter};
  }
`,
    }}
  />
)

export default GlobalStyles
