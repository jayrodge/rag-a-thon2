import React from "react";

function FormModal({
  isModalOpen,
  closeModal,
  googleScholarLink,
  setGoogleScholarLink,
  userGoal,
  setUserGoal,
  file,
  handleFileUpload,
  handleSubmit,
}) {
  const isFormComplete = file && googleScholarLink && userGoal;

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
            <h2 className="text-3xl font-extrabold mb-4 text-center">Start Your Journey</h2>
            <p className="text-gray-700 text-center mb-8">
              Begin your journey by providing the following details.
            </p>

            {/* Google Scholar Link Field */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <img src="/images/link_icon.png" alt="Link Icon" className="w-6 h-6 mr-3" />
                <h3 className="font-bold text-lg">Google Scholar Link</h3>
              </div>
              <input
                type="text"
                value={googleScholarLink}
                onChange={(e) => setGoogleScholarLink(e.target.value)}
                placeholder="Enter your Google Scholar link"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              />
            </div>

            {/* User Goal Dropdown */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <img src="/images/goal_icon.png" alt="Goal Icon" className="w-6 h-6 mr-3" />
                <h3 className="font-bold text-lg">Your Goal</h3>
              </div>
              <select
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              >
                <option value="">Select your goal</option>
                <option value="Research Grant">Research Grant</option>
                <option value="EB1A Application">EB1A Application</option>
                <option value="College Admissions">College Admissions</option>
                <option value="Awards and Honors">Awards and Honors</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <img src="/images/file_icon.png" alt="File Icon" className="w-6 h-6 mr-3" />
                <h3 className="font-bold text-lg">Upload Zip File</h3>
              </div>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="py-2 px-4 border border-gray-300 rounded-lg cursor-pointer"
              />
              {file && <p className="mt-4 text-green-600">File uploaded: {file.name}</p>}
            </div>

            {/* Grid for Important Tips */}
            <h3 className="font-bold text-lg mb-4 text-gray-700">Important Tips for Document Submission</h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex items-center">
                <img src="/images/icon_1.png" alt="Icon 1" className="w-10 h-10 mr-4" />
                <p className="text-gray-700">Awards and Recognitions</p>
              </div>
              <div className="flex items-center">
                <img src="/images/icon_2.png" alt="Icon 2" className="w-10 h-10 mr-4" />
                <p className="text-gray-700">Research and Original Work</p>
              </div>
              <div className="flex items-center">
                <img src="/images/icon_3.png" alt="Icon 3" className="w-10 h-10 mr-4" />
                <p className="text-gray-700">Resume and Statement of Purpose</p>
              </div>
              <div className="flex items-center">
                <img src="/images/icon_4.png" alt="Icon 4" className="w-10 h-10 mr-4" />
                <p className="text-gray-700">Work Experience and Performance Review</p>
              </div>
              <div className="flex items-center">
                <img src="/images/icon_5.png" alt="Icon 5" className="w-10 h-10 mr-4" />
                <p className="text-gray-700">Certification and Skillset</p>
              </div>
              <div className="flex items-center">
                <img src="/images/icon_6.png" alt="Icon 6" className="w-10 h-10 mr-4" />
                <p className="text-gray-700">Letter of Recommendations</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete} // Disable if form is incomplete
                className={`${
                  isFormComplete ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
                } text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105`}
              >
                Submit and Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FormModal;
