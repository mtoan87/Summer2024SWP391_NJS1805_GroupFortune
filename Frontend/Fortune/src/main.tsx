import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './WebApplication/Data/UserContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>
  // </React.StrictMode>
)