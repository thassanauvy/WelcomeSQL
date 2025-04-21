
-- Create the Welcome database
CREATE DATABASE IF NOT EXISTS Welcome;
USE Welcome;

-- USERS TABLE
CREATE TABLE Users (
  userID INT NOT NULL,
  email VARCHAR(100),
  username VARCHAR(50),
  passkey VARCHAR(100),
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userID)
);

INSERT INTO Users (userID, email, username, passkey, firstName, lastName, joinDate) VALUES
(1, 'one@welcome.mail', 'userOne', 'welcome%one1', 'Alice', 'Uno', '2024-01-01 01:01:01'),
(10, 'two@welcome.mail', 'userTwo', 'welcome%two2', 'Bob', 'Dos', '2025-02-03 10:20:10'),
(11, 'thr@welcome.mail', 'userThr', 'welcome%one3', 'Clara', 'Tres', '2024-03-03 00:00:00'),
(100, 'fou@welcome.mail', 'userFou', 'welcome%one4', 'Dave', 'Cuatro', '2025-02-03 10:20:10'),
(101, 'fiv@welcome.mail', 'userFiv', 'welcome%six5', 'Enold', 'Cinco', '2024-05-05 00:00:00'),
(110, 'six@welcome.mail', 'userSix', 'welcome%six6', 'Frank', 'Seis', '2025-02-03 10:20:10'),
(111, 'ext7@welcome.mail', 'extSev', 'extSevn', 'Gregory', 'Siete', '2025-04-13 22:18:49'),
(1000, 'ext8@welcome.mail', 'extEght', 'welcome%eig8', 'Hank', 'Ocho', '2025-04-13 21:45:35'),
(1001, 'ext9.welcome.guest', 'guestNine', 'welcome@nine9', 'Ian', 'Nueve', '2025-04-18 20:33:27'),
(1010, 'john10@welcome.guest', 'johnTen', 'john10%', 'John', 'Diez', '2025-04-19 00:24:26');

-- BANKS TABLE
CREATE TABLE Banks (
  bankID INT NOT NULL,
  bankName VARCHAR(100),
  bankBranch VARCHAR(100),
  bankCountry VARCHAR(50),
  PRIMARY KEY (bankID)
);

INSERT INTO Banks (bankID, bankName, bankBranch, bankCountry) VALUES
(888004, 'Bank Charity', 'Eastern', 'Somalia'),
(999001, 'Bank Oceania', 'Horizontal', 'New Zealand'),
(999003, 'Bank Oceania', 'State', 'New Zealand'),
(999112, 'Tasmania Bank', 'Central', 'New Zealand');

-- ACCOUNTS TABLE
CREATE TABLE Accounts (
  accountID INT NOT NULL,
  bankID INT,
  userID INT,
  balance DECIMAL(12,3),
  accountType VARCHAR(50),
  holding VARCHAR(20),
  isPrimary TINYINT(1),
  PRIMARY KEY (accountID),
  FOREIGN KEY (bankID) REFERENCES Banks(bankID),
  FOREIGN KEY (userID) REFERENCES Users(userID)
);

INSERT INTO Accounts (accountID, bankID, userID, balance, accountType, holding, isPrimary) VALUES
(111000, 999001, 1, 3312.310, 'personal', '111.999.001', 1),
(122110, 999003, 1, 912.900, 'shared', '122.999.001', 0),
(211000, 999003, 10, 4220.897, 'family', '211.999.003', 1),
(300990, 999112, 11, 1293.810, 'personal', '300.999.099', 1),
(399000, 999003, 11, 123.818, 'family', '399.999.011', 0),
(490900, 888004, 100, 90123.008, 'shared', '490.0x0.888', 0),
(500990, 999001, 101, 213.010, 'virtual', 'vx5.500.999', 0),
(501105, 999112, 101, 1093.810, 'personal', '501.999.101', 1),
(599001, 999003, 101, 9310.020, 'shared', '599.999.101', 0),
(599099, 888004, 101, 30123.818, 'shared', '599.0x0.888', 0),
(699099, 999001, 110, 10001.007, 'personal', '699.999.110', 1),
(699100, 999001, 1010, 1010.100, 'virtual', 'vx2.010.001', 1);

-- CONTACTS TABLE
CREATE TABLE Contacts (
  phoneID INT NOT NULL,
  userID INT,
  phoneType VARCHAR(20),
  cellular VARCHAR(255),
  isPrimary TINYINT(1),
  PRIMARY KEY (phoneID),
  FOREIGN KEY (userID) REFERENCES Users(userID)
);

INSERT INTO Contacts (phoneID, userID, phoneType, cellular, isPrimary) VALUES
(1001, 1, 'main', '111-222', 1),
(1010, 10, 'main', '222-111', 1),
(1011, 11, 'work', '333-021', 1),
(1100, 100, 'main', '400-004', 1),
(1101, 101, 'main', '540-554', 1),
(1110, 110, 'home', '600-656', 1),
(2001, 1, 'work', '111-333', 0),
(2010, 10, 'work', '202-021', 0),
(2100, 100, 'home', '401-104', 0),
(2101, 101, 'work', '500-554', 0),
(2110, 110, 'work', '666-001', 0),
(3001, 1, 'home', '111-444', 0),
(3101, 101, 'home', '500-999', 0),
(4001, 1, 'family', '100-222', 0),
(4003, 1010, 'personal', '010-010', 1);

-- SESSIONS TABLE
CREATE TABLE Sessions (
  sessionID INT NOT NULL,
  userID INT,
  createdAt DATETIME,
  expiresAt DATETIME,
  PRIMARY KEY (sessionID),
  FOREIGN KEY (userID) REFERENCES Users(userID)
);

INSERT INTO Sessions (sessionID, userID, createdAt, expiresAt) VALUES
(10001, 1, '2025-02-03 13:12:03', '2025-02-01 11:12:13'),
(10010, 10, '2025-02-03 13:12:03', '2025-02-01 11:12:13'),
(10011, 11, '2024-02-01 21:03:13', '2025-02-01 11:12:13'),
(10100, 100, '2025-02-03 13:12:03', '2025-02-01 11:12:13'),
(100101, 101, '2025-02-03 13:12:03', '2025-02-01 11:12:13'),
(100110, 110, '2025-02-03 13:12:03', '2025-02-01 11:12:13');
