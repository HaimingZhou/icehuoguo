import React from 'react'
import { useRouteError } from 'react-router-dom'

interface ErrorMessage {
  statusText: string
  message: string
}

const Error: React.FC = () => {
  const error = useRouteError() as ErrorMessage
  return <>{error.statusText || error.message}</>
}

export default Error
