--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS User (
  playfabId     TEXT PRIMARY KEY,
  displayName   TEXT NOT NULL,
  roomId        TEXT,
  roomScene     TEXT,
  isOnline      BOOLEAN,
  createdAt     TEXT,
  updatedAt     TEXT
);

CREATE TABLE Room (
  id            INTEGER PRIMARY KEY,
  scene         TEXT NOT NULL,
  maxSize       INT NOT NULL,
  type          TEXT NOT NULL,
  createdAt     TEXT,
  updatedAt     TEXT
);

INSERT INTO Room (
  id, scene, maxSize, type
  ) VALUES (1234, 'Temp', 15, 'default_room');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE User;
DROP TABLE Room;