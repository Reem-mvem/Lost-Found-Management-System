# Wajad - AI-Powered Lost & Found System

This project was developed as part of a competition focused on building agentic systems. Wajad is an intelligent lost and found platform that uses a AI to help reunite people with their lost belongings.

## Overview

Wajad combines natural language processing and computer vision to create an intelligent matching system between lost items and found items. The system operates through two main interfaces: one for venues that find items, and another for users who have lost something.

## How It Works

### For Venues

Venues can register and upload found items to the system. When an item is found, venue staff can:

- Upload photos of the item
- Provide detailed descriptions including category, color, brand, and location where it was found
- Store all this information in the system's database

The photos and descriptions are processed and indexed for matching.

### For Users

When someone loses an item, they interact with an AI-powered chatbot that guides them through describing their lost item. The chatbot:

- Asks questions in a conversational, empathetic manner
- Collects information about the item type, color, brand, location, and distinctive features
- Gathers contact information for follow-up
- Uses natural language understanding to extract structured data from the conversation

### The Matching Process

The core innovation of this system lies in its matching algorithm. When a user submits a claim describing their lost item, the system:

1. Processes the user's natural language description using AI
2. Analyzes images of found items using computer vision
3. Uses CLIP (Contrastive Language-Image Pre-training) to create embeddings that connect visual features with textual descriptions
4. Matches user descriptions against the database of found items by comparing semantic similarities between text and images
5. Presents potential matches to venue staff for verification

This approach allows the system to find matches even when exact keywords don't align, understanding that "a blue phone" and "a sapphire colored smart phone" might refer to the same item.

### Technical Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Groq API, and OpenAI API support
- **Routing**: React Router
- **State Management**: React Context API
- **Storage**: LocalStorage (for demo purposes)

