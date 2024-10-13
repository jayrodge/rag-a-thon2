import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";  // For passing props from App
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaGraduationCap, FaFileAlt, FaMedal, FaUserGraduate, FaEdit } from "react-icons/fa";
import ChatbotInterface from './ChatbotInterface';
import { getWorkData } from './api';
import TimelineAnalyzer from './TimelineAnalyzer';

function VisualizationDashboard() {
  const location = useLocation();
  const { userGoal } = location.state; // Receive userGoal from App.js

  const [activeTab, setActiveTab] = useState('timeline');
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({ work_type: '', work_title: '', work_description: '', date_of_entry: '' });

  // Fetch work data from the API
  useEffect(() => {
    const fetchData = async () => {
      const workData = getWorkData();
      setData(workData);
    };

    fetchData();
  }, []);

  // Function to get the appropriate icon based on work type
  const getWorkIcon = (workType) => {
    switch (workType) {
      case "Research Paper":
        return <FaFileAlt />;
      case "Patents":
        return <FaMedal />;
      case "Educational Record":
        return <FaGraduationCap />;
      default:
        return <FaUserGraduate />;
    }
  };

  // Handle edit button click
  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsEditing(true);
    setNewEntry({ ...entry });
  };

  // Handle form input change for both adding new and editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save for editing or adding a new entry
  const handleSave = () => {
    if (selectedEntry) {
      setData((prevData) =>
        prevData.map((entry) =>
          entry.date_of_entry === selectedEntry.date_of_entry ? newEntry : entry
        )
      );
    } else {
      setData((prevData) => [...prevData, newEntry]);
    }
    setIsEditing(false);
    setSelectedEntry(null);
    setNewEntry({ work_type: '', work_title: '', work_description: '', date_of_entry: '' });
  };

  const sortedData = data.sort((a, b) => new Date(b.date_of_entry) - new Date(a.date_of_entry));

  // Timeline component for rendering data
  const renderTimelineDashboard = () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4 text-center">Timeline Dashboard</h2>
      <button
        onClick={() => {
          setIsEditing(true);
          setSelectedEntry(null);
        }}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Add New Entry
      </button>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <VerticalTimeline>
          {sortedData.map((entry, index) => (
            <VerticalTimelineElement
              key={index}
              date={entry.date_of_entry}
              icon={getWorkIcon(entry.work_type)}
              iconStyle={{
                background: entry.work_type === "Patents" ? "#ffc107" : "#007bff",
                color: "#fff",
              }}
              contentStyle={{ background: "#f9f9f9", color: "#333" }}
              contentArrowStyle={{ borderRight: "7px solid  #f9f9f9" }}
            >
              <h3 className="vertical-timeline-element-title font-bold text-lg">
                {entry.work_title}
              </h3>
              <h4 className="vertical-timeline-element-subtitle text-gray-600">
                {entry.work_type}
              </h4>
              <p>{entry.work_description}</p>
              <button
                onClick={() => handleEdit(entry)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'timeline') {
      return renderTimelineDashboard();
    } else if (activeTab === 'chatbot') {
      return <ChatbotInterface />;
    } else if (activeTab === 'analyzer') {
      return <TimelineAnalyzer userGoal={userGoal} timelineData={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-teal-400 text-white py-8 px-8 shadow-md">
        <div className="container mx-auto flex items-center justify-start space-x-6">
          <img src="/logo1.png" alt="App Logo" className="w-32 h-auto" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Visualization Dashboard</h1>
        </div>
      </header>

      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-center border-b-2 border-gray-200">
          <button
            className={`py-2 px-4 text-lg font-semibold ${
              activeTab === 'timeline' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline Dashboard
          </button>
          <button
            className={`py-2 px-4 text-lg font-semibold ml-4 ${
              activeTab === 'chatbot' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('chatbot')}
          >
            Chatbot Interface
          </button>
          <button
            className={`py-2 px-4 text-lg font-semibold ml-4 ${
              activeTab === 'analyzer' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('analyzer')}
          >
            Timeline Analyzer
          </button>
        </div>

        <div className="mt-8">
          {isEditing ? (
            <div className="p-8 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-4">
                {selectedEntry ? "Edit Entry" : "Add New Entry"}
              </h2>
              <div className="mb-4">
                <label className="block mb-2">Work Type</label>
                <input
                  type="text"
                  name="work_type"
                  value={newEntry.work_type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Work Title</label>
                <input
                  type="text"
                  name="work_title"
                  value={newEntry.work_title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Work Description</label>
                <textarea
                  name="work_description"
                  value={newEntry.work_description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Date of Entry</label>
                <input
                  type="date"
                  name="date_of_entry"
                  value={newEntry.date_of_entry}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizationDashboard;
