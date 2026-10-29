import { useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './pages/Dashboard';

export default function App() { const { user } = useAuth(); return user ? <Dashboard /> : <AuthScreen />; }
