import { BrowserRouter, Routes, Route } from 'react-router-dom';

function LoginPage() {
  return <h1>Login Page Working</h1>;
}

function DashboardPage() {
  return <h1>Dashboard Page Working</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
