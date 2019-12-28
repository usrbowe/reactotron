import React, { Component } from "react"

const EmptyScreen = ({ title, description }) => (
  <div id="waiting" style={{ padding: 25, textAlign: "center" }}>
    <h1>{["🚀", "💡", "🤓", "🧐"][Math.floor(Math.random() * Math.floor(3))]}</h1>
    <h2>{title}</h2>
    <div>
      <div>{description}</div>
    </div>
  </div>
)

export default EmptyScreen
