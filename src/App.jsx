import Header from './components/HeaderFoulder/Header'
import RouterFunction from './Routes/Router'
import NotificationDisplay from './components/NotificationDisplay/NotificationDisplay';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header>
        <RouterFunction />
        <NotificationDisplay />
      </Header>
    </BrowserRouter>
  )
}

export default App