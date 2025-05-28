/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add policy for authenticated users to:
      - Insert their own profile during registration
*/

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);