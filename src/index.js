import React from 'react'
import styles from './styles.module.css'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export const MyDiv = ({ text, ...props}) => {
  return <div {...props}>{text}</div>
}

export * from './admin-dashboard'
