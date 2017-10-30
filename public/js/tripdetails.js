var platform = new H.service.Platform({
    app_id: '0xXWtM8YjKytm00you04',
    app_code: '4TxZjGadhaswrhkA1L9x1Q',
    useCIT: true,
    useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();
var map = new H.Map(document.getElementById('map'), defaultLayers.normal.map, {
    center: {
        lat: 48.9567,
        lng: 2.3508
    },
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
var ui = H.ui.UI.createDefault(map, defaultLayers);
behavior.disable(H.mapevents.Behavior.WHEELZOOM);

function addMarkersToMap(tripJson, groupCoOrds) {
    try {
        var htmldata = '<div style=\"background-color:white;padding:-0;margin:0;border:none\">' +
            '<a href=\'/spotdetails?spotId=SPOT_ID\' style=\"font-family: \'Inconsolata-Bold\';color:#FF5350 ;font-size: .9rem;letter-spacing: .05rem;\" >' +
            'NAME</a>' + '</div>';
        var spotsLocationArray = [];
        var spotsNameArray = [];



        var icon = new H.map.Icon('public/img/icons/Pindrop.svg',{size:{w:40,h:40}});

        for (var spot in groupCoOrds) {
            if (groupCoOrds[spot] && groupCoOrds[spot].gps) {
                spotsLocationArray.push(groupCoOrds[spot].gps);
                spotsNameArray.push(htmldata.replace("SPOT_ID", spot).replace("NAME", groupCoOrds[spot].name));
            }
        }
        var group = new H.map.Group();
        for (var i = 0; i < spotsLocationArray.length; i++) {
            var parisMarker = new H.map.Marker(spotsLocationArray[i], {icon: icon});
            parisMarker.setData(spotsNameArray[i]);
            group.addObjects([parisMarker]);
        }
        map.center = groupCoOrds["1"].gps;
        map.addObject(group);

        group.addEventListener('tap', function (evt) {
            var bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
                content: evt.target.getData()
            });
            ui.addBubble(bubble);
        }, false);
        map.setViewBounds(group.getBounds());

    } catch (err) {
        console.error(err.message, err);
    }
}

function resizingWindows() {
    // /var videoHeight = document.getElementById('youtubeVideoSection').clientHeight;
    var videoHeight = 0;
    var headerHeight = document.getElementById('header').clientHeight;
    //var iframheight = document.getElementById('iframeID').clientHeight;
    //  document.getElementById("youtubeVideoSection").style.marginTop = headerHeight.toString() + "px";
    var videoListtop = 0; //-(videoHeight - iframheight) + 30;
    document.getElementById("tripdetailsText").style.marginTop = videoListtop.toString() + "px";
}

function MapButtonClick() {
    $('#MapButton').css('color', '#ff5350');
    $('#Gallery').css('color', '#3B474F');
    $('#galleryDiv').css('visibility', 'hidden');
    $('#galleryDiv').css('display', 'none');
    $('#MapDiv').css('visibility', 'visible');
    $('#MapDiv').css('display', 'block');
}

function GalleryClick() {
    $('#Gallery').css('color', '#ff5350');
    $('#MapButton').css('color', '#3B474F');
    $('#MapDiv').css('visibility', 'hidden');
    $('#MapDiv').css('display', 'none');
    $('#galleryDiv').css('visibility', 'visible');
    $('#galleryDiv').css('display', 'block');
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
let tripDetail = {
    checkoutBtn: '<button id="checkout" class="mapbutton"  style="cursor:pointer;" type="button">GET THE MAP</button>',
    googleMapUrl: 'https://www.google.com/maps/place/LAT,LNG',
    appleMapsUrl: 'http://maps.apple.com/?daddr=LAT,LNG',

    updatePage: function (tripJson) {
        var parent = this;
        try {
            parent.handleLogin();
            //parent.updateYoutubeURL(tripJson);
            parent.handleCheckout(tripJson);
            parent.updateTextContent(tripJson);
            parent.updateSpotImages(tripJson);
            parent.updateExperiences(tripJson);
            parent.getMapCoords(tripJson);
        } catch (ex) {
            console.error("Error constructing spotdetails page...", ex);
        }
    },

    setupMap: function (tripJson, gps) {
        var parent = this;
        $('#map').show();
        $('#mapGuideTextId').show();
        $('.routebuttonalign').hide();
        $('#lockedMap').remove();
        addMarkersToMap(tripJson, gps);
        $('#googleMaps').click(() => {
            window.open(parent.googleMapUrl.replace("LAT", gps["1"].gps.lat).replace("LNG", gps["1"].gps.lng), '_blank');
        });
        $('#appleMaps').click(() => {
            window.open(parent.appleMapsUrl.replace("LAT", gps["1"].gps.lat).replace("LNG", gps["1"].gps.lng), '_blank');
        });
        $('#checkout').hide();
    },

    getMapDataAndRefresh: function (tripJson) {
        var parent = this;
        $.ajax({
            url: "/getMapCoordinates",
            headers: {'token': session.token},
            data: {
                "userId": session.user.uid,
                "tripId": tripJson.id,
                "spotId": "",
            },
            cache: false,
            type: "get",
            success: function (response) {
                //console.log("server response for map cords:" + JSON.stringify(response));
                if (response.status === "success" && response.data) {
                    parent.setupMap(tripJson, response.data);
                } else {
                    $('#map').hide();
                    $('#mapGuideTextId').hide();
                    $('.routebuttonalign').hide();
                }
            },
            error: function (xhr) {
                console.error("server response for map cords:" + JSON.stringify(xhr));
            }
        });
    },
    getMapCoords: function (tripJson) {
        let parent = this;
        setTimeout(() => {
            if (session.isLoggedIn) {
                parent.getMapDataAndRefresh(tripJson);
            } else {
                //again check for data, as there is delay in fb immediately after login...
                $('#map').hide();
                $('#mapGuideTextId').hide();
                $('.routebuttonalign').hide();
                setTimeout(() => {
                    if (session.isLoggedIn) {
                        //login name not set...so refresh the component
                        parent.handleLogin();
                        parent.handleCheckoutCore(tripJson);
                        parent.getMapDataAndRefresh(tripJson);
                    }
                }, 4500);
            }
        }, 1500);
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

    handleCheckout: function (tripJson) {
        var parent = this;
        setTimeout(function () {
            parent.handleCheckoutCore(tripJson);
        }, 1000);
    },

    getPaymentHtml: function (tripJson) {
        return '<div id="paymentForm">' +
            '<form action="/charge-payment" method="POST">' +
            '<button id="paymentCheckout" class="purchasebutton" type="submit" style="cursor:pointer;" type="button">PURCHASE MAP FOR $' + (tripJson.amount / 100) + ' </button>' +
            '<script ' +
            'src="https://checkout.stripe.com/checkout.js" class="stripe-button"' +
            'data-key="pk_live_bWpyUCRzEuta6fsiwTAaDJaj"' +
            'data-amount="' + tripJson.amount + '"' +
            'data-name="Ravle"' +
            'data-description="Secure Payment"' +
            'data-image="/public/img/icons/logo_payment.png"' +
            'data-locale="auto"' +
            'data-zip-code="true"' +
            'allowRememberMe="false">' +
            '</script>' +
            '<input type="hidden" name="tripId" value="' + tripJson.id + '">' +
            '<input type="hidden" name="spotId" value="">' +
            '<input type="hidden" name="userId" value="' + session.user.uid + '">' +
            '</form>' +
            '</div>';
    },

    updateExperiences: function (tripJson) {
        var experienceUrl = "/experiencedetails?experienceId=";
        var experiences = document.getElementById('experiences');
        experiences.innerHTML = '';
        var experiencesList = '';
        tripJson.experiences.forEach((experience) => {
            var item = '<a href=\"' + experienceUrl + experience.experienceId + '\"><figure class=\'snip1156\'><img src=\'' + experience.image + '\' /><figcaption><div><h2>' + experience.tagline + '</h2></div><div><p>' + experience.location + '</p></div></figcaption></figure></a>';
            //  var item = '<a href=\''+ experienceUrl+experience.experienceId+'\'><div class="banner" style="background-image: url(\''+experience.image+'\') ;background-position:top left;background-repeat: no-repeat;background-size: cover;"><div class="banner-text"><h3>'+experience.tagline+'</h3></div></div></a>';
            experiencesList += item;
        });
        experiences.innerHTML = experiencesList;
    },
    updateSpotImages: function (tripJson) {
        var spotsUrl = "/spotdetails?spotId=";
        var spotsgallery = document.getElementById('spotsgallery');
        spotsgallery.innerHTML = '';
        var spotsList = '';
        tripJson.spots.forEach((image) => {
            var item = '<div class="item"><a href="' + spotsUrl + image.spotId + '"><img src="' + image.image + '" alt="" /></a> </div>'
            //$(imageBase.replace('public/img/SpotPage/Spot3.jpg', image.image).replace('HREFURL',spotsUrl+image.spotId));
            spotsList += item;
        });
        spotsgallery.innerHTML = spotsList;
    },
    updateTextContent: function (tripJson) {
        document.getElementById('tripTitle').innerHTML = tripJson.name;
        //update photographers
        var pContentText = 'FILM AND PHOTOGRAPHY BY ';
        var pContentHtml = '<a href="HREF" style="color:red;"><text>NAME</text></a>';
        var contents = '';
        var photoGrapLength = tripJson.photographers.length;
        for (i = 0; i < photoGrapLength; i++) {
            contents += pContentHtml.replace('HREF', tripJson.photographers[i].instagram).replace('NAME', tripJson.photographers[i].name);
            if (photoGrapLength != 1 && i != photoGrapLength - 1) {
                contents += ' AND ';
            }
        }
        contents = pContentText + contents;
        document.getElementById('PhotographerDetails').innerHTML = contents;
        var entrieTripDescrition = tripJson.description;
        var startDescription = entrieTripDescrition.split(/\s+/).slice(0,25).join(" ");
        var endDescription = entrieTripDescrition.split(/\s+/).slice(25,entrieTripDescrition.length).join(" ");
        var tripLocation = tripJson.location;
  // Old copy      document.getElementById('tripDescription').innerHTML = '<text>' + tripJson.location + '</text>' + ' - ' + tripJson.description;
          document.getElementById('tripDescription').innerHTML = '<text>' + tripJson.location + '</text>' + ' - ' + startDescription + ' <a id="readMoreText" style="cursor:pointer; color:#ff5350;" class="read_more">... Read More</a> ' +   '<span class="more_text" style="display:none;">'+endDescription+'</span>'+'<a id="readLessText" style="cursor:pointer; color:#ff5350;display:none;" class="read_less">Read Less</a> ' ;
          document.getElementById('videoClass').innerHTML = '<iframe id="iframeID" style="border:0" class="embed-responsive-item" src="' + tripJson.videoUrl + '" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';

          $('a.read_more').click(function(event){
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
    updateCarouselContent: function (spotJson) {
        var parent = this;
        var itemTemp = '<div class="carousel-item">' + '<img style="width: 100%" src="IMG-SRC" >' + '</div>';
        var indicatorTemp = '<li data-target="#spotsCarousel" style="cursor: pointer" data-slide-to="NO"></li>';
        var baseCarouselContent = '<ol class="carousel-indicators"></ol>' + '<div class="carousel-inner" role="listbox"></div>' + '<a class="carousel-control-prev" href="#spotsCarousel" role="button" data-slide="prev">' + '<img src="public/img/icons/LeftArrow.svg" style="height: 10%;	width: 10%;"/>' + '</a>' + '<a class="carousel-control-next" href="#spotsCarousel" role="button" data-slide="next">' + '<img src="public/img/icons/RightArrow.svg" style="height: 10%;	width: 10%;"/>' + '</a>';
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
window.tripDetail = tripDetail;
