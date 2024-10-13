import React from "react";

function MainLayout({ openModal }) {
  return (
    <>
      {/* Title Banner */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-400 text-white py-8 px-8 shadow-md">
        <div className="container mx-auto flex items-center justify-start space-x-6">
          <img src="/logo1.png" alt="App Logo" className="w-32 h-auto" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Timeline of You</h1>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">The Pursuit of Happiness</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {/* Image 1 */}
          <div className="relative">
            <img
              src="/images/highlight_1.png"
              alt="Chasing New Horizons"
              className="w-full h-80 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Chasing New Horizons
            </h3>
          </div>

          {/* Image 2 */}
          <div className="relative">
            <img
              src="/images/highlight_5.png"
              alt="The Power of Habits"
              className="w-full h-80 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              The Power of Habits
            </h3>
          </div>

          {/* Image 3 */}
          <div className="relative">
            <img
              src="/images/highlight_4.png"
              alt="Overcoming Setbacks"
              className="w-full h-80 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Overcoming Setbacks
            </h3>
          </div>
        </div>

        {/* Navigating the Complex Road Section */}
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Navigating the Complex Road</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-20">
          <div className="relative">
            <img
              src="/images/image_1.png"
              alt="Time Management"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Time Management
            </h3>
          </div>
          <div className="relative">
            <img
              src="/images/image_2.png"
              alt="Technical Workload"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Technical Workload
            </h3>
          </div>
          <div className="relative">
            <img
              src="/images/image_3.png"
              alt="Legal Procedures"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Legal Procedures
            </h3>
          </div>
          <div className="relative">
            <img
              src="/images/image_4.png"
              alt="Self Doubt"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Self Doubt
            </h3>
          </div>
        </div>

        {/* Unlocking Your Potential Section */}
        <h2 className="text-4xl font-bold text-gray-800 mb-12 mt-20 text-center">Unlocking Your Potential</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-20">
          {/* Grid Item 1 */}
          <div className="relative">
            <img
              src="/images/potential_1.png"
              alt="SOP Building"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              SOP Building
            </h3>
          </div>

          {/* Grid Item 2 */}
          <div className="relative">
            <img
              src="/images/potential_2.png"
              alt="Extraordinary Visa Filing"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Extraordinary Visa Filing
            </h3>
          </div>

          {/* Grid Item 3 */}
          <div className="relative">
            <img
              src="/images/potential_3.png"
              alt="Career Development"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Career Development
            </h3>
          </div>

          {/* Grid Item 4 */}
          <div className="relative">
            <img
              src="/images/potential_4.png"
              alt="Winning Accolades and Awards"
              className="w-full h-64 object-cover object-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h3 className="absolute bottom-4 left-0 w-full bg-white bg-opacity-90 py-2 px-4 text-center text-gray-800 font-semibold text-lg">
              Winning Accolades and Awards
            </h3>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Shape Your Future, One Step at a Time</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-20">
            {/* Success Image 1 */}
            <div className="inline-block bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/success_image1.png"
                alt="Immigrant Success 1"
                className="w-full h-full object-cover"
              />
              <h3 className="py-2 px-4 text-center text-gray-800 font-semibold text-lg">
                Immigrant Success 1
              </h3>
            </div>

            {/* Success Image 2 */}
            <div className="inline-block bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/success_image2.png"
                alt="Immigrant Success 2"
                className="w-full h-full object-cover"
              />
              <h3 className="py-2 px-4 text-center text-gray-800 font-semibold text-lg">
                Immigrant Success 2
              </h3>
            </div>

            {/* Success Image 3 */}
            <div className="inline-block bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/success_image3.png"
                alt="Immigrant Success 3"
                className="w-full h-full object-cover"
              />
              <h3 className="py-2 px-4 text-center text-gray-800 font-semibold text-lg">
                Immigrant Success 3
              </h3>
            </div>
          </div>

          <button
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105"
          >
            Start Your Journey
          </button>
        </div>
      </main>
    </>
  );
}

export default MainLayout;
