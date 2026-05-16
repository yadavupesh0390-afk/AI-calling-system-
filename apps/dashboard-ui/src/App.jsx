import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateCampaign from './pages/CreateCampaign';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* ✅ ADD THIS INSIDE ROUTES */}
        <Route path="/create-campaign" element={<CreateCampaign />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
