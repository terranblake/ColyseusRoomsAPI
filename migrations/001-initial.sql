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
  updatedAt     TEXT,
  hashedPass    TEXT
);

CREATE TABLE IF NOT EXISTS Room (
  id            TEXT PRIMARY KEY,
  scene         TEXT NOT NULL,
  zone          TEXT NOT NULL,
  maxSize       TEXT NOT NULL,
  type          TEXT NOT NULL,
  createdAt     TEXT,
  updatedAt     TEXT
);

INSERT INTO Room (id, scene, zone, maxSize, type) VALUES ('0001', 'VibrantVale', 'Spawn', 15, 'default_room');
INSERT INTO Room (id, scene, zone, maxSize, type) VALUES ('0002', 'VibrantVale', 'Park', 15, 'default_room');

INSERT INTO User (playfabId, displayName, roomId, roomScene, roomZone) VALUES ('0001', 'display.name', '0001', 'VibrantVale', 'Spawn');
INSERT INTO User (playfabId, displayName, roomId, roomScene, roomZone) VALUES ('0002', 'display.name', '0002', 'VibrantVale', 'Park');

-- SELECT * FROM User;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE User;
DROP TABLE Room;