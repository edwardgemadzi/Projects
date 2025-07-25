import './App.css'
import Movies from './Effect'
import Counter from './State'
import Button from './Context'
import { ThemeProvider } from './Context'

function App() {


  return (
    // <>
    //   <Counter />
    //   <Movies />
    // </>

    <ThemeProvider>
      <Button />
    </ThemeProvider>
  )
}

export default App
