import './App.css';
import Calendar from './Calendar';
import Profile from "./Profile";
import Auth from './Auth';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import CareHub from "./CareHub";
import GrowthLog from "./GrowthLog";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={
          localStorage.getItem("token")
            ? <Navigate to="/dashboard" />
            : <Navigate to="/auth" />
        }
      />

      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/carehub" element={<CareHub />} />
        <Route path="/growthlog" element={<GrowthLog />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
}


export default App;
