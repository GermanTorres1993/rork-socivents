-- Enable Row Level Security
-- Note: Run this script as the database owner or with proper permissions

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  city TEXT DEFAULT 'London',
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location JSONB NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  host_id UUID NOT NULL,
  host_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'cancelled')),
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_photo_url TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Hosts can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Hosts can view event tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Ticket holders can view chat rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Event hosts can create chat rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Chat participants can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Chat participants can send messages" ON public.chat_messages;

-- Create Row Level Security Policies

-- Users policies
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update own events" ON public.events FOR UPDATE USING (auth.uid() = host_id);

-- Tickets policies
CREATE POLICY "Users can view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Hosts can view event tickets" ON public.tickets FOR SELECT USING (
  auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id)
);
CREATE POLICY "Users can create tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat rooms policies
CREATE POLICY "Ticket holders can view chat rooms" ON public.chat_rooms FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.tickets WHERE event_id = chat_rooms.event_id)
  OR auth.uid() IN (SELECT host_id FROM public.events WHERE id = chat_rooms.event_id)
);
CREATE POLICY "Event hosts can create chat rooms" ON public.chat_rooms FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id)
);

-- Chat messages policies
CREATE POLICY "Chat participants can view messages" ON public.chat_messages FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.tickets 
    WHERE event_id = (SELECT event_id FROM public.chat_rooms WHERE id = chat_room_id)
  )
  OR auth.uid() IN (
    SELECT host_id FROM public.events 
    WHERE id = (SELECT event_id FROM public.chat_rooms WHERE id = chat_room_id)
  )
);
CREATE POLICY "Chat participants can send messages" ON public.chat_messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND (
    auth.uid() IN (
      SELECT user_id FROM public.tickets 
      WHERE event_id = (SELECT event_id FROM public.chat_rooms WHERE id = chat_room_id)
    )
    OR auth.uid() IN (
      SELECT host_id FROM public.events 
      WHERE id = (SELECT event_id FROM public.chat_rooms WHERE id = chat_room_id)
    )
  )
);

-- Storage policies for profile photos
CREATE POLICY "Users can view all profile photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Users can upload own profile photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update own profile photos" ON storage.objects FOR UPDATE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete own profile photos" ON storage.objects FOR DELETE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable real-time subscriptions (fixed column name)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tickets'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_host_id ON public.events(host_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_room_id ON public.chat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Function to automatically create chat room when event is created
CREATE OR REPLACE FUNCTION create_chat_room_for_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.chat_rooms (event_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS create_chat_room_trigger ON public.events;

-- Create trigger
CREATE TRIGGER create_chat_room_trigger
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION create_chat_room_for_event();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Clean up any duplicate users (run this once to fix existing data)
DELETE FROM public.users a USING public.users b 
WHERE a.id > b.id AND a.email = b.email;