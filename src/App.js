import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/auth';
import Routes from './routes';

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
