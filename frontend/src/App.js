import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from './MainLayout'; // Import main layout component
import FormModal from './FormModal'; // Import modal component
import VisualizationDashboard from './VisualizationDashboard'; // Import dashboard

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [googleScholarLink, setGoogleScholarLink] = useState("");
  const [userGoal, setUserGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  // Handle form submission with 30-second delay and pass props
  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Pass props to VisualizationDashboard
      navigate("/dashboard", { state: { googleScholarLink, userGoal, file } });
    }, 30000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainLayout openModal={openModal} />

      <FormModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        googleScholarLink={googleScholarLink}
        setGoogleScholarLink={setGoogleScholarLink}
        userGoal={userGoal}
        setUserGoal={setUserGoal}
        file={file}
        handleFileUpload={handleFileUpload}
        handleSubmit={handleSubmit}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="text-center">
            <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Thank you for your submission, curating your timeline...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<VisualizationDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
