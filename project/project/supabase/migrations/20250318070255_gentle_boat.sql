/*
  # Create memes table and storage

  1. New Tables
    - `memes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `memes` table
    - Add policies for authenticated users to:
      - Read all memes
      - Create their own memes
*/

CREATE TABLE IF NOT EXISTS memes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view memes"
  ON memes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own memes"
  ON memes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);