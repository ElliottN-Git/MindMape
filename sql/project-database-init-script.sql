/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS socialMedia;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS comments;

CREATE TABLE IF NOT EXISTS users (
	userId INTEGER NOT NULL PRIMARY KEY,
	username VARCHAR(20),
	pwordSalt VARCHAR(100),
    pwordHash VARCHAR(100),
	fname VARCHAR(30),
	lname VARCHAR(50),
	dob DATE,
    gender VARCHAR (12),
	email VARCHAR(50) UNIQUE,
	phoneNum INTEGER,
	avatarId INTEGER,
	country VARCHAR(20),
    personalDescription VARCHAR,
    UNIQUE (username, email)
);

CREATE TABLE IF NOT EXISTS socialMedia (
    userId INTEGER NOT NULL PRIMARY KEY,
    faceBook VARCHAR(100),
    insta VARCHAR(100),
    youTube VARCHAR(100),
    twitter VARCHAR(100),
    linkedIn VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES users (userId)
);

CREATE TABLE IF NOT EXISTS articles (
    articleId INTEGER NOT NULL PRIMARY KEY,
    content VARCHAR(10000),
    userId INTEGER,
    created_At TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId)
);

CREATE TABLE IF NOT EXISTS comments (
    commentId INTEGER NOT NULL PRIMARY KEY,
    userId INTEGER,
    articleId INTEGER,
    replyTo_Id INTEGER,
    content VARCHAR(1000),
    created_At TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId),
    FOREIGN KEY (articleId) REFERENCES articles (articleId),
    FOREIGN KEY (replyTo_Id) REFERENCES comments (commentId)
);

--Need to change phone number to VARCHAR as the leading '0' is dropped from an Int.
INSERT INTO users (username, pwordsalt, pwordHash, fname, lname, dob, gender, email, phoneNum, avatarId, country, personalDescription) VALUES (
    ('testAccount1', 'abe7a99ea2ca7d0a', '28a1ddb613a86194df75f038b1efac1043b889752d2b4e75f6975974eff233e52b1745dacd7f8a428cd15e0cc921a4a39c4340e221c386775a991f3de765dce9', 'John', 'Doe', 1969-08-18, 'male', 'john.doe69@gmail.com', 02123456789, 'test.jpg', 'Austria', 'I am John. I am just your average guy.')
);