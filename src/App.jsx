import Desktop from './components/Desktop'
import { WindowProvider } from './windowStore'

export default function App() {
  return (
    <WindowProvider>
      <Desktop />
    </WindowProvider>
  )
}
