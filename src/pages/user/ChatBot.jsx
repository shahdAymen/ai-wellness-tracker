import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Send,
  MessageSquare,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';

import "./ChatBot.css";

function App() {
  const [pdfLoaded, setPdfLoaded] = useState(true);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Welcome to Vitality Assistant Coach! 🏋️‍♂️🥗`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // =========================
  // تأكد إن الرابط ده هو أحدث رابط طالعلك من ngrok
  // =========================
  const API_URL = 'https://b48c-41-39-127-163.ngrok-free.app';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  // =========================
  // PROCESS FILE
  // =========================
  const processFile = async (file) => {
    if (!file) {
      alert('Please upload a valid file.');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'text/csv',
      'application/json'
    ];

    const validExtensions = ['pdf', 'csv', 'json'];

    const extension = file.name.split('.').pop().toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !validExtensions.includes(extension)
    ) {
      alert('Only PDF, CSV, and JSON files are supported.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress('Analyzing your file...');

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true' // تخطي صفحة ngrok
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setPdfLoaded(true);

        setMessages([
          {
            id: Date.now() - 1,
            text: "Your file has been processed successfully ✅\n\nAsk me anything about your uploaded data.",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        ]);

        setUploadProgress('');
        setInputValue('');
      } else {
        alert('Error uploading file: ' + data.error);
        setUploadProgress('');
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Make sure the backend is running.');
      setUploadProgress('');
    }
  };

  // =========================
  // FILE HANDLERS
  // =========================
  const handleFileUpload = (event) => {
    processFile(event.target.files[0]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;

    const userMessage = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // التعديل الأهم لتخطي ngrok
        },
        body: JSON.stringify({
          user_message: userText // التعديل عشان يطابق الباك إند
        })
      });

      const data = await response.json();

      // التعديل: قراءة data.reply بدل data.response لأن الباك إند بيرجع reply
      if (data.reply) {
        const aiMessage = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: `Error: ${JSON.stringify(data)}`,
            sender: 'error',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        ]);
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Connection error ❌\n\nPossible reasons:\n- Backend stopped\n- CORS issue\n- ngrok link changed',
          sender: 'error',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ENTER KEY
  // =========================
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // =========================
  // RESET SESSION
  // =========================
  const resetSession = () => {
    setMessages([
      {
        id: Date.now(),
        text: 'Welcome back to Vitality! 💪🥗\n\nHow can I help you today?',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  return (
    <div className="app-container">
      {/* BACKGROUND ORBS */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="glass-panel main-wrapper">
        {/* HEADER */}
        <header className="header">
          <div className="logo-section">
            <div className="logo-icon">
              <MessageSquare size={24} color="#fff" />
            </div>
            <div>
              <h1 className="title">Vitality</h1>
              <p className="subtitle">
                AI Fitness & Nutrition Assistant
              </p>
            </div>
          </div>

          {pdfLoaded && (
            <button
              className="new-chat-btn"
              onClick={resetSession}
            >
              <Plus size={18} />
              <span>New Session</span>
            </button>
          )}
        </header>

        {/* MAIN */}
        <main className="main-content">
          {!pdfLoaded ? (
            <div className="upload-view">
              <div
                className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${uploadProgress ? 'loading' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {uploadProgress ? (
                  <div className="upload-state">
                    <Loader2
                      size={48}
                      className="spin text-accent"
                    />
                    <h2>Processing File</h2>
                    <p className="pulse-text">
                      {uploadProgress}
                    </p>
                  </div>
                ) : (
                  <div className="upload-state">
                    <div className="upload-icon-wrapper">
                      <Upload
                        size={40}
                        className="text-accent"
                      />
                    </div>
                    <h2>Upload your file to begin</h2>
                    <p>
                      Drag & drop PDF, CSV, or JSON files
                    </p>
                    <label className="browse-btn">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.csv,.json"
                        style={{ display: 'none' }}
                      />
                      Browse Files
                    </label>
                    <div className="file-hint">
                      Supported formats: PDF, CSV, JSON
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="chat-view">
              <div className="chat-layout">
                {/* LEFT SIDE */}
                <aside className="doc-sidebar glass-panel-inner">
                  <div className="doc-header">
                    <MessageSquare
                      size={20}
                      className="text-accent"
                    />
                    <h3>Vitality</h3>
                  </div>
                </aside>

                {/* CHAT AREA */}
                <div className="chat-interface glass-panel-inner">
                  <div className="messages-area">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-row ${message.sender}`}
                      >
                        <div className="message-bubble">
                          <div className="message-content">
                            {message.text}
                          </div>
                          <div className="message-meta">
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="message-row ai">
                        <div className="message-bubble loading-bubble">
                          <Loader2
                            size={18}
                            className="spin text-accent"
                          />
                          <span>
                            Generating response...
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* INPUT */}
                  <div className="input-area">
                    <div className="input-box">
                      <textarea
                        value={inputValue}
                        onChange={(e) =>
                          setInputValue(e.target.value)
                        }
                        onKeyPress={handleKeyPress}
                        placeholder="Ask anything about meals, workouts, or uploaded data..."
                        disabled={loading}
                        rows="1"
                      />
                      <button
                        className="send-btn"
                        onClick={handleSendMessage}
                        disabled={
                          loading || !inputValue.trim()
                        }
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                    <div className="input-footer">
                      Press Shift + Enter for a new line
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;