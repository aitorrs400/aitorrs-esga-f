import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './routes';
import { theme } from './theme/mainTheme';
import './App.css';

const App = () => {

  return (
    <AuthProvider>
      <ThemeProvider theme={ theme }>
        <AppRouter />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App;
