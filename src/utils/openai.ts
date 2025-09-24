// AI Integration for Lost & Found Chatbot (Groq/OpenAI Compatible)

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private apiKey: string;
  private systemPrompt: string;

  constructor() {
    // Get API key from environment variables (Groq or OpenAI)
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || '';
    
    // System prompt for the Lost & Found chatbot
    this.systemPrompt = `You are a helpful AI assistant for a Lost & Found system at venues like universities, malls, and hotels. 

Your job is to help users report lost items by collecting the following information in a conversational, empathetic way:

1. **Item type** (phone, wallet, keys, bag, clothing, etc.)
2. **Color** and appearance
3. **Brand** or distinctive features
4. **Location** where they think they lost it (be specific - building, room, area)
5. **Additional description** (size, condition, unique markings)
6. **Contact information** (name, email, phone number)

**Guidelines:**
- Ask ONE question at a time
- Be empathetic and understanding - losing something is stressful
- Keep responses short and conversational (1-2 sentences max)
- Use natural language, not formal questionnaire style
- If they give multiple answers at once, acknowledge all but focus on one missing piece
- Be encouraging - let them know you're here to help find their item
- Once you have ALL the required information (item type, color, brand/features, location, description, name, email, phone), end by saying "Great news! We may have your item at our venue. Let me submit your claim now - you'll receive a tracking number shortly."

**IMPORTANT:** Only end the conversation when you have collected ALL required information. Do not submit until you have everything needed.

**Current conversation context:** User is reporting a lost item. Start by asking what they lost.`;
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    console.log('🔍 API Key check:', this.apiKey ? 'Found API key' : 'No API key');
    
    if (!this.apiKey) {
      console.log('⚠️ Using demo responses - no API key found');
      return this.getDemoResponse(messages);
    }

    try {
      // Determine if using Groq or OpenAI based on API key prefix
      const isGroq = this.apiKey.startsWith('gsk_');
      const apiUrl = isGroq 
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      
      const model = isGroq 
        ? 'llama3-8b-8192'  // Groq's fast Llama model
        : 'gpt-3.5-turbo';   // OpenAI's model

      console.log(`🤖 Using ${isGroq ? 'Groq' : 'OpenAI'} API with model: ${model}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: this.systemPrompt },
            ...messages
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error ${response.status}:`, errorText);
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      console.log('✅ AI responded successfully');
      return aiResponse || 'I apologize, but I encountered an error. Could you please try again?';
    } catch (error) {
      console.error('❌ AI API error:', error);
      console.log('🔄 Falling back to demo responses');
      return this.getDemoResponse(messages);
    }
  }

  private getDemoResponse(messages: ChatMessage[]): string {
    // Demo responses for when API is not available
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    const demoResponses = [
      "Hi! I'm here to help you find your lost item. What did you lose today?",
      "I understand how frustrating it can be to lose something important. Can you tell me what color it was?",
      "That helps! Do you remember the brand or any distinctive features about it?",
      "Thanks for that detail. Where do you think you might have lost it? Try to be as specific as possible.",
      "Got it! Can you describe any other details that might help identify your item?",
      "Perfect! Now I need your contact information so we can reach you if we find a match. What's your full name?",
      "Great! What's the best email address to reach you at?",
      "And what's your phone number?",
      "Thank you for all that information! I've submitted your lost item report. You'll receive a tracking number shortly, and we'll contact you if we find a match in our system."
    ];

    // Simple logic to cycle through demo responses
    const responseIndex = Math.min(messages.filter(m => m.role === 'user').length, demoResponses.length - 1);
    return demoResponses[responseIndex];
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const openAIService = new OpenAIService();

