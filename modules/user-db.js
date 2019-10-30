//NOT USING THIS - USING DAOs INSTEAD

const users = [
    {
        username: "user1",
        password: "pa55word",
        name: "Alice"
    },
    {
        username: "user2",
        password: "pa55word",
        name: "Bob"
    }
];

function getUserWithCredentials(username, password) {
    return users.find(function(user) {
        return user.username === username && user.password === password;
    });
}

module.exports = {
    getUserWithCredentials
};
