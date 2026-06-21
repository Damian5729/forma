CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_weight_logs" ON weight_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  glasses INTEGER NOT NULL DEFAULT 1,
  logged_at DATE DEFAULT CURRENT_DATE
);
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_water_logs" ON water_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
