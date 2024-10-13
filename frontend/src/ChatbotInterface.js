import React, { useState } from "react";

function ChatbotInterface() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Handle sending messages
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, isUser: true },
    ]);

    // Clear input field
    setInputValue("");

    // Simulate chatbot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "I'm here to assist you!", isUser: false },
      ]);
    }, 1000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Uploaded: ${file.name}`, isUser: true },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Center-aligned Heading */}
      <h2 className="text-3xl font-bold mb-4 text-center">Your Timeline Manager</h2>

      {/* Chat Window */}
      <div className="flex-grow bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
        <div className="flex-grow overflow-y-scroll bg-gray-100 p-4 rounded-lg space-y-4">
          {/* Display messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-full flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className="w-full flex items-center max-w-lg">
                {!message.isUser && (
                  <img
                    src="/images/bot_icon.png"
                    alt="Chatbot Icon"
                    className="w-8 h-8 mr-3 rounded-full"
                  />
                )}
                <div
                  className={`p-3 rounded-xl shadow-md text-sm w-full ${
                    message.isUser
                      ? "bg-blue-50 text-gray-800 border border-gray-300 rounded-br-none"
                      : "bg-blue-500 text-white rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
                {message.isUser && (
                  <img
                    src="/images/user_icon.png"
                    alt="User Icon"
                    className="w-8 h-8 ml-3 rounded-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* User Input Section */}
        <div className="mt-4 flex items-center bg-white rounded-lg shadow p-2 space-x-2">
          {/* Upload Icon */}
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            <img
              src="/images/upload_icon.png"
              alt="Upload Icon"
              className="w-6 h-6 hover:opacity-75 transition-opacity"
            />
          </label>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotInterface;
