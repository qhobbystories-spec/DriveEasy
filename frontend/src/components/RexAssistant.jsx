import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight, Zap, HelpCircle, DollarSign, Fuel, FileText, MapPin, Calendar, AlertCircle, Users, Briefcase, Search, Map } from 'lucide-react';

// Location data
const locationsList = [
  { id: 1, city: "Accra", address: "123 Osu Oxford St, Osu", lat: 5.6037, lng: -0.1870, hours: "24/7", cars: 48 },
  { id: 2, city: "Kumasi", address: "456 Adum High St, Adum", lat: 6.6753, lng: -1.6167, hours: "06:00 – 23:00", cars: 62 },
  { id: 3, city: "Takoradi", address: "789 Prom St, Takoradi Central", lat: 4.8845, lng: -1.7554, hours: "07:00 – 22:00", cars: 35 },
  { id: 4, city: "Tema", address: "321 Main Ave, Tema Station", lat: 5.6737, lng: 0.0100, hours: "06:00 – 22:00", cars: 41 },
  { id: 5, city: "Sekondi", address: "654 Beach Rd, Sekondi Harbor", lat: 4.9326, lng: -1.7573, hours: "24/7", cars: 55 },
  { id: 6, city: "Cape Coast", address: "987 Castle Rd, Cape Coast Central", lat: 5.1063, lng: -1.2455, hours: "07:00 – 21:00", cars: 29 },
];

// Vehicle database with detailed specs
const vehicleDatabase = [
  {
    id: 1,
    name: "BMW 5 Series",
    brand: "BMW",
    category: "Luxury",
    price: 120,
    passengers: 5,
    luggage: 3,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Sedan",
    bestFor: ["business", "luxury", "executive"],
    comfort: 5,
  },
  {
    id: 2,
    name: "Tesla Model 3",
    brand: "Tesla",
    category: "Electric",
    price: 95,
    passengers: 5,
    luggage: 3,
    transmission: "Automatic",
    fuel: "Electric",
    type: "Sedan",
    bestFor: ["eco-friendly", "business", "short-trips"],
    comfort: 4,
  },
  {
    id: 3,
    name: "Porsche 911",
    brand: "Porsche",
    category: "Sports",
    price: 250,
    passengers: 4,
    luggage: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Coupe",
    bestFor: ["adventure", "luxury", "sports"],
    comfort: 4,
  },
  {
    id: 4,
    name: "Range Rover Sport",
    brand: "Land Rover",
    category: "SUV",
    price: 175,
    passengers: 7,
    luggage: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    type: "SUV",
    bestFor: ["family", "adventure", "luxury"],
    comfort: 5,
  },
  {
    id: 5,
    name: "Mercedes-Benz E-Class",
    brand: "Mercedes-Benz",
    category: "Luxury",
    price: 145,
    passengers: 5,
    luggage: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Sedan",
    bestFor: ["business", "luxury"],
    comfort: 5,
  },
  {
    id: 6,
    name: "Audi RS7",
    brand: "Audi",
    category: "Sports",
    price: 220,
    passengers: 5,
    luggage: 3,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Sedan",
    bestFor: ["performance", "luxury", "business"],
    comfort: 4,
  },
  {
    id: 7,
    name: "Toyota Corolla",
    brand: "Toyota",
    category: "Economy",
    price: 45,
    passengers: 5,
    luggage: 3,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Sedan",
    bestFor: ["budget", "city", "short-trips"],
    comfort: 3,
  },
  {
    id: 8,
    name: "Honda Civic",
    brand: "Honda",
    category: "Economy",
    price: 50,
    passengers: 5,
    luggage: 3,
    transmission: "Manual",
    fuel: "Petrol",
    type: "Sedan",
    bestFor: ["budget", "sporty", "city"],
    comfort: 3,
  },
  {
    id: 9,
    name: "Hyundai i20",
    brand: "Hyundai",
    category: "Economy",
    price: 40,
    passengers: 5,
    luggage: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Hatchback",
    bestFor: ["budget", "city", "eco"],
    comfort: 2,
  },
  {
    id: 10,
    name: "Honda Odyssey",
    brand: "Honda",
    category: "Van",
    price: 85,
    passengers: 7,
    luggage: 6,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Van",
    bestFor: ["family", "large-groups", "comfort"],
    comfort: 5,
  },
  {
    id: 11,
    name: "Chrysler Pacifica",
    brand: "Chrysler",
    category: "Van",
    price: 95,
    passengers: 8,
    luggage: 7,
    transmission: "Automatic",
    fuel: "Petrol",
    type: "Van",
    bestFor: ["family", "large-groups", "luxury"],
    comfort: 5,
  },
  {
    id: 12,
    name: "Toyota Sienna",
    brand: "Toyota",
    category: "Van",
    price: 80,
    passengers: 7,
    luggage: 6,
    transmission: "Automatic",
    fuel: "Hybrid",
    type: "Van",
    bestFor: ["family", "eco-friendly", "comfort"],
    comfort: 5,
  },
];

const RexAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerType, setLocationPickerType] = useState(null); // 'pickup' or 'return'
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
  const [selectedReturnLocation, setSelectedReturnLocation] = useState(null);
  const pickupLocationRef = useRef(null);
  const returnLocationRef = useRef(null);
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
    // Rental Requirements FAQ
    requirements: {
      text: "📋 **Rental Requirements & Policies:**\n\n**Age Requirements**\n• Minimum 21 years old\n• Drivers under 25 may have additional fees\n\n**License Requirements**\n• Valid driver's license (must be current)\n• International license accepted\n• License must be held for minimum 1 year\n\n**Payment Options**\n✅ Credit/Debit cards (Visa, Mastercard)\n✅ Mobile Money (MTN, Vodafone, AirtelTigo)\n✅ Bank transfer\n✅ Cash at pickup (with valid ID)\n\n**Deposit Information**\n• Security deposit required (refundable)\n• Held for damage/violations\n• Released 5-7 business days after return\n• Amount varies by car category\n\n**Late Return Policy**\n• Grace period: 15 minutes free\n• After 15 mins: GHS 10 per hour\n• After 24 hours: Full day charge applies\n\n**Refund Policy**\n• Cancellations: See cancellation policy\n• Damage claims: Assessed within 48 hours\n• Refunds processed: 5-7 business days\n\n**Cross-Border Travel**\n• Allowed with prior permission\n• Valid passport required\n• Border crossing fee: GHS 50\n• Notify us 7 days in advance\n\n**Additional Driver Policy**\n• Second driver allowed (GHS 10/day)\n• Must be licensed & meet age requirements\n• Limited to 2 additional drivers max\n\nHave questions about any of these?",
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

  const handleLocationSelect = (location, type) => {
    // Use the type from state if not provided
    const locationType = type || locationPickerType;
    
    if (locationType === 'pickup') {
      pickupLocationRef.current = location;
      setSelectedPickupLocation(location);
    } else {
      returnLocationRef.current = location;
      setSelectedReturnLocation(location);
    }

    const locationMsg = {
      id: Date.now(),
      text: `📍 ${locationType === 'pickup' ? 'Pickup' : 'Return'} location: ${location.city}`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, locationMsg]);

    setTimeout(() => {
      let rexMsg = `Perfect! I've set ${location.city} as your ${locationType === 'pickup' ? 'pickup' : 'return'} location.\n\n`;
      rexMsg += `📍 ${location.address}\n`;
      rexMsg += `🕐 Hours: ${location.hours}\n`;
      rexMsg += `🚗 ${location.cars} vehicles available\n\n`;

      if (pickupLocationRef.current && returnLocationRef.current) {
        rexMsg += "Great! You have both locations set. Ready to proceed with booking? 🎉";
      } else if (locationType === 'pickup') {
        rexMsg += "Now, where would you like to return the vehicle?";
      } else {
        rexMsg += "Now, where would you like to pick up the vehicle?";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: rexMsg,
        sender: 'rex',
        timestamp: new Date(),
      }]);
      setShowLocationPicker(false);
      setLocationPickerType(null);
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

    // Check for location selection requests
    if ((lower.includes('pickup') || lower.includes('pick up') || lower.includes('pick-up')) && 
        (lower.includes('location') || lower.includes('where'))) {
      setLocationPickerType('pickup');
      setShowLocationPicker(true);
      return "📍 **Where would you like to pick up the vehicle?**\n\nPlease select from our available locations above.";
    }

    if ((lower.includes('return') || lower.includes('drop off') || lower.includes('drop-off')) && 
        (lower.includes('location') || lower.includes('where'))) {
      setLocationPickerType('return');
      setShowLocationPicker(true);
      return "📍 **Where would you like to return the vehicle?**\n\nPlease select from our available locations above.";
    }

    // Try to extract vehicle recommendation criteria
    const recommendation = analyzeUserNeeds(userInput);
    if (recommendation) {
      return recommendation;
    }

    // Check for Trip Planning
    if ((lower.includes('trip') || lower.includes('travelling') || lower.includes('traveling')) && 
        (lower.includes('where') || lower.includes('days') || lower.includes('people'))) {
      return generateTripPlanningResponse(userInput);
    }

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

    if (lower.includes('payment') || lower.includes('pay') || lower.includes('card') || lower.includes('credit')) {
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

    // Rental Requirements FAQ
    if (lower.includes('requirement') || lower.includes('age') || lower.includes('license') || 
        lower.includes('deposit') || lower.includes('late') || lower.includes('refund') ||
        lower.includes('without credit card') || lower.includes('cross-border') || lower.includes('additional driver')) {
      return responses.requirements.text;
    }

    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('which')) {
      return "I'd love to help you find the perfect car! 🚗\n\nTell me about your needs:\n• Trip type? (business, family, adventure)\n• Number of passengers?\n• Budget?\n• Special requirements?\n\nI'll recommend the best options!";
    }

    return "Great question! 🤔 I'm here to help with:\n✅ Vehicle recommendations\n✅ Pricing & rates\n✅ Insurance options\n✅ Fuel policies\n✅ Payment methods\n✅ Booking guidance\n✅ Pickup & return info\n✅ Cancellations\n✅ Rental requirements\n\nFeel free to ask about any of these topics!";
  };

  const generateTripPlanningResponse = (input) => {
    const lower = input.toLowerCase();
    
    let response = "🗺️ **Let me help plan your perfect trip!**\n\n";
    
    let destination = extractDestination(lower);
    let passengers = extractPassengers(lower);
    let days = extractDuration(lower);
    let driveType = extractDriveType(lower);

    if (destination) {
      response += `📍 **Destination:** ${destination.charAt(0).toUpperCase() + destination.slice(1)}\n`;
    }
    if (passengers > 0) {
      response += `👥 **Passengers:** ${passengers}\n`;
    }
    if (days > 0) {
      response += `📅 **Duration:** ${days} day${days > 1 ? 's' : ''}\n`;
    }
    if (driveType) {
      response += `🛣️ **Drive Type:** ${driveType}\n`;
    }

    response += "\n**My Recommendations:**\n\n";

    // Recommend suitable cars based on trip
    let recommendations = vehicleDatabase;
    
    if (passengers > 0) {
      recommendations = recommendations.filter(v => v.passengers >= passengers);
    }

    if (driveType === 'city') {
      recommendations = recommendations.filter(v => v.category === 'Economy' || v.type === 'Hatchback');
    } else if (driveType === 'highway') {
      recommendations = recommendations.filter(v => v.comfort >= 4).sort((a, b) => b.comfort - a.comfort);
    } else if (driveType === 'mixed') {
      recommendations = recommendations.filter(v => v.comfort >= 3);
    }

    recommendations = recommendations.slice(0, 3);

    response += "**Suitable Vehicles:**\n";
    recommendations.forEach((car, idx) => {
      response += `${idx + 1}. ${car.brand} ${car.name} - GHS ${car.price}/day\n`;
    });

    // Fuel efficiency
    response += "\n⛽ **Fuel Efficiency Estimate:**\n";
    if (driveType === 'city') {
      response += "• City driving: ~8-10 km/liter\n";
      response += "• Expected fuel cost: GHS 150-200 for 5 days\n";
    } else if (driveType === 'highway') {
      response += "• Highway driving: ~12-15 km/liter\n";
      response += "• Expected fuel cost: GHS 100-150 for 5 days\n";
    } else {
      response += "• Mixed driving: ~10-12 km/liter\n";
      response += "• Expected fuel cost: GHS 120-180 for 5 days\n";
    }

    // Mileage
    response += "\n📏 **Suggested Mileage Allowance:**\n";
    const suggestedMileage = days * 100;
    response += `• For ${days} days: ${suggestedMileage} km\n`;
    response += `• Average per day: 100 km\n`;

    // Insurance
    response += "\n🛡️ **Recommended Insurance:**\n";
    response += "• Comprehensive Coverage (includes:\n";
    response += "  - Collision protection\n";
    response += "  - Theft coverage\n";
    response += "  - Windshield replacement\n";
    response += "  - 24/7 roadside assistance)\n";

    // Extras
    response += "\n🎁 **Optional Extras:**\n";
    response += "• GPS Navigation (GHS 20/day)\n";
    response += "• Child safety seats (GHS 15/day)\n";
    response += "• Additional driver (GHS 10/day)\n";
    response += "• Dashcam (GHS 10/day)\n";

    response += "\nReady to book? I can help with the next steps!";
    
    return response;
  };

  const extractDriveType = (text) => {
    if (text.includes('city') || text.includes('urban')) return 'city';
    if (text.includes('highway') || text.includes('long distance') || text.includes('interstate')) return 'highway';
    if (text.includes('mixed') || text.includes('both')) return 'mixed';
    return null;
  };

  const analyzeUserNeeds = (input) => {
    const lower = input.toLowerCase();
    
    // Check for natural language vehicle searches
    const vehicleSearch = performNaturalLanguageSearch(lower);
    if (vehicleSearch) {
      return vehicleSearch;
    }

    // Extract key information for recommendations
    const budget = extractBudget(lower);
    const passengers = extractPassengers(lower);
    const duration = extractDuration(lower);
    const luggage = extractLuggage(lower);
    const travelType = extractTravelType(lower);
    const fuelPreference = extractFuelPreference(lower);
    const transmissionPreference = extractTransmission(lower);
    const luxuryLevel = extractLuxuryLevel(lower);
    const destination = extractDestination(lower);

    // Only generate recommendation if we have meaningful criteria
    if (passengers > 0 || budget > 0 || duration > 0 || travelType) {
      return generateVehicleRecommendation({
        budget,
        passengers,
        duration,
        luggage,
        travelType,
        fuelPreference,
        transmissionPreference,
        luxuryLevel,
        destination,
      });
    }

    return null;
  };

  const performNaturalLanguageSearch = (text) => {
    // SUVs under budget
    if (text.includes('suv') && (text.includes('under') || text.includes('below') || text.includes('less'))) {
      const amount = extractBudget(text);
      if (amount > 0) {
        const suvs = vehicleDatabase.filter(v => v.category === 'SUV' && v.price <= amount);
        if (suvs.length > 0) {
          return formatSearchResults(`SUVs under GHS ${amount}/day`, suvs);
        }
      }
    }

    // Cheapest automatic cars
    if ((text.includes('cheapest') || text.includes('budget')) && text.includes('automatic')) {
      const automatics = vehicleDatabase.filter(v => v.transmission === 'Automatic').sort((a, b) => a.price - b.price).slice(0, 3);
      return formatSearchResults('Cheapest automatic cars', automatics);
    }

    // Cheapest cars
    if (text.includes('cheapest') || (text.includes('budget') && text.includes('car'))) {
      const cheapest = [...vehicleDatabase].sort((a, b) => a.price - b.price).slice(0, 3);
      return formatSearchResults('Cheapest cars available', cheapest);
    }

    // Luxury cars
    if (text.includes('luxury')) {
      const luxury = vehicleDatabase.filter(v => ['Luxury', 'Sports'].includes(v.category)).slice(0, 3);
      return formatSearchResults('Luxury cars', luxury);
    }

    // Electric vehicles
    if (text.includes('electric') || text.includes('ev')) {
      const electric = vehicleDatabase.filter(v => v.fuel === 'Electric').slice(0, 3);
      if (electric.length > 0) {
        return formatSearchResults('Electric vehicles', electric);
      }
    }

    // Hybrid cars
    if (text.includes('hybrid') || text.includes('eco')) {
      const hybrid = vehicleDatabase.filter(v => v.fuel === 'Hybrid').slice(0, 3);
      if (hybrid.length > 0) {
        return formatSearchResults('Hybrid & eco-friendly vehicles', hybrid);
      }
    }

    // 7-seater / Large family cars
    if ((text.includes('7') || text.includes('seven')) && (text.includes('seater') || text.includes('passenger'))) {
      const largeVans = vehicleDatabase.filter(v => v.passengers >= 7).slice(0, 3);
      return formatSearchResults('7-seater vehicles', largeVans);
    }

    // Family cars
    if (text.includes('family') && (text.includes('suv') || text.includes('van') || text.includes('spacious'))) {
      const family = vehicleDatabase.filter(v => v.passengers >= 5 && ['SUV', 'Van'].includes(v.category)).slice(0, 3);
      return formatSearchResults('Family vehicles', family);
    }

    // Long-distance travel
    if (text.includes('long distance') || text.includes('long-distance') || text.includes('highway')) {
      const comfort = vehicleDatabase.filter(v => v.comfort >= 4).sort((a, b) => b.comfort - a.comfort).slice(0, 3);
      return formatSearchResults('Best cars for long-distance travel', comfort);
    }

    // Luxury SUVs
    if (text.includes('luxury') && text.includes('suv')) {
      const luxurySuv = vehicleDatabase.filter(v => v.category === 'SUV' && v.price >= 150).slice(0, 3);
      return formatSearchResults('Luxury SUVs', luxurySuv);
    }

    // Vans
    if (text.includes('van') && !text.includes('suv')) {
      const vans = vehicleDatabase.filter(v => v.type === 'Van').slice(0, 3);
      return formatSearchResults('Available vans', vans);
    }

    // Manual transmission
    if (text.includes('manual') && !text.includes('automatic')) {
      const manual = vehicleDatabase.filter(v => v.transmission === 'Manual').slice(0, 3);
      if (manual.length > 0) {
        return formatSearchResults('Manual transmission cars', manual);
      }
    }

    // Sports/Performance cars
    if (text.includes('sports') || text.includes('performance') || text.includes('fast')) {
      const sports = vehicleDatabase.filter(v => v.category === 'Sports').slice(0, 3);
      return formatSearchResults('Sports & performance vehicles', sports);
    }

    // Specific price range
    const priceMatch = text.match(/(\d+)\s*(?:to|to|-)\s*(\d+)/i);
    if (priceMatch) {
      const minPrice = parseInt(priceMatch[1]);
      const maxPrice = parseInt(priceMatch[2]);
      const inRange = vehicleDatabase.filter(v => v.price >= minPrice && v.price <= maxPrice).slice(0, 3);
      if (inRange.length > 0) {
        return formatSearchResults(`Cars between GHS ${minPrice}-${maxPrice}/day`, inRange);
      }
    }

    return null;
  };

  const formatSearchResults = (title, vehicles) => {
    let response = `🔍 **${title}:**\n\n`;

    vehicles.forEach((car, idx) => {
      response += `**${idx + 1}. ${car.brand} ${car.name}**\n`;
      response += `   💰 GHS ${car.price}/day\n`;
      response += `   👥 ${car.passengers} passengers | 🧳 ${car.luggage} luggage\n`;
      response += `   ⛽ ${car.fuel} | 🔄 ${car.transmission}\n`;
      response += `   ⭐ ${car.category}\n\n`;
    });

    response += "Would you like to book one of these or need more details?";
    return response;
  };

  const extractBudget = (text) => {
    const match = text.match(/(\d+)\s*(ghc|gh|cedi|cedis)?|budget\s*(?:of\s*)?(\d+)/i);
    return match ? parseInt(match[1] || match[3]) : 0;
  };

  const extractPassengers = (text) => {
    const numberWords = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    };

    for (const [word, num] of Object.entries(numberWords)) {
      if (text.includes(word)) {
        return num;
      }
    }

    const match = text.match(/(\d+)\s*(?:passenger|person|people|of us)/i);
    return match ? parseInt(match[1]) : 0;
  };

  const extractDuration = (text) => {
    const dayMatch = text.match(/(\d+)\s*day/i);
    const weekMatch = text.match(/(\d+)\s*week/i);
    
    if (dayMatch) return parseInt(dayMatch[1]);
    if (weekMatch) return parseInt(weekMatch[1]) * 7;
    
    return 0;
  };

  const extractLuggage = (text) => {
    if (text.includes('lots of luggage') || text.includes('heavy luggage')) return 5;
    if (text.includes('luggage')) return 3;
    if (text.includes('suitcase')) return 2;
    return 0;
  };

  const extractTravelType = (text) => {
    if (text.includes('family') || text.includes('kids') || text.includes('children')) return 'family';
    if (text.includes('business') || text.includes('corporate') || text.includes('meeting')) return 'business';
    if (text.includes('adventure') || text.includes('weekend') || text.includes('road trip')) return 'adventure';
    if (text.includes('honeymoon') || text.includes('couple')) return 'leisure';
    return null;
  };

  const extractFuelPreference = (text) => {
    if (text.includes('electric') || text.includes('eco') || text.includes('green')) return 'Electric';
    if (text.includes('hybrid')) return 'Hybrid';
    if (text.includes('diesel')) return 'Diesel';
    return null;
  };

  const extractTransmission = (text) => {
    if (text.includes('automatic')) return 'Automatic';
    if (text.includes('manual')) return 'Manual';
    return null;
  };

  const extractLuxuryLevel = (text) => {
    if (text.includes('luxury') || text.includes('premium') || text.includes('high-end')) return 'luxury';
    if (text.includes('budget') || text.includes('economy') || text.includes('cheap')) return 'economy';
    return null;
  };

  const extractDestination = (text) => {
    const destinations = ['accra', 'kumasi', 'takoradi', 'tema', 'sekondi', 'cape coast'];
    for (const dest of destinations) {
      if (text.includes(dest)) return dest;
    }
    return null;
  };

  const generateVehicleRecommendation = (criteria) => {
    let recommendations = vehicleDatabase;

    // Filter by passengers (prioritize exact match or close fit)
    if (criteria.passengers > 0) {
      recommendations = recommendations.filter(v => v.passengers >= criteria.passengers);
      if (recommendations.length === 0) {
        recommendations = vehicleDatabase;
      }
    }

    // Filter by luggage needs
    if (criteria.luggage > 0) {
      recommendations = recommendations.filter(v => v.luggage >= criteria.luggage);
      if (recommendations.length === 0) {
        recommendations = vehicleDatabase;
      }
    }

    // Filter by budget
    if (criteria.budget > 0) {
      const maxPrice = criteria.duration > 0 ? (criteria.budget / criteria.duration) : criteria.budget;
      recommendations = recommendations.filter(v => v.price <= maxPrice * 1.2); // Allow 20% flexibility
      if (recommendations.length === 0) {
        recommendations = vehicleDatabase;
      }
    }

    // Filter by travel type/purpose
    if (criteria.travelType) {
      const filtered = recommendations.filter(v => v.bestFor.includes(criteria.travelType));
      if (filtered.length > 0) {
        recommendations = filtered;
      }
    }

    // Filter by luxury preference
    if (criteria.luxuryLevel === 'luxury') {
      const filtered = recommendations.filter(v => ['Luxury', 'Sports', 'Van'].includes(v.category));
      if (filtered.length > 0) {
        recommendations = filtered;
      }
    } else if (criteria.luxuryLevel === 'economy') {
      const filtered = recommendations.filter(v => ['Economy', 'Van'].includes(v.category));
      if (filtered.length > 0) {
        recommendations = filtered;
      }
    }

    // Filter by fuel preference
    if (criteria.fuelPreference) {
      const filtered = recommendations.filter(v => v.fuel === criteria.fuelPreference);
      if (filtered.length > 0) {
        recommendations = filtered;
      }
    }

    // Filter by transmission
    if (criteria.transmissionPreference) {
      const filtered = recommendations.filter(v => v.transmission === criteria.transmissionPreference);
      if (filtered.length > 0) {
        recommendations = filtered;
      }
    }

    // Sort by best fit
    recommendations = recommendations
      .sort((a, b) => {
        let scoreA = 0, scoreB = 0;

        if (criteria.passengers > 0) {
          scoreA += (a.passengers >= criteria.passengers ? 10 : -5);
          scoreB += (b.passengers >= criteria.passengers ? 10 : -5);
        }

        if (criteria.luggage > 0) {
          scoreA += (a.luggage >= criteria.luggage ? 5 : 0);
          scoreB += (b.luggage >= criteria.luggage ? 5 : 0);
        }

        scoreA += a.comfort;
        scoreB += b.comfort;

        return scoreB - scoreA;
      })
      .slice(0, 3);

    if (recommendations.length === 0) {
      return "I couldn't find an exact match, but here are some great options from our fleet! Tell me more about your specific needs and I can refine the recommendations.";
    }

    let response = "🚗 **Perfect! Here are my recommendations for you:**\n\n";

    recommendations.forEach((car, idx) => {
      response += `**${idx + 1}. ${car.brand} ${car.name}**\n`;
      response += `   💰 GHS ${car.price}/day\n`;
      response += `   👥 ${car.passengers} passengers\n`;
      response += `   🧳 ${car.luggage} luggage bags\n`;
      response += `   ⛽ ${car.fuel} | 🔄 ${car.transmission}\n`;
      response += `   ⭐ Comfort: ${car.comfort}/5\n\n`;
    });

    response += "Would you like to book one of these vehicles or need more information?";

    return response;
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="rex-button"
          onClick={() => setIsOpen(true)}
          title="Chat with AI Assistant"
        >
          <div className="rex-avatar">
            <span className="rex-icon">🤖</span>
            <span className="rex-dot"></span>
          </div>
        </button>
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="rex-location-modal">
          <div className="rex-location-content">
            <div className="rex-location-header">
              <h3>📍 Select {locationPickerType === 'pickup' ? 'Pickup' : 'Return'} Location</h3>
              <button onClick={() => {
                setShowLocationPicker(false);
                setLocationPickerType(null);
              }} className="rex-close-loc">✕</button>
            </div>

            <div className="rex-location-list">
              {locationsList.map(loc => (
                <div key={loc.id} className="rex-location-item" onClick={() => handleLocationSelect(loc, locationPickerType)}>
                  <div className="rex-loc-info">
                    <div className="rex-loc-city">{loc.city}</div>
                    <div className="rex-loc-addr">{loc.address}</div>
                    <div className="rex-loc-meta">
                      <span>🕐 {loc.hours}</span>
                      <span>🚗 {loc.cars} cars</span>
                    </div>
                  </div>
                  <div className="rex-loc-arrow">→</div>
                </div>
              ))}
            </div>

            <div className="rex-location-info-box">
              💡 All our locations are fully equipped with vehicles ready for pickup and return.
            </div>
          </div>
        </div>
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
                <div className="rex-title">{messages.length > 1 ? 'Rex - AI Assistant' : 'Chat Assistant'}</div>
                <div className="rex-status">Always here to help</div>
              </div>
            </div>
            <button
              className="rex-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
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
              <div className="rex-label-small">Quick options:</div>
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
                placeholder="Ask me..."
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
                <Send size={16} />
              </button>
            </div>
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
          justify-content: center;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          cursor: pointer;
          font-weight: 700;
          font-size: 24px;
          box-shadow: 0 4px 16px rgba(230, 57, 70, 0.4);
          transition: all 0.3s;
          z-index: 998;
          font-family: inherit;
        }

        .rex-button:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(230, 57, 70, 0.6);
        }

        .rex-close-below {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          background: var(--dark-2);
          border: 2px solid var(--border);
          border-radius: 50%;
          color: var(--gray-1);
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          z-index: 998;
          font-weight: 700;
        }

        .rex-close-below:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
          transform: rotate(90deg);
        }

        .rex-location-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          backdrop-filter: blur(4px);
        }

        .rex-location-content {
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 16px 64px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.3s ease;
        }

        .rex-location-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, var(--primary) 0%, rgba(230, 57, 70, 0.8) 100%);
          color: #fff;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          position: sticky;
          top: 0;
        }

        .rex-location-header h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .rex-close-loc {
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
          font-size: 18px;
        }

        .rex-close-loc:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .rex-location-list {
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 8px;
        }

        .rex-location-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          background: var(--dark-3);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rex-location-item:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }

        .rex-location-item:hover .rex-loc-addr,
        .rex-location-item:hover .rex-loc-meta {
          color: rgba(255, 255, 255, 0.9);
        }

        .rex-loc-info {
          flex: 1;
        }

        .rex-loc-city {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .rex-loc-addr {
          font-size: 12px;
          color: var(--gray-1);
          margin-bottom: 6px;
        }

        .rex-loc-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: var(--gray-2);
          font-weight: 600;
        }

        .rex-loc-arrow {
          font-size: 20px;
          color: var(--primary);
          margin-left: 12px;
        }

        .rex-location-item:hover .rex-loc-arrow {
          color: #fff;
        }

        .rex-location-info-box {
          padding: 12px 16px;
          margin: 12px;
          background: rgba(46, 160, 67, 0.1);
          border: 1px solid rgba(46, 160, 67, 0.3);
          border-radius: 8px;
          font-size: 12px;
          color: var(--gray-1);
          text-align: center;
        }

        .rex-avatar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .rex-icon {
          font-size: 24px;
        }

        .rex-dot {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 10px;
          height: 10px;
          background: #2ea043;
          border-radius: 50%;
          border: 2px solid var(--primary);
        }

        .rex-window {
          position: fixed;
          bottom: 88px;
          right: 24px;
          top: auto;
          width: 360px;
          height: 480px;
          max-height: calc(100vh - 200px);
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
          padding: 14px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, var(--primary) 0%, rgba(230, 57, 70, 0.8) 100%);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          color: #fff;
        }

        .rex-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rex-avatar-small {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .rex-title {
          font-weight: 700;
          font-size: 14px;
        }

        .rex-status {
          font-size: 11px;
          opacity: 0.9;
        }

        .rex-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .rex-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .rex-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rex-messages::-webkit-scrollbar {
          width: 4px;
        }

        .rex-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .rex-messages::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }

        .rex-messages::-webkit-scrollbar-thumb:hover {
          background: var(--gray-2);
        }

        .rex-message {
          display: flex;
          gap: 6px;
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
          max-width: 80%;
          padding: 10px 12px;
          border-radius: 10px;
          line-height: 1.4;
          font-size: 13px;
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
          border-radius: 10px 2px 10px 10px;
        }

        .rex-typing {
          display: flex;
          gap: 3px;
          height: 10px;
        }

        .rex-typing span {
          width: 3px;
          height: 3px;
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
          30% { transform: translateY(-4px); }
        }

        .rex-quick-replies {
          padding: 10px;
          border-top: 1px solid var(--border);
          background: var(--dark-3);
        }

        .rex-label-small {
          font-size: 10px;
          color: var(--gray-1);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .rex-quick-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .rex-quick-btn {
          padding: 8px 10px;
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--white);
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.2s;
          text-align: center;
          font-family: inherit;
        }

        .rex-quick-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }

        .rex-input-area {
          padding: 10px;
          border-top: 1px solid var(--border);
          background: var(--dark-3);
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .rex-input-wrapper {
          display: flex;
          gap: 6px;
        }

        .rex-input {
          flex: 1;
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 8px 10px;
          color: #fff;
          font-size: 12px;
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
          width: 36px;
          height: 36px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-family: inherit;
          flex-shrink: 0;
        }

        .rex-send-btn:hover:not(:disabled) {
          background: rgba(230, 57, 70, 0.8);
        }

        .rex-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .rex-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 180px);
            right: 16px;
            bottom: 80px;
          }

          .rex-button {
            bottom: 16px;
            right: 16px;
            width: 52px;
            height: 52px;
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
