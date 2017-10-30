function resizingWindows() {

    var videoSectionHeight = document.getElementById('videoSection').clientHeight;;
    var headerHeight = document.getElementById('header').clientHeight;
    var playerHeight = document.getElementById('playerContainer').clientHeight;


    var videoListtop = -(videoSectionHeight-playerHeight);
    if(window.innerWidth<600)
    {
       videoListtop=videoListtop-30;
    }

    document.getElementById("BodySection").style.marginTop = videoListtop.toString() + "px";
}

// A $( document ).ready() block.
$(document).ready(function () {
    $('#MapDiv').css('visibility', 'hidden');
    $('#MapDiv').css('display', 'none');
    $('#Gallery').css('color', '#ff5350');


    resizingWindows();
    $(window).resize(function () {
        var viewportWidth = $(window).width();
        if (viewportWidth < 600) {
            $(".view").removeClass("view view-portfolio").addClass("gallery-mobile");
        }
        resizingWindows();

    });
});
document.addEventListener("fullscreenchange", function () {
    resizingWindows();
}, false);
document.addEventListener("msfullscreenchange", function () {
    resizingWindows();
}, false);
document.addEventListener("mozfullscreenchange", function () {
    resizingWindows();
}, false);
document.addEventListener("webkitfullscreenchange", function () {
    resizingWindows();
}, false);

let home = {
    updatePage: function () {
        var parent = this;
        parent.handleLogin();
    },

    setLoginContent: function () {
        var loginBtn = '<div id="loginContent" style="cursor: pointer" data-toggle="modal" data-target="#loginModal" class="nav-link header-font">Login</div>';
        var signoutBtn = '<span id="sign-out" style="cursor: pointer; display: inline-block;" class="nav-link header-font">Sign Out</span>';
        var username = '<span class="nav-link header-font" style="display: inline-block; padding: 0px !important;">' + session.user.displayName + '</span>';

        $('#login').html(username + signoutBtn);
        $('#sign-out').click(function () {
            console.log('logging out!');
            session.logout();
            location.reload();
        });
    },

    handleLogin: function () {
        var parent = this;
        setTimeout(() => {
            if (session.isLoggedIn) {
                parent.setLoginContent();
            } else {
                //again check for data, as there is delay in fb immediately after login...
                setTimeout(() => {
                    if (session.isLoggedIn) {
                        parent.setLoginContent();
                    }
                }, 3500);
            }
        }, 1500);
    }
};
window.home = home;