import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  MessageSquare,
  Plus,
  ArrowRight,
  Loader2,
  X
} from 'lucide-react';

import './ChatBot.css';

function ChatBot() {
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
  // BACKEND URL (NGROK)
  // =========================
  const API_URL =
    'https://62d0-41-39-127-163.ngrok-free.app/api/chat';

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: userText
        })
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        text: data.response || 'No response from AI',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Server connection error ❌',
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
  // RESET CHAT
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
    <div className="chatbot-wrapper">

      {/* HEADER */}
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="bot-icon">
            <MessageSquare size={20} />
          </div>

          <div>
            <h3>Vitality AI</h3>
            <p>Fitness Assistant</p>
          </div>
        </div>

        <button className="new-chat-btn" onClick={resetSession}>
          <Plus size={18} />
        </button>
      </div>

      {/* BODY */}
      <div className="chatbot-body">

        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender}`}
            >
              <div className="message-text">
                {message.text}
              </div>

              <span className="message-time">
                {message.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div className="loading-message">
                <Loader2 size={18} className="spin" />
                <span>AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="chatbot-input">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about meals, workouts, calories..."
            rows="1"
            disabled={loading}
          />

          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="send-button"
          >
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChatBot;