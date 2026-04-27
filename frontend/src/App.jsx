import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import WorkDetailPage from './pages/WorkDetailPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './context/AuthContext.jsx';

const UploadRoute = () => {
  const { canUpload, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return canUpload ? <UploadPage /> : <GalleryPage />;
};

/**
 * Main App Component
 * Sets up routing for the Digital Wellness Course Showcase Platform
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadRoute />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/work/:id" element={<WorkDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
