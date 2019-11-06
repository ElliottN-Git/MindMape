//javascript for making the navbar sticky once the header image is scrolled past

window.onscroll = function() {
    toggleSticky();
};

const navbar = document.querySelector("#navbar");

const stickyPoint = navbar.offsetTop;

function toggleSticky() {
    if(window.pageYOffset >= stickyPoint) {
        navbar.classList.add("navbar-fixed-top");
        document.body.style = "margin-top: 50px";
    } else if(window.pageYOffset <= stickyPoint) {
        document.body.style = "margin-top: 0px";
        navbar.classList.remove("navbar-fixed-top");
    }
}