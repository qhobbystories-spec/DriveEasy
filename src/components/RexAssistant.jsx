import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight, Zap, HelpCircle, DollarSign, Fuel, FileText, MapPin, Calendar, AlertCircle } from 'lucide-react';

const RexAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hey there! 👋 I'm Rex, your AI Rental Assistant. How can I help you today?",
          sender: 'rex',
          timestamp: new Date(),
        }
      ]);
    }
  }, [isOpen]);

  const quickReplies = [
    { label: '🚗 Find a Car', action: 'recommend' },
    { label: '💰 Pricing & Rates', action: 'pricing' },
    { label: '🛡️ Insurance Options', action: 'insurance' },
    { label: '⛽ Fuel Policy', action: 'fuel' },
    { label: '💳 Payment Methods', action: 'payment' },
    { label: '📍 Pickup & Return', action: 'pickup' },
    { label: '📋 Booking Guide', action: 'booking' },
    { label: '❌ Cancel Reservation', action: 'cancel' },
  ];

  const responses = {
    recommend: {
      text: "I'd love to help you find the perfect vehicle! 🚗\n\nTell me:\n• What type of trip? (business, family, adventure)\n• How many passengers?\n• Budget range?\n• Any specific features needed?\n\nI'll recommend the best options from our fleet!",
      followUp: true,
    },
    pricing: {
      text: "💰 **Our Pricing Plans:**\n\n**Economy** - GHS 45/day\n• Compact cars, perfect for city driving\n• 100 km/day included\n• Best for budget-conscious travelers\n\n**Premium** - GHS 120/day\n• Luxury sedans & SUVs\n• Unlimited mileage\n• Includes comprehensive insurance\n\n**Elite** - GHS 300/day\n• Exotic & supercars\n• Unlimited mileage\n• Dedicated concierge & chauffeur service\n\nWeekly and monthly rates available with discounts!",
      followUp: false,
    },
    insurance: {
      text: "🛡️ **Insurance Options:**\n\n**Basic Coverage** (Included)\n• Collision Damage Waiver\n• Theft Protection\n• Third-party Liability\n\n**Comprehensive Coverage** (Recommended)\n• Everything in Basic\n• Glass & Windshield Repair\n• Natural Disaster Coverage\n• 24/7 Roadside Assistance\n\n**Premium Coverage** (Peace of Mind)\n• Everything in Comprehensive\n• Zero Deductible\n• Personal Belongings Protection\n• Accident Forgiveness\n\nWant to add coverage to your booking?",
      followUp: false,
    },
    fuel: {
      text: "⛽ **Fuel Policy:**\n\n✅ **Pick-up**: All vehicles provided with FULL TANK\n\n✅ **Return**: Please return with a FULL TANK\n\n💰 **If not full**: Refueling charges apply\n• GHS 5 per liter refueling fee\n• GHS 50 convenience charge\n\n💡 **Pro Tip**: We're located near gas stations at all our branches for your convenience!\n\n📍 Locations: Accra, Kumasi, Takoradi, Tema, Sekondi, Cape Coast",
      followUp: false,
    },
    payment: {
      text: "💳 **Payment Methods We Accept:**\n\n🏦 **Credit/Debit Cards**\n• Visa, Mastercard accepted\n• Secure checkout process\n• Instant confirmation\n\n📱 **Mobile Money**\n• MTN Mobile Money\n• Vodafone Cash\n• AirtelTigo Money\n• Quick & convenient\n\n🏧 **Bank Transfer**\n• Same-day confirmation\n• Include booking reference\n\n💰 **Cash at Counter**\n• Pay at pickup location\n• Bring valid ID & payment details confirmed\n\nAll methods include a security deposit (refundable)",
      followUp: false,
    },
    pickup: {
      text: "📍 **Pickup & Return Instructions:**\n\n**BEFORE PICKUP:**\n1. Confirm booking 24 hours prior\n2. Prepare valid driver's license + ID\n3. Have payment method ready\n4. Check location hours\n\n**AT PICKUP:**\n1. Inspect vehicle condition together\n2. Sign rental agreement\n3. Receive keys & documents\n4. GPS/Navigation setup\n5. Review fuel level (should be FULL)\n\n**AT RETURN:**\n1. Return to same location\n2. Vehicle inspection (damage check)\n3. Fuel level verified\n4. Final payment & receipts\n5. Keys & documents returned\n\n**Our Locations:**\n• Accra: 24/7 availability\n• Kumasi, Takoradi, Tema: Extended hours\n• Sekondi, Cape Coast: Daily service\n\nNeed a specific location?",
      followUp: false,
    },
    booking: {
      text: "📋 **Step-by-Step Booking Guide:**\n\n**Step 1: Browse** 🚗\n• Visit our Fleet page\n• Filter by category (Luxury, Economy, Van, etc.)\n• Check availability & ratings\n\n**Step 2: Select** ✅\n• Click 'View Details' on your chosen car\n• Check specs, features & pricing\n• Read customer reviews\n\n**Step 3: Dates** 📅\n• Pick-up date & time\n• Return date & time\n• Location selection\n\n**Step 4: Checkout** 💳\n• Review total price breakdown\n• Add insurance/extras\n• Select payment method\n• Complete booking\n\n**Step 5: Confirmation** ✉️\n• Receive confirmation email\n• Booking reference number\n• Pickup instructions\n• Ready to roll!\n\nWant help with any specific step?",
      followUp: false,
    },
    cancel: {
      text: "❌ **Cancellation Policy:**\n\n**ECONOMY PLAN**\n• Free cancellation up to 48 hours before pickup\n• After 48 hours: 50% charge\n• Within 24 hours: No refund\n\n**PREMIUM PLAN**\n• Free cancellation up to 24 hours before pickup\n• After 24 hours: 50% charge\n• Less than 4 hours: No refund\n\n**ELITE PLAN**\n• Free cancellation anytime\n• No questions asked\n• Full refund processed within 2-3 business days\n\n**TO CANCEL YOUR BOOKING:**\n1. Go to 'My Bookings'\n2. Find your reservation\n3. Click 'Cancel Booking'\n4. Confirm cancellation\n5. Receive confirmation email\n\n⚠️ **Note**: Cancellation initiated within allowed timeframe only.\n\nNeed help canceling a specific booking?",
      followUp: false,
    },
  };

  const handleQuickReply = (action) => {
    const userMessage = {
      id: Date.now(),
      text: quickReplies.find(r => r.action === action)?.label || '',
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const response = responses[action];
      if (response) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: response.text,
          sender: 'rex',
          timestamp: new Date(),
          followUp: response.followUp,
        }]);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let rexResponse = generateResponse(input);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: rexResponse,
        sender: 'rex',
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 800);
  };

  const generateResponse = (userInput) => {
    const lower = userInput.toLowerCase();

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hey! 👋 I'm Rex, your AI Rental Assistant. I can help with vehicle recommendations, pricing, insurance, fuel policy, booking questions, and more! What can I help with?";
    }

    if (lower.includes('thank') || lower.includes('thanks')) {
      return "You're welcome! 😊 Anything else I can help you with today?";
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      return responses.pricing.text;
    }

    if (lower.includes('insurance') || lower.includes('coverage')) {
      return responses.insurance.text;
    }

    if (lower.includes('fuel') || lower.includes('gas') || lower.includes('petrol')) {
      return responses.fuel.text;
    }

    if (lower.includes('payment') || lower.includes('pay') || lower.includes('card')) {
      return responses.payment.text;
    }

    if (lower.includes('pickup') || lower.includes('return') || lower.includes('location')) {
      return responses.pickup.text;
    }

    if (lower.includes('book') || lower.includes('reserve') || lower.includes('how to')) {
      return responses.booking.text;
    }

    if (lower.includes('cancel') || lower.includes('modify') || lower.includes('change')) {
      return responses.cancel.text;
    }

    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('which')) {
      return "I'd love to help you find the perfect car! 🚗\n\nTell me about your needs:\n• Trip type? (business, family, adventure)\n• Number of passengers?\n• Budget?\n• Special requirements?\n\nI'll recommend the best options!";
    }

    return "Great question! 🤔 I'm here to help with:\n✅ Vehicle recommendations\n✅ Pricing & rates\n✅ Insurance options\n✅ Fuel policies\n✅ Payment methods\n✅ Booking guidance\n✅ Pickup & return info\n✅ Cancellations\n\nFeel free to ask about any of these topics!";
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="rex-button"
          onClick={() => setIsOpen(true)}
          title="Chat with Rex, your AI Rental Assistant"
        >
          <div className="rex-avatar">
            <span className="rex-icon">🤖</span>
            <span className="rex-dot"></span>
          </div>
          <span className="rex-label">Ask Rex</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="rex-window">
          <div className="rex-header">
            <div className="rex-header-left">
              <div className="rex-avatar-small">
                <span>🤖</span>
              </div>
              <div>
                <div className="rex-title">Rex - AI Assistant</div>
                <div className="rex-status">Always here to help</div>
              </div>
            </div>
            <button
              className="rex-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="rex-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`rex-message ${msg.sender}`}>
                <div className="rex-message-content">
                  {msg.text.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="rex-message rex">
                <div className="rex-message-content">
                  <div className="rex-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="rex-quick-replies">
              <div className="rex-label-small">Popular topics:</div>
              <div className="rex-quick-grid">
                {quickReplies.map(reply => (
                  <button
                    key={reply.action}
                    className="rex-quick-btn"
                    onClick={() => handleQuickReply(reply.action)}
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="rex-input-area">
            <div className="rex-input-wrapper">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                className="rex-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="rex-send-btn"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="rex-info">💡 Powered by AI | Available 24/7</div>
          </div>
        </div>
      )}

      <style>{`
        .rex-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 12px 18px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 16px rgba(230, 57, 70, 0.4);
          transition: all 0.3s;
          z-index: 998;
          font-family: inherit;
        }

        .rex-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.6);
        }

        .rex-avatar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .rex-icon {
          font-size: 18px;
        }

        .rex-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 8px;
          height: 8px;
          background: #2ea043;
          border-radius: 50%;
          border: 2px solid white;
        }

        .rex-window {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 420px;
          height: 600px;
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 999;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .rex-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, var(--primary) 0%, rgba(230, 57, 70, 0.8) 100%);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          color: #fff;
        }

        .rex-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rex-avatar-small {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .rex-title {
          font-weight: 700;
          font-size: 16px;
        }

        .rex-status {
          font-size: 12px;
          opacity: 0.9;
        }

        .rex-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .rex-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .rex-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rex-messages::-webkit-scrollbar {
          width: 6px;
        }

        .rex-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .rex-messages::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }

        .rex-messages::-webkit-scrollbar-thumb:hover {
          background: var(--gray-2);
        }

        .rex-message {
          display: flex;
          gap: 8px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rex-message.rex {
          justify-content: flex-start;
        }

        .rex-message.user {
          justify-content: flex-end;
        }

        .rex-message-content {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 12px;
          line-height: 1.5;
          font-size: 14px;
          word-wrap: break-word;
        }

        .rex-message.rex .rex-message-content {
          background: var(--dark-3);
          border: 1px solid var(--border);
          color: var(--white);
        }

        .rex-message.user .rex-message-content {
          background: var(--primary);
          color: #fff;
          border-radius: 12px 2px 12px 12px;
        }

        .rex-typing {
          display: flex;
          gap: 4px;
          height: 12px;
        }

        .rex-typing span {
          width: 4px;
          height: 4px;
          background: var(--gray-1);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .rex-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .rex-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .rex-quick-replies {
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          background: var(--dark-3);
        }

        .rex-label-small {
          font-size: 11px;
          color: var(--gray-1);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }

        .rex-quick-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .rex-quick-btn {
          padding: 10px 12px;
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--white);
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
          text-align: left;
          font-family: inherit;
        }

        .rex-quick-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }

        .rex-input-area {
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          background: var(--dark-3);
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .rex-input-wrapper {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .rex-input {
          flex: 1;
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .rex-input:focus {
          border-color: var(--primary);
        }

        .rex-input::placeholder {
          color: var(--gray-2);
        }

        .rex-send-btn {
          background: var(--primary);
          border: none;
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-family: inherit;
        }

        .rex-send-btn:hover:not(:disabled) {
          background: rgba(230, 57, 70, 0.8);
        }

        .rex-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rex-info {
          font-size: 11px;
          color: var(--gray-2);
          text-align: center;
        }

        @media (max-width: 640px) {
          .rex-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 120px);
            right: 16px;
            bottom: 16px;
          }

          .rex-button {
            bottom: 16px;
            right: 16px;
          }

          .rex-quick-grid {
            grid-template-columns: 1fr;
          }

          .rex-message-content {
            max-width: 85%;
          }
        }
      `}</style>
    </>
  );
};

export default RexAssistant;
