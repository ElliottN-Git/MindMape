/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    helpers: {
        summary: function (str) {
            const htmlString= str;
            const stripedHtml = htmlString.replace(/<img[^>]*>/g,"");
            const subString = stripedHtml.substring(0,500);
            return subString;
        },
        equal: function (v1, v2) {
            return v1 === v2;
        },
        and: function () {
            return Array.prototype.slice.call(arguments, 0, arguments.length - 1).every(Boolean);
        },
        or: function () {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        },
        toJSON: function(object) {
            return JSON.stringify(object);
        },
        getImage: function(str) {
            const imgTags = str.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
            return imgTags;

        }
    },
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// Setup body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Setup express-session
const session = require("express-session");
app.use(session({
   resave: false,
   saveUninitialized: false,
   secret: "CS719"
}));


// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));

// Setup routes
const appRouter = require("./routes/application-routes.js");
app.use(appRouter);

const loginRouter = require("./routes/login-routes.js");
app.use(loginRouter);

const signUpRouter = require("./routes/sign-up.js");
app.use(signUpRouter);

const userProfileRouter = require("./routes/user-profile-page");
app.use(userProfileRouter);

const writeArticle = require("./routes/write-article-routes")
app.use(writeArticle);

const fullArticle = require("./routes/fullArticleView")
app.use(fullArticle);

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});