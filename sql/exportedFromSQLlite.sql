BEGIN TRANSACTION;
DROP TABLE IF EXISTS "articles";
CREATE TABLE "articles" (
	"articleId"	INTEGER NOT NULL,
	"title"	VARCHAR(50),
	"content"	VARCHAR(10000),
	"userId"	INTEGER,
	"username"	varchar(20),
	"created_At"	TEXT DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("articleId"),
	CONSTRAINT "fk_users_userId" FOREIGN KEY("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE IF EXISTS "comments";
CREATE TABLE "comments" (
	"commentId"	INTEGER NOT NULL,
	"userId"	INTEGER,
	"username"	VARCHAR,
	"avatarId"	VARCHAR,
	"articleId"	INTEGER,
	"replyTo_Id"	INTEGER,
	"content"	VARCHAR(1000),
	"created_At"	TEXT DEFAULT CURRENT_TIMESTAMP,
	"isParent"	INTEGER,
	PRIMARY KEY("commentId"),
	CONSTRAINT "fk_comments_replyTo_Id" FOREIGN KEY("replyTo_Id") REFERENCES "comments"("commentId") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "fk_articles_articleId" FOREIGN KEY("articleId") REFERENCES "articles"("articleId") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "fk_users_userId" FOREIGN KEY("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
	"userId"	INTEGER NOT NULL,
	"username"	VARCHAR(20),
	"pwordSalt"	VARCHAR(100),
	"pwordHash"	VARCHAR(100),
	"fname"	VARCHAR(30),
	"lname"	VARCHAR(50),
	"dob"	DATE,
	"gender"	VARCHAR(12),
	"email"	VARCHAR(50) UNIQUE,
	"phoneNum"	VARCHAR(15),
	"avatarId"	INTEGER,
	"country"	VARCHAR(20),
	"personalDescription"	VARCHAR,
	UNIQUE("username","email"),
	PRIMARY KEY("userId")
);
DROP TABLE IF EXISTS "socialMedia";
CREATE TABLE "socialMedia" (
	"userId"	INTEGER NOT NULL,
	"faceBook"	VARCHAR(100),
	"insta"	VARCHAR(100),
	"youTube"	VARCHAR(100),
	"twitter"	VARCHAR(100),
	"linkedIn"	VARCHAR(100),
	PRIMARY KEY("userId"),
	FOREIGN KEY("userId") REFERENCES "users"("userId")
);
INSERT INTO "users" VALUES (1,'testAccount1','abe7a99ea2ca7d0a','28a1ddb613a86194df75f038b1efac1043b889752d2b4e75f6975974eff233e52b1745dacd7f8a428cd15e0cc921a4a39c4340e221c386775a991f3de765dce9','John','Doe',1943,'male','john.doe69@gmail.com','02123456789','test.jpg','Austria','I am John. I am just your average guy.');
COMMIT;
