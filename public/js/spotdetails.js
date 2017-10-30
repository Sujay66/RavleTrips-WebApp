function addMarkersToMap(coords) {
    try {
        //Step 1: initialize communication with the platform
        var platform = new H.service.Platform({
            app_id: '0xXWtM8YjKytm00you04',
            app_code: '4TxZjGadhaswrhkA1L9x1Q',
            useCIT: true,
            useHTTPS: true
        });

        var defaultLayers = platform.createDefaultLayers();
        var map = new H.Map(document.getElementById('map'), defaultLayers.normal.map, {
            center: coords,
            zoom: 10
        });
        var mapTileService = platform.getMapTileService({
            type: 'base'
        });
        var customeThemeMapLayer = mapTileService.createTileLayer('maptile', 'reduced.day', 256, 'png8', {
            lg: 'ENG'
        });
        map.setBaseLayer(customeThemeMapLayer);
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        behavior.disable(H.mapevents.Behavior.WHEELZOOM);
        var ui = H.ui.UI.createDefault(map, defaultLayers);
        var icon = new H.map.Icon('public/img/icons/Pindrop.svg',{size:{w:40,h:40}});
        var marker = new H.map.Marker(coords,{icon:icon});
        map.addObject(marker);
	} catch (err) {
		console.log(err.message);
	}
}
let spotDetail = {
    spotsCarousel: '#spotsCarousel',
    checkoutBtn: '<button id="checkout" class="mapbutton"  style="cursor:pointer;" type="button">GET THE MAP</button>',
    googleMapUrl: 'https://www.google.com/maps/place/LAT,LNG',
    appleMapsUrl: 'http://maps.apple.com/?daddr=LAT,LNG',

    updatePage: function (spotJson) {
        var parent = this;
        try {
            parent.handleLogin();
            parent.handleCheckout(spotJson);
            parent.updateCarouselContent(spotJson);
            parent.updateTextContent(spotJson);
            parent.updateSpotImages(spotJson);
            parent.updateExperiences(spotJson);
            parent.getMapCoords(spotJson);
        } catch (ex) {
            console.error("Error constructing spotdetails page...", ex);
        }
    },

    setupMap: function (spotJson, gps) {
        var parent = this;
        $('#map').show();
        $('#mapGuideTextId').show();
        $('#lockedMap').remove();
        addMarkersToMap(gps);
        $('#googleMaps').click(() => {
            window.open(parent.googleMapUrl.replace("LAT", gps.lat).replace("LNG", gps.lng), '_blank');
        });
        $('#appleMaps').click(() => {
            window.open(parent.appleMapsUrl.replace("LAT", gps.lat).replace("LNG", gps.lng), '_blank');
        });
        $('#checkout').hide();

        //dynamic loading not working ...debug later
        /*$('head').append('<link href="https://js.cit.api.here.com/v3/3.0/mapsjs-ui.css" rel="stylesheet" type="text/css">');
         $('head').append('<script src="https://js.cit.api.here.com/v3/3.0/mapsjs-core.js" type="text/javascript"></script>');
         $('head').append('<script src="https://js.cit.api.here.com/v3/3.0/mapsjs-service.js" type="text/javascript"></script>');
         $('head').append('<script src="https://js.cit.api.here.com/v3/3.0/mapsjs-ui.js" type="text/javascript"></script>');
         $('head').append('<script src="https://js.cit.api.here.com/v3/3.0/mapsjs-mapevents.js" type="text/javascript"></script>');*/
        /* $.when(
         $.getScript( "https://js.cit.api.here.com/v3/3.0/mapsjs-core.js" ),
         $.getScript( "https://js.cit.api.here.com/v3/3.0/mapsjs-service.js" ),
         $.getScript( "https://js.cit.api.here.com/v3/3.0/mapsjs-ui.js" ),
         $.getScript( "https://js.cit.api.here.com/v3/3.0/mapsjs-mapevents.js" ),
         $.Deferred(function( deferred ){
         $( deferred.resolve );
         })
         ).done(function(){
         console.log("done loading");
         //addMarkersToMap(gps);

         });*/
    },



    updateExperiences: function (spotJson) {
        var experienceUrl="/experiencedetails?experienceId=";

        var experiences=document.getElementById('experiences');
        experiences.innerHTML = '';
        var experiencesList = '';
        spotJson.experiences.forEach((experience) => {
          var item = '<a href=\"' + experienceUrl + experience.experienceId + '\"><figure class=\'snip1156\'><img src=\'' + experience.image + '\' /><figcaption><div><h2>'+experience.tagline+'</h2></div><div><p>' + experience.location + '</p></div></figcaption></figure></a>';
            //var item = '<figure class=\'sånip1156\'><img src=\'' + experience.image + '\' /><figcaption><div><a href=\"' + experienceUrl + experience.tagline + '\"><h2>Underneath the Milk</h2></a></div><div><p>' + experience.tagline + '</p></div></figcaption></figure>';
                experiencesList+=item;
        });
        experiences.innerHTML=experiencesList;

    },

    updateSpotImages: function (spotJson) {

        var spotsUrl="/spotdetails?spotId=";
        var spotsgallery=document.getElementById('spotsgallery');
        spotsgallery.innerHTML = '';


        var spotsList = '';
        spotJson.spots.forEach((image) => {

                var item = '<div class="item"><a href="'+spotsUrl+image.spotId +'"><img src="'+image.image+'" alt="" /></a></div>'
                //$(imageBase.replace('public/img/SpotPage/Spot3.jpg', image.image).replace('HREFURL',spotsUrl+image.spotId));
                spotsList+=item;
        });
        spotsgallery.innerHTML=spotsList;

    },

    updateTextContent: function (spotJson) {
        document.getElementById('tripTitle').innerHTML = spotJson.name;


        //update photographers
        var pContentText = 'PHOTOGRAPHY BY ';
        var pContentHtml = '<a href="HREF" style="color:red;"><text>NAME</text></a>';
        var contents = '';
        var photoGrapLength = spotJson.photographers.length;
        for (i = 0; i < photoGrapLength; i++) {
            contents += pContentHtml.replace('HREF', spotJson.photographers[i].instagram).replace('NAME', spotJson.photographers[i].name);
            if (photoGrapLength != 1 && i != photoGrapLength - 1) {
                contents += ' AND ';
            }
        }
        contents = pContentText + contents;
        document.getElementById('PhotographerDetails').innerHTML=contents;
        document.getElementById('tips').innerHTML="<text class=\"fontDinTips\">Useful Tip: </text>"+ spotJson.tips;
        var entrieTripDescrition = spotJson.description;
        var startDescription = entrieTripDescrition.split(/\s+/).slice(0,25).join(" ");
        var endDescription = entrieTripDescrition.split(/\s+/).slice(25,entrieTripDescrition.length).join(" ");
        var tripLocation=spotJson.location;
  //      document.getElementById('tripDescription').innerHTML= '<text>'+spotJson.location+'</text>'+' - '+spotJson.description;
  document.getElementById('tripDescription').innerHTML = '<text>' + spotJson.location + '</text>' + ' - ' + startDescription + ' <a id="readMoreText" style="cursor:pointer; color:#ff5350;" class="read_more">... Read More</a> ' +   '<span class="more_text" style="display:none;">'+endDescription+'</span>'+'<a id="readLessText" style="cursor:pointer; color:#ff5350;display:none;" class="read_less">Read Less</a> ' ;
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
      //document.getElementById('videoClass').innerHTML = '<iframe id="iframeID" style="border:0" class="embed-responsive-item" src="'+spotJson.videoUrl+'" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';

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

    handleCheckout: function (spotJson) {
        var parent = this;
        setTimeout(function () {
            parent.handleCheckoutCore(spotJson);
        }, 1000);
    },

    getPaymentHtml: function (spotJson) {
        return '<div id="paymentForm">' +
            '<form action="/charge-payment" method="POST">' +
            '<button id="paymentCheckout" class="purchasebutton" type="submit" style="cursor:pointer;" type="button">PURCHASE MAP FOR $' + (spotJson.amount / 100) + ' </button>' +
            '<script ' +
            'src="https://checkout.stripe.com/checkout.js" class="stripe-button"' +
            'data-key="pk_live_bWpyUCRzEuta6fsiwTAaDJaj"' +
            'data-amount="' + spotJson.amount + '"' +
            'data-name="Ravle"' +
            'data-description="Secure Payment"' +
            'data-image="/public/img/icons/logo_payment.png"' +
            'data-locale="auto"' +
            'data-zip-code="true"' +
            'allowRememberMe="false">' +
            '</script>' +
            '<input type="hidden" name="tripId" value="' + spotJson.tripId + '">' +
            '<input type="hidden" name="spotId" value="' + spotJson.id + '">' +
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
                    parent.setupMap(spotJson, response.data[spotJson.id].gps);
                }
                else
                {
                  $('#map').hide();
                  $('#mapGuideTextId').hide();
                }
            },
            error: function (xhr) {
                console.error("server response for map cords:" + JSON.stringify(xhr));
            }
        });
    },
    getMapCoords: function (spotJson) {
        let parent = this;
        setTimeout(() => {
            if (session.isLoggedIn) {
                parent.getMapDataAndRefresh(spotJson);
            } else {
                $('#map').hide();
                $('.routebuttonalign').hide();
                $('#mapGuideTextId').hide();
                //again check for data, as there is delay in fb immediately after login...
                setTimeout(() => {
                    if (session.isLoggedIn) {
                        //login name not set...so refresh the component
                        parent.handleLogin();
                        parent.handleCheckoutCore(spotJson);
                        parent.getMapDataAndRefresh(spotJson);
                    }
                }, 4500);
            }
        }, 1500);
    },


    updateCarouselContent: function (spotJson) {
        var parent = this;
        var itemTemp = '<div class="carousel-item">' +
            '<img style="width: 100%" src="IMG-SRC" >' +
            '</div>';
        var indicatorTemp = '<li data-target="#spotsCarousel" style="cursor: pointer" data-slide-to="NO"></li>';

        var baseCarouselContent =
            '<ol class="carousel-indicators"></ol>' +
            '<div class="carousel-inner" role="listbox"></div>' +
            '<a class="carousel-control-prev" href="#spotsCarousel" role="button" data-slide="prev">' +
            '<img src="public/img/icons/LeftArrow.svg" style="height: 10%;	width: 10%;"/>' +
            '</a>' +
            '<a class="carousel-control-next" href="#spotsCarousel" role="button" data-slide="next">' +
            '<img src="public/img/icons/RightArrow.svg" style="height: 10%;	width: 10%;"/>' +
            '</a>';

        $(parent.spotsCarousel).html('');
        $(parent.spotsCarousel).html($(baseCarouselContent));

        spotJson.images.forEach((image, index) => {
            var indicator = $(indicatorTemp.replace('NO', index));
            var item = $(itemTemp.replace('IMG-SRC', image));
            if (index === 0) {
                //$(indicator).addClass("active");
                $(item).addClass("active");
            }
            $(parent.spotsCarousel + ' .carousel-indicators').append($(indicator));
            $(parent.spotsCarousel + ' .carousel-inner').append($(item));
        });
      }
};

window.spotDetail = spotDetail;
