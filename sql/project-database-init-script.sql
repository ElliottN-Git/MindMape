/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS socialMedia;
-- DROP TABLE IF EXISTS articles;
-- DROP TABLE IF EXISTS comments;

CREATE TABLE users (
    userId INT NOT NULL PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    pwordSalt VARCHAR(100),
    pwordHash VARCHAR(100),
    fname VARCHAR(30),
    lname VARCHAR(50),
    dob DATE,
    gender VARCHAR(12),
    email VARCHAR(50) UNIQUE,
    phoneNum VARCHAR(15),
    avatarId VARCHAR(255),
    country VARCHAR(20),
    personalDescription VARCHAR(MAX) -- You need to specify the length for VARCHAR(MAX)
);

CREATE TABLE socialMedia (
    userId INT NOT NULL PRIMARY KEY,
    faceBook VARCHAR(100),
    insta VARCHAR(100),
    youTube VARCHAR(100),
    twitter VARCHAR(100),
    linkedIn VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES users(userId) -- Define foreign key separately
);

CREATE TABLE articles (
    articleId INT NOT NULL PRIMARY KEY,
    content VARCHAR(MAX), -- You need to specify the length for VARCHAR(MAX)
    userId INT,
    created_At DATETIME DEFAULT GETDATE() -- Use DATETIME instead of TEXT for timestamp
);

CREATE TABLE comments (
    commentId INT NOT NULL PRIMARY KEY,
    userId INT,
    articleId INT,
    replyTo_Id INT,
    content VARCHAR(1000),
    created_At DATETIME DEFAULT GETDATE(), -- Use DATETIME instead of TEXT for timestamp
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (articleId) REFERENCES articles(articleId),
    FOREIGN KEY (replyTo_Id) REFERENCES comments(commentId)
);

