--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS User (
  playfabId     TEXT PRIMARY KEY,
  displayName   TEXT NOT NULL,
  roomId        TEXT,
  roomScene     TEXT,
  roomZone      TEXT,
  isOnline      BOOLEAN,
  createdAt     TEXT,
  updatedAt     TEXT
);

CREATE TABLE Room (
  id            TEXT PRIMARY KEY,
  scene         TEXT NOT NULL,
  zone          TEXT NOT NULL,
  maxSize       TEXT NOT NULL,
  type          TEXT NOT NULL,
  createdAt     TEXT,
  updatedAt     TEXT
);

INSERT INTO Room (
  id, scene, zone, maxSize, type
  ) VALUES (1234, 'Temp', 'Spawn', 15, 'default_room');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE User;
DROP TABLE Room;