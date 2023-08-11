-- Password for testAccount1 is testpword
INSERT INTO users (username, pwordSalt, pwordHash, fname, lname, dob, gender, email, phoneNum, avatarId, country, personalDescription) VALUES (
    'testAccount1', 'abe7a99ea2ca7d0a', '28a1ddb613a86194df75f038b1efac1043b889752d2b4e75f6975974eff233e52b1745dacd7f8a428cd15e0cc921a4a39c4340e221c386775a991f3de765dce9', 'John', 'Doe', '1969-08-18', 'male', 'john.doe69@gmail.com', '02123456789', 'test.jpg', 'Austria', 'I am John. I am just your average guy.'
);
