import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import MyPlants from './components/MyPlants';
import { Navbar } from './components/navbar';
import NotFound from './components/NotFound';
import PlantDetail from './components/PlantDetail';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-plants" element={<MyPlants />} />
          <Route path="/my-plants/:id" element={<PlantDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
