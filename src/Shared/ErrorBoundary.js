import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1 style={{ textAlign: "center" }}>This screen crashed</h1>
          <pre
            style={{
              whiteSpace: "pre-line",
              padding: 15,
              color: "red",
            }}
          >
            {`ERROR:
------
${JSON.stringify(this.state.error)}


INFO:
------
${JSON.stringify(this.state.errorInfo)}
`}
          </pre>
        </>
      )
    }

    return this.props.children
  }
}
