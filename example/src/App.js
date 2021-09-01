import React from 'react'

import { ExampleComponent, MyDiv, Utils} from '@alessio.filippucci/npmsample'
import '@alessio.filippucci/npmsample/dist/index.css'

const App = () => {
  console.log(Utils.GetFullHostName());
  return (
    <>
      <ExampleComponent text="Create React Library Example 😄" />
      <MyDiv text="Cicciolo" style={{ border: '10px dotted #ff0000' }} />
    </>
  )
}

export default App
