ALTER TABLE user_info
  ADD COLUMN app_launch_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN last_rating_prompt TIMESTAMP;