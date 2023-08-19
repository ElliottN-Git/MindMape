CREATE TABLE users (
    userId SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    pwordSalt VARCHAR(100),
    pwordHash VARCHAR(255),
    fname VARCHAR(30),
    lname VARCHAR(50),
    dob DATE,
    gender VARCHAR(12),
    email VARCHAR(50) UNIQUE,
    phoneNum VARCHAR(15),
    avatarId VARCHAR(255),
    country VARCHAR(20),
    personalDescription TEXT
);

CREATE TABLE socialMedia (
    userId INT PRIMARY KEY,
    faceBook VARCHAR(100),
    insta VARCHAR(100),
    youTube VARCHAR(100),
    twitter VARCHAR(100),
    linkedIn VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE articles (
    articleId SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    userId INT,
    username varchar(20),
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE comments (
    commentId SERIAL PRIMARY KEY,
    userId INT,
    username VARCHAR(20),
	avatarId VARCHAR(255),
    articleId INT,
    replyTo_Id INT,
    content VARCHAR(1000),
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isParent INT,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (articleId) REFERENCES articles(articleId),
    FOREIGN KEY (replyTo_Id) REFERENCES comments(commentId)
);