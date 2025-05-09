import React, { useState, useRef, useEffect } from 'react';
import WitAIService from '../../services/witaiService';
import './PetAIPage.css';

const PetAIPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      content: 'Hi there! 🐾 I\'m PawPal, your pet assistant. I can help you with scheduling pet activities, feeding plans, and more. What can I help you with today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: messages.length + 1, type: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Process message with Wit.ai
      const witResponse = await WitAIService.processMessage(input);
      
      // Add bot response
      const botMessage = { 
        id: messages.length + 2, 
        type: 'bot', 
        content: witResponse.responseText,
        intent: witResponse.intent,
        confidence: witResponse.confidence
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Fallback response if Wit.ai fails
      const fallbackMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: "I'm having trouble connecting to my brain right now. Please try again later."
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="petai-page">
      <div className="petai-header">
        <h1>PawPal Assistant</h1>
        <p>Your personal pet care scheduler and advisor</p>
      </div>

      <div className="petai-features">
        <div className="feature-card">
          <div className="feature-icon">🦮</div>
          <h3>Walking Schedules</h3>
          <p>Get personalized walking schedules based on your pet's breed, age, and energy level.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🍖</div>
          <h3>Feeding Plans</h3>
          <p>Create optimal feeding plans and portion recommendations for your pet.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛁</div>
          <h3>Grooming Tips</h3>
          <p>Learn when and how to bathe and groom your pet based on their specific needs.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏰</div>
          <h3>Daily Routines</h3>
          <p>Build healthy routines to keep your pet happy and well-adjusted.</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              {message.type === 'bot' && 
                <div className="bot-avatar">
                  <span role="img" aria-label="Bot">🐾</span>
                </div>
              }
              <div className="message-content">
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="bot-avatar">
                <span role="img" aria-label="Bot">🐾</span>
              </div>
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about pet schedules, feeding, baths..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PetAIPage; 