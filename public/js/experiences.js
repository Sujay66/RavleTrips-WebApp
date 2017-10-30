var experienceDetail = {
	expCarousel: '#expCarousel',
    checkoutBtn: '<button id="checkout" class="mapbutton"  style="cursor:pointer;" type="button">GET THE MAP</button>',

	updatePage: function(expJson) {
		var parent = this;
		try {
			parent.updateCarouselContent(expJson);
			parent.updateTextContent(expJson);
			parent.updateExperiences(expJson);
            parent.handleLogin(expJson);
            parent.handleCheckout(expJson);
            parent.getMapCoords(expJson);
			//parent.updateRecommendedExperiences(expJson);
		} catch (exp) {
			console.error("Error constructing experiencedetails page...", exp);
		}
	},
    handleLogin: function () {
        var parent = this;
        setTimeout(function () {
            if (session.isLoggedIn) {
                var loginBtn = '<div id="loginContent" style="cursor: pointer" data-toggle="modal" data-target="#loginModal" class="nav-link header-font">Login</div>';
                var signoutBtn = '<span id="sign-out" style="cursor: pointer; display: inline-block;" class="nav-link header-font">Sign Out</span>';
                var username = '<span class="nav-link header-font" style="display: inline-block; padding: 0px !important;">' + session.user.displayName + '</span>';

                $('#login').html(username + signoutBtn);
                $('#sign-out').click(function () {
                    console.log('logging out!');
                    session.logout();
                    location.reload();
                });
            }
        }, 1000);
    },


    resetCheckoutToLogin: function () {
        var parent = this;
        $('#checkout-parent').html(parent.checkoutBtn);
        $('#checkout').click(function () {
            $('#login-modal-content').html('Please login to proceed!');
            $('#loginModal').modal('show');
        });
    },

    handleCheckoutCore: function (spotJson) {
        var parent = this;
        if (!session.isLoggedIn) {
            parent.resetCheckoutToLogin();
        } else {
            $('#login-modal-content').html('');
            $("#checkout").unbind("click");
            $('#checkout').html('PURCHASE MAP');
            $('#checkout').click(function () {
                $('#stripe-payment').html(parent.getPaymentHtml(spotJson));
                $('.bd-example-modal-lg').modal('show');
            });
        }
    },

    handleCheckout: function (expJson) {
        var parent = this;
        setTimeout(function () {
            parent.handleCheckoutCore(expJson);
        }, 1000);
    },

    getPaymentHtml: function (expJson) {
        return '<div id="paymentForm">' +
            '<form action="/charge-payment" method="POST">' +
            '<button id="paymentCheckout" class="purchasebutton" type="submit" style="cursor:pointer;" type="button">PURCHASE MAP FOR $' + (expJson.amount / 100) + ' </button>' +
            '<script ' +
            'src="https://checkout.stripe.com/checkout.js" class="stripe-button"' +
            'data-key="pk_live_bWpyUCRzEuta6fsiwTAaDJaj"' +
            'data-amount="' + expJson.amount + '"' +
            'data-name="Ravle"' +
            'data-description="Secure Payment"' +
            'data-image="/public/img/icons/logo_payment.png"' +
            'data-locale="auto"' +
            'data-zip-code="true"' +
            'allowRememberMe="false">' +
            '</script>' +
            '<input type="hidden" name="tripId" value="' + expJson.tripId + '">' +
            '<input type="hidden" name="spotId" value="">' +
            '<input type="hidden" name="userId" value="' + session.user.uid + '">' +
            '</form>' +
            '</div>';
    },
    getMapDataAndRefresh: function (spotJson) {
        var parent = this;
        $.ajax({
            url: "/getMapCoordinates",
            headers: {'token': session.token},
            data: {
                "userId": session.user.uid,
                "tripId": spotJson.tripId,
                "spotId": spotJson.id,
            },
            cache: false,
            type: "get",
            success: function (response) {
                //console.log("server response for map cords:" + JSON.stringify(response));
                if (response.status === "success" && response.data[spotJson.id]) {
                    $('#checkout').hide();
                }
            },
            error: function (xhr) {
                console.error("server response for map cords:" + JSON.stringify(xhr));
            }
        });
    },
    getMapCoords: function (expJson) {
        let parent = this;
        setTimeout(() => {
            if (session.isLoggedIn) {
                parent.getMapDataAndRefresh(expJson);
            } else {
                //again check for data, as there is delay in fb immediately after login...
                setTimeout(() => {
                    if (session.isLoggedIn) {
                        //login name not set...so refresh the component
                        parent.handleLogin();
                        parent.handleCheckoutCore(expJson);
                        parent.getMapDataAndRefresh(expJson);
                    }
                }, 4500);
            }
        }, 1500);
    },
	updateExperiences: function(expJson) {
		var experienceUrl = "/experiencedetails?experienceId=";
		var experiences = document.getElementById('experiences');
		experiences.innerHTML = '';
        var experiencesList = '';
		expJson.experience.forEach((experience) => {
			var item = '<div class=\"item\"><figure class=\'snip1156\'><img src=\'' + experience.image + '\' /><figcaption><div><a href=\"' + experienceUrl + experience.experienceId + '\"><h2>'+experience.tagline+'</h2></a></div><div><p>' + experience.location + '</p></div></figcaption></figure></div>'
				//  var item = '<a href=\''+ experienceUrl+experience.experienceId+'\'><div class="banner" style="background-image: url(\''+experience.image+'\') ;background-position:top left;background-repeat: no-repeat;background-size: cover;"><div class="banner-text"><h3>'+experience.tagline+'</h3></div></div></a>';
			experiencesList += item;
		});
		experiences.innerHTML = experiencesList;
	},
	updateTextContent: function(expJson) {
		console.log(expJson.name);
		document.getElementById('tripTitle').innerHTML = expJson.descriptionHeader;
		document.getElementById('location').innerHTML = '<text class=\"fontInconRegular\">Location: </text>' + expJson.location + '&nbsp' + '<text class=\"fontInconRegular\"> Duration: </text>' + expJson.duration;
		document.getElementById('tripDescription').innerHTML = expJson.description;
		//
		var entrieTripDescrition = expJson.description;
		var startDescription = entrieTripDescrition.split(/\s+/).slice(0,25).join(" ");
		var endDescription = entrieTripDescrition.split(/\s+/).slice(25,entrieTripDescrition.length).join(" ");
		var tripLocation=expJson.location;
//      document.getElementById('tripDescription').innerHTML= '<text>'+expJson.location+'</text>'+' - '+expJson.description;
document.getElementById('tripDescription').innerHTML = startDescription + ' <a id="readMoreText" style="cursor:pointer; color:#ff5350;" class="read_more">... Read More</a> ' +   '<span class="more_text" style="display:none;">'+endDescription+'</span>'+'<a id="readLessText" style="cursor:pointer; color:#ff5350;display:none;" class="read_less">Read Less</a> ' ;
$('#readMoreText').click(function(event){
console.log('inside more click');
$('.more_text').show(300, function(){
	$("#readMoreText").html(''); /* show the .more_text span */
	document.getElementById('readLessText').style.display = 'block';
});
});

$('#readLessText').click(function(event){
console.log('inside less click');
$('.more_text').hide(300,function(){
	document.getElementById('readLessText').style.display = 'none';
	document.getElementById('readMoreText').innerHTML = '... Read More';
});
});
	},
	updateNextExperiencesContent: function(expJson) {
			$('#nextspotsgallery').html('');
			var imageBase = '<div class="col">   <a href="/experiencedetails?experienceId=ID"> <img src="img-src" alt="" /> </a></div>';
			//  var imageMediumQuery = '<div class="col col-lg-3 hidden-md-down"><a  href="/spotdetails?spotId=ID"> <img src="public/img/SpotPage/Spot3.jpg" style="height: 210px;	width: 210px; margin-top:10px;"> </a></div>';
			expJson.experience.forEach((image, index) => {
				//    if (index < 2) {
				var item = $(imageBase.replace('img-src', image.image).replace('ID', image.experienceId));
				$('#nextspotsgallery').append($(item));
				/*      } else {
				          var mediumItem = $(imageMediumQuery.replace('public/img/SpotPage/Spot3.jpg', image.image).replace('ID', image.spotId));
				          $('#nextSpots').append($(mediumItem));
				      }*/
			});
		},


updateCarouselContent: function(expJson) {
	var parent = this;
	var itemTemp = '<div class="carousel-item">' + '<img style="width: 100%" src="IMG-SRC" >' + '</div>';
	var indicatorTemp = '<li data-target="#expCarousel" style="cursor: pointer" data-slide-to="NO"></li>';
	var baseCarouselContent = '<ol class="carousel-indicators"></ol>' + '<div class="carousel-inner" role="listbox"></div>' + '<a class="carousel-control-prev" href="#expCarousel" role="button" data-slide="prev">' + '<img src="public/img/icons/LeftArrow.svg" style="height: 10%;	width: 10%;"/>' + '</a>' + '<a class="carousel-control-next" href="#expCarousel" role="button" data-slide="next">' + '<img src="public/img/icons/RightArrow.svg" style="height: 10%;	width: 10%;"/>' + '</a>';
	$(parent.expCarousel).html('');
	$(parent.expCarousel).html($(baseCarouselContent));
	expJson.images.forEach((image, index) => {
		var indicator = $(indicatorTemp.replace('NO', index));
		var item = $(itemTemp.replace('IMG-SRC', image));
		if (index === 0) {
			//$(indicator).addClass("active");
			$(item).addClass("active");
		}
		$(parent.expCarousel + ' .carousel-indicators').append($(indicator));
		$(parent.expCarousel + ' .carousel-inner').append($(item));
	});
}
};
window.experienceDetail = experienceDetail;
