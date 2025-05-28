/*
  # Add saved and liked destinations tables

  1. New Tables
    - `saved_destinations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `destination_id` (text)
      - `created_at` (timestamp)
    - `liked_destinations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `destination_id` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own saved/liked destinations
      - Insert new saved/liked destinations
      - Delete their own saved/liked destinations
*/

-- Saved destinations table
CREATE TABLE IF NOT EXISTS saved_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  destination_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved destinations"
  ON saved_destinations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved destinations"
  ON saved_destinations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved destinations"
  ON saved_destinations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Liked destinations table
CREATE TABLE IF NOT EXISTS liked_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  destination_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE liked_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own liked destinations"
  ON liked_destinations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own liked destinations"
  ON liked_destinations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own liked destinations"
  ON liked_destinations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create unique constraints to prevent duplicates
CREATE UNIQUE INDEX saved_destinations_user_destination_idx 
  ON saved_destinations (user_id, destination_id);

CREATE UNIQUE INDEX liked_destinations_user_destination_idx 
  ON liked_destinations (user_id, destination_id);