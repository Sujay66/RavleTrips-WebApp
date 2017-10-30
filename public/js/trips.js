let trips = {
	updatePage: function(tripsJson) {
		var parent = this;
		parent.handleLogin();
		parent.updateTrips(tripsJson);
	},
	setLoginContent: function() {
		var loginBtn = '<div id="loginContent" style="cursor: pointer" data-toggle="modal" data-target="#loginModal" class="nav-link header-font">Login</div>';
		var signoutBtn = '<span id="sign-out" style="cursor: pointer; display: inline-block;" class="nav-link header-font">Sign Out</span>';
		var username = '<span class="nav-link header-font" style="display: inline-block; padding: 0px !important;">' + session.user.displayName + '</span>';
		$('#login').html(username + signoutBtn);
		$('#sign-out').click(function() {
			console.log('logging out!');
			session.logout();
			location.reload();
		});
	},
	updateTrips: function(tripsJson) {
		var tripsgallery = document.getElementById('tripsGallery');
		tripsgallery.innerHTML = '';
		var tripsList = '';
		i = 0;
		tripsJson.forEach((trip) => {
			var item = '<div class="col-sm-12 col-xs-12 col-md-6 col-lg-6">' + '<div id="tripButton" data-id="' + trip.id + '" style="cursor: pointer;" class="card clickable border-BorderRadius-None div1">' + '<img alt="Card image cap" class="card-img-top myclass" src="' + trip.image + '"/>' + '<div class="card-img-overlay imageOverlayClass"> <span><img alt="Card image cap" class="card-img-top" src="public/img/icons/playbutton.svg"/></span></div>' + '<div class="card-block">' + '<h3 class="card-title fontAdoPro alignLeft cardTextMarginBottom paddingTop75rem" id="tripTitle">' + trip.tripTitle + '</h3>' + '<p class="card-text fontInconRegular alignLeft cardTextMarginBottom">' + trip.createdBy + ' </p>' + '<p class="card-text fontDINItalics alignLeft cardTextMarginBottom" id="tripDescription">' + trip.location + '</p>' + '</div></div></div>';
			tripsList += item;
		});
		var lastItem = '<div class="col-sm-12 col-xs-12 col-md-6 col-lg-6"><div class="card border-BorderRadius-None"><img alt="Card image cap" class="card-img-top" src="/public/img/trips/Trip2image.jpg">' + '<div class="card-block"><h3 class="card-title fontAdoPro alignLeft cardTextMarginBottom paddingTop75rem">NEXT RELEASE COMING SOON...</h3>' + '<p class="card-text fontDINItalics alignLeft cardTextMarginBottom"></p></div></div></div>'
		tripsList += lastItem;
		tripsgallery.innerHTML = tripsList;
    $('.clickable').click(function () {
        location.href = '/tripdetails?tripId='+$(this).attr("data-id");
    });
	},
	handleLogin: function() {
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
window.trips = trips;
