import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Send,
  MessageSquare,
  Plus,
  ArrowRight,
  Loader2,
  X,
  FileText,
  Sparkles,
  RefreshCw,
  Settings
} from 'lucide-react';
import './VigoCoach.css';

// ==========================================
// 🔴 UPDATE YOUR NGROK URL HERE EVERY TIME
// ==========================================
const DEFAULT_API_URL = 'https://0400-41-39-127-163.ngrok-free.app';

export default function VigoCoach({ isOpen, onClose }) {
  const [pdfLoaded, setPdfLoaded] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to Vigo Coach! 🏋️‍♂️🥗\n\nI am your AI Fitness & Nutrition assistant. Ask me anything about custom meal plans, workouts, or upload your health files to get started!",
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
  const [showSettings, setShowSettings] = useState(false);

  // ngrok endpoint from your backend
  const [apiUrl, setApiUrl] = useState(() => {
    const saved = localStorage.getItem('vigo_api_url');
    // Automatically switch to new DEFAULT_API_URL if it has been updated in the code
    if (!saved || (saved.includes('ngrok-free.app') && saved !== DEFAULT_API_URL)) {
      return DEFAULT_API_URL;
    }
    return saved.trim();
  });

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);

  // Sync API URL to localStorage
  useEffect(() => {
    localStorage.setItem('vigo_api_url', apiUrl);
  }, [apiUrl]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // =========================
  // FILE UPLOAD PROCESS
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
    setUploadedFileName(file.name);

    try {
      setUploadProgress(`Analyzing ${file.name}...`);

      const cleanUrl = apiUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/upload`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setPdfLoaded(true);
        setMessages([
          {
            id: Date.now() - 1,
            text: `Successfully processed: "${file.name}" ✅\n\nAsk me anything about your uploaded file data!`,
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
        setUploadedFileName('');
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please verify the Vigo Coach API URL in settings and make sure your backend server is running.');
      setUploadProgress('');
      setUploadedFileName('');
    }
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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
      const cleanUrl = apiUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_message: userText
        })
      });

      const data = await response.json();

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
            text: `Error parsing reply: ${JSON.stringify(data)}`,
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
          text: 'Connection error ❌\n\nPossible reasons:\n- Backend is stopped or offline\n- CORS configuration issue\n- ngrok tunnel has changed or expired\n\n💡 Tip: You can update the API URL by clicking the Settings gear icon in the header.',
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetSession = () => {
    setUploadedFileName('');
    setMessages([
      {
        id: Date.now(),
        text: 'Welcome back to Vigo! 💪🥗\n\nHow can I support your health journey today?',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  return (
    <>
      {/* Overlay Background */}
      <div
        className={`vigo-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sliding Sidebar Drawer */}
      <aside
        ref={sidebarRef}
        className={`vigo-sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Vigo AI Wellness Coach Sidebar"
      >
        {/* Glow Orbs in Background */}
        <div className="vigo-bg-orb vigo-orb-1" />
        <div className="vigo-bg-orb vigo-orb-2" />

        {/* Header */}
        <header className="vigo-header">
          <div className="vigo-logo-section">
            <div className="vigo-logo-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="vigo-title">Vigo</h2>
              <p className="vigo-subtitle">AI Wellness & Fitness Coach</p>
            </div>
          </div>

          <div className="vigo-actions">
            {pdfLoaded && (
              <button
                className="vigo-header-btn"
                onClick={resetSession}
                title="New Session"
              >
                <Plus size={18} />
              </button>
            )}
            <button
              className={`vigo-header-btn ${showSettings ? 'text-emerald-500' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              className="vigo-header-btn"
              onClick={onClose}
              title="Close Panel"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Settings Sub-Header */}
        {showSettings && (
          <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-app z-10 animate-fade-in">
            <label className="block text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">
              Vigo Coach API Endpoint (ngrok)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value.trim())}
                placeholder="https://YOUR-SUBDOMAIN.ngrok-free.app"
                className="flex-1 bg-app-surface text-app text-sm rounded-lg border border-app px-3 py-1.5 focus:outline-none"
              />
              <button
                onClick={() => {
                  setApiUrl(DEFAULT_API_URL);
                  setShowSettings(false);
                }}
                className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold px-2 py-1.5"
                title="Reset to Default URL"
              >
                Default
              </button>
            </div>
            <p className="text-[10px] text-app-muted mt-1.5">
              Paste your latest ngrok URL here if the backend server restarts.
            </p>
          </div>
        )}

        {/* File State Indicator */}
        {pdfLoaded && uploadedFileName && (
          <div className="vigo-file-status-indicator mt-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText size={14} className="flex-shrink-0" />
              <span className="truncate">{uploadedFileName}</span>
            </div>
            <button
              onClick={() => {
                setUploadedFileName('');
                setPdfLoaded(false);
              }}
              title="Remove File"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="vigo-content">
          {!pdfLoaded ? (
            <div className="vigo-upload-view">
              <div
                className={`vigo-dropzone ${isDragging ? 'dragging' : ''} ${uploadProgress ? 'loading' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {uploadProgress ? (
                  <div className="vigo-processing-state">
                    <Loader2 size={40} className="vigo-spin text-emerald-500" />
                    <h3>Processing File</h3>
                    <p className="vigo-pulse-text">{uploadProgress}</p>
                  </div>
                ) : (
                  <>
                    <div className="vigo-upload-icon-box">
                      <Upload size={32} />
                    </div>
                    <h3>Upload files to begin</h3>
                    <p>Drag & drop PDF, CSV, or JSON wellness/fitness files here</p>
                    <label className="vigo-browse-btn cursor-pointer">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.csv,.json"
                        style={{ display: 'none' }}
                      />
                      Browse Files
                    </label>
                    <div className="vigo-hint">Supported formats: PDF, CSV, JSON</div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="vigo-chat-layout">
              {/* Messages Container */}
              <div className="vigo-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`vigo-message-row ${message.sender}`}
                  >
                    <div className="vigo-bubble">
                      {message.text}
                      <span className="vigo-meta">{message.timestamp}</span>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="vigo-message-row ai">
                    <div className="vigo-bubble vigo-loading-bubble">
                      <Loader2 size={16} className="vigo-spin text-emerald-500" />
                      <span>Generating response...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Field */}
              <div className="vigo-input-area">
                <div className="vigo-input-box">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={uploadedFileName ? "Ask me anything about your file data..." : "Ask me about meals, workouts..."}
                    disabled={loading}
                    rows={1}
                  />
                  <button
                    className="vigo-send-btn"
                    onClick={handleSendMessage}
                    disabled={loading || !inputValue.trim()}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
                <div className="vigo-input-footer">
                  Press Enter to send, Shift + Enter for new line
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
