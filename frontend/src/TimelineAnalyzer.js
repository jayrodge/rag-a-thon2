import React, { useEffect, useState } from 'react';
import { Progress, Collapse } from 'antd'; // Ant Design's collapse and progress components
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons for matching and non-matching criteria

const { Panel } = Collapse;

// Define eligibility criteria for each goal
const criteria = {
  "Research Grant": [
    { type: "Research Paper", requiredCount: 3, description: "Published in high-impact journals" },
    { type: "Patents", requiredCount: 2, description: "Related to the research" },
    { type: "Project", requiredCount: 1, description: "Major project or funding application" }
  ],
  "EB1A Application": [
    { type: "Patents", requiredCount: 2, description: "Patents or high-citation research papers" },
    { type: "Awards", requiredCount: 1, description: "International recognition" },
    { type: "Work Performance", requiredCount: 5, description: "Major contributions over 5 years" }
  ],
  "College Admissions": [
    { type: "Educational Record", requiredCount: 3, description: "Solid educational background" },
    { type: "Work Experience", requiredCount: 2, description: "Relevant work in the field" },
    { type: "Hackathons", requiredCount: 1, description: "Extracurricular achievements" }
  ],
  "Awards and Honors": [
    { type: "Awards", requiredCount: 2, description: "International or national awards" },
    { type: "Patents", requiredCount: 1, description: "High-profile projects" },
    { type: "Leadership", requiredCount: 1, description: "Leadership in work or education" }
  ]
};

function TimelineAnalyzer({ userGoal, timelineData }) {
  const [progress, setProgress] = useState(0);
  const [matchedCriteria, setMatchedCriteria] = useState([]);
  const [matchingEvents, setMatchingEvents] = useState([]);

  // Analyze timeline data and calculate progress based on the goal
  useEffect(() => {
    const analyzeTimeline = () => {
      const goalCriteria = criteria[userGoal] || [];
      let totalCriteria = goalCriteria.length;
      let matched = [];
      let matchedEvents = [];

      goalCriteria.forEach((criterion) => {
        const matchingItems = timelineData.filter(item => item.work_type === criterion.type);
        const matchedCount = matchingItems.length;

        if (matchedCount >= criterion.requiredCount) {
          matched.push(criterion);
          matchedEvents = [...matchedEvents, ...matchingItems]; // Add matching items to the events array
        }
      });

      // Calculate percentage match
      setProgress((matched.length / totalCriteria) * 100);
      setMatchedCriteria(matched);
      setMatchingEvents(matchedEvents); // Set matching events
    };

    analyzeTimeline();
  }, [userGoal, timelineData]);

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6 text-center">Timeline Analyzer</h2>

      {/* Collapsible sections */}
      <Collapse defaultActiveKey={['1']} expandIconPosition="end">

        {/* Progress Visualization Section */}
        <Panel header="Progress Visualization" key="1">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center mb-6">
            <h3 className="text-2xl font-semibold mb-4">Goal: {userGoal}</h3>

            {/* Progress Section */}
            <div className="flex items-center justify-center mb-8">
              <Progress
                type="circle"
                percent={progress}
                format={percent => `${percent.toFixed(2)}% Match`}
                strokeColor={progress >= 50 ? "#52c41a" : "#faad14"} // Dynamic colors based on progress
              />
            </div>

            {/* Criteria Matching */}
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-3">Criteria Matching:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {criteria[userGoal]?.map((criterion, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                    <span className="text-left text-sm">{criterion.description} ({criterion.type})</span>
                    {matchedCriteria.includes(criterion) ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>

        {/* Global Impact Visualization Section */}
        <Panel header="Global Impact of Publications" key="2">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center mb-6">
            <h4 className="text-lg font-bold mb-3">Global Impact</h4>
            {/* Embedded Local HTML content */}
            <iframe
              src="/global-impact.html"  // Reference to the local HTML file
              title="Global Impact Visualization"
              width="100%"
              height="500px"
              style={{ border: 'none', borderRadius: '8px' }}
            ></iframe>
          </div>
        </Panel>

        {/* Gephi Graph Visualization Section */}
        <Panel header="Gephi Graph Visualization" key="3">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center mb-6">
            <h4 className="text-lg font-bold mb-3">Gephi Graph</h4>
            {/* Embedded Local HTML for Gephi graph */}
            <iframe
              src="/gephi-graph.html" // Reference to the local HTML file
              title="Gephi Graph"
              width="100%"
              height="500px"
              style={{ border: 'none', borderRadius: '8px' }}
            ></iframe>
          </div>
        </Panel>

        {/* Matching Timeline Events Section */}
        <Panel header="Matching Timeline Events" key="4">
          <div className="bg-white shadow-lg rounded-lg p-8 text-left mb-6">
            <h4 className="text-lg font-bold mb-3">Matching Timeline Events</h4>
            <ul className="list-disc pl-5">
              {matchingEvents.length > 0 ? (
                matchingEvents.map((event, index) => (
                  <li key={index}>
                    <strong>{event.work_title}</strong> ({event.date_of_entry}) - {event.work_type}
                    <p>{event.work_description}</p>
                  </li>
                ))
              ) : (
                <p>No matching events found</p>
              )}
            </ul>
          </div>
        </Panel>

      </Collapse>
    </div>
  );
}

export default TimelineAnalyzer;
