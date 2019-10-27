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
	userId INTEGER NOT NULL,
	username VARCHAR(20),
	pwordSalt VARCHAR(100),
    pwordHash VARCHAR(100),
	fname VARCHAR(30),
	lname VARCHAR(50),
	age INTEGER,
    gender VARCHAR (12),
	email VARCHAR(50) UNIQUE,
	ph_Num INTEGER,
	avatarId INTEGER,
	country VARCHAR(20),
    PRIMARY KEY (userId, avatarId),
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