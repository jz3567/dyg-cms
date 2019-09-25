import React from 'react'

export default function ({ location }) {
  return (
    <div>
      <h3>
          No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}
