export type User = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  bio?: string;
  city?: string;
  interests?: string[];
  createdAt: string;
};

export type EventCategory = 
  | "music" 
  | "tech" 
  | "food" 
  | "art" 
  | "sports" 
  | "education" 
  | "networking" 
  | "free" 
  | "other";

export type Event = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string; // ISO string
  time: string;
  location: {
    address: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  price: number; // 0 for free events, -1 for "check website"
  category: EventCategory;
  hostId: string;
  hostName: string;
  createdAt: string;
  source?: 'Eventbrite'; // Added to identify external events
  externalUrl?: string; // URL for ticket purchase on external site
};

export type Ticket = {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  price: number;
  status: "active" | "used" | "cancelled";
};

export type ChatMessage = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  text: string;
  timestamp: string;
};

export type ChatRoom = {
  eventId: string;
  eventTitle: string;
  participants: string[]; // user IDs
  lastMessage?: ChatMessage;
};