/**
 * Wit.ai integration service for PawPal chatbot
 */

// Your Wit.ai Client Access Token 
const WIT_AI_TOKEN = 'CFDFWIOYZYVRFG23PMD6BPPXK4T6HKIU'; // The Wit.ai Client Access Token from the app settings

const WitAIService = {
  /**
   * Process a user message using Wit.ai
   * 
   * @param {string} message - The user's message text
   * @returns {Promise} Promise with structured response data
   */
  processMessage: async (message) => {
    try {
      // Make API call to Wit.ai
      const response = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(message)}`, {
        headers: {
          'Authorization': `Bearer ${WIT_AI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Wit.ai API error: ${response.status}`);
      }
      
      const data = await response.json();
      return processWitResponse(data);
    } catch (error) {
      console.error('Error processing message with Wit.ai:', error);
      return {
        intent: 'unknown',
        entities: {},
        responseText: "I'm having trouble understanding right now. Could you try asking in a different way?"
      };
    }
  }
};

/**
 * Process the Wit.ai response to extract intents and entities
 */
const processWitResponse = (witResponse) => {
  let topIntent = 'unknown';
  let confidenceScore = 0;
  const entities = {};
  
  // Extract the top intent
  if (witResponse.intents && witResponse.intents.length > 0) {
    topIntent = witResponse.intents[0].name;
    confidenceScore = witResponse.intents[0].confidence;
  }
  
  // Extract entities
  if (witResponse.entities) {
    Object.keys(witResponse.entities).forEach(key => {
      if (witResponse.entities[key] && witResponse.entities[key].length > 0) {
        entities[key] = witResponse.entities[key][0].value;
      }
    });
  }
  
  // Generate response based on intent
  let responseText = getResponseForIntent(topIntent, entities);
  
  return {
    intent: topIntent,
    confidence: confidenceScore,
    entities,
    responseText
  };
};

/**
 * Generate appropriate response based on intent and entities
 */
const getResponseForIntent = (intent, entities) => {
  const petType = entities.pet_type || 'pet';
  
  switch (intent) {
    case 'walking_schedule':
      return `Here's a suggested walking schedule for your ${petType}:
      
      Morning: 7:00-7:30 AM - A 15-20 minute walk to start the day
      Afternoon: 12:00-1:00 PM - A quick 10 minute potty break
      Evening: 5:30-6:30 PM - A longer 30 minute walk for exercise
      Night: 9:00-10:00 PM - Final quick potty break before bed
      
      Remember to adjust based on your ${petType}'s age, breed, and energy level!`;
      
    case 'feeding_schedule':
      return `Here's a suggested feeding schedule for your ${petType}:
      
      Morning: 7:00-8:00 AM - Breakfast (Portion based on ${petType}'s weight)
      Evening: 5:00-6:00 PM - Dinner (Same portion as breakfast)
      
      Always provide fresh water throughout the day. For puppies/kittens under 6 months, consider 3-4 smaller meals throughout the day instead.`;
      
    case 'bath_schedule':
      return `Most pets should be bathed once every 4-6 weeks, depending on their coat type and activity level.
      
      Dogs with oily coats (like Basset Hounds): Every 1-2 weeks
      Dogs with water-repellent coats (like Golden Retrievers): Every 2-3 months
      Short-haired, smooth-coated dogs: Every 4-6 weeks
      Cats: Most cats groom themselves, but longhaired cats may need occasional baths
      
      Always use pet-specific shampoo and make bath time a positive experience with treats and praise!`;
      
    case 'vet_visits':
      return `Regular vet checkups are important for your ${petType}'s health:
      
      Puppies/Kittens: Every 3-4 weeks until 16 weeks old for vaccinations
      Adult dogs/cats (1-7 years): Annual wellness exams
      Senior pets (7+ years): Twice yearly checkups
      
      Don't forget about dental cleanings every 1-2 years, and monthly heartworm/flea/tick preventatives!`;
      
    case 'playtime':
      return `Playtime is essential for your ${petType}'s physical and mental health:
      
      Dogs: 30-60 minutes of active play daily, broken into 2-3 sessions
      Cats: 2-3 play sessions of 10-15 minutes each day
      
      Rotate toys weekly to keep them interesting, and include both interactive play and solo toys. Mental stimulation games like puzzle feeders are great too!`;
      
    case 'greeting':
      return `Hello! How can I help with your ${petType}'s schedule today?`;
      
    default:
      return "I'm not sure I understand. Could you ask about pet walking schedules, feeding times, bath schedules, vet visits, or playtime?";
  }
};

export default WitAIService; 