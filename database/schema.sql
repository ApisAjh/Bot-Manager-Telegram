-- schema.sql
-- Skema database SQLite untuk Apis Group Manager

CREATE TABLE IF NOT EXISTS chats (
  chat_id             INTEGER PRIMARY KEY,
  title               TEXT,
  rules               TEXT DEFAULT '',
  welcome_enabled     INTEGER DEFAULT 1,
  welcome_message     TEXT DEFAULT '',
  goodbye_enabled     INTEGER DEFAULT 1,
  goodbye_message     TEXT DEFAULT '',
  auto_delete_welcome INTEGER DEFAULT 0,
  captcha_enabled     INTEGER DEFAULT 0,
  anti_link           INTEGER DEFAULT 0,
  anti_spam           INTEGER DEFAULT 0,
  anti_flood          INTEGER DEFAULT 0,
  anti_raid           INTEGER DEFAULT 0,
  anti_bot            INTEGER DEFAULT 0,
  anti_arabic         INTEGER DEFAULT 0,
  anti_forward        INTEGER DEFAULT 0,
  anti_sticker_spam   INTEGER DEFAULT 0,
  anti_service_msg    INTEGER DEFAULT 0,
  log_join            INTEGER DEFAULT 0,
  log_leave           INTEGER DEFAULT 0,
  log_ban             INTEGER DEFAULT 0,
  log_delete          INTEGER DEFAULT 0,
  log_edit            INTEGER DEFAULT 0,
  log_channel_id      INTEGER
);

CREATE TABLE IF NOT EXISTS warnings (
  chat_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  count   INTEGER DEFAULT 0,
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id    INTEGER PRIMARY KEY,
  username   TEXT,
  first_name TEXT,
  last_seen  TEXT
);

CREATE TABLE IF NOT EXISTS stats (
  key   TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);
