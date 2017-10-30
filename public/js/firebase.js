//inlcude the below scripts in the html file
//<script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js"></script>
//<script src="https://cdn.firebase.com/libs/firebaseui/2.3.0/firebaseui.js"></script>
//<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.3.0/firebaseui.css"/>


let session = {
    user: undefined,
    trips: undefined,
    tripDetail: undefined,
    spotDetail: undefined,
    experienceDetail: undefined,
    orders: undefined,
    isLoggedIn: false,
    token: undefined,
    config: {
        apiKey: "AIzaSyBZ7ynq9wEj09in6kdhUV4Ow_DoKaPIiNA",
        authDomain: "ravleuserside.firebaseapp.com",
        databaseURL: "https://ravleuserside.firebaseio.com",
        projectId: "ravleuserside",
        storageBucket: "",
        messagingSenderId: "188136108242"
    },
    uiConfig: {
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    },

    updateUser: function () {
        let parent = this;
        $.ajax({
            url: "/insertUser",
            headers: {'token': parent.token},
            data: {
                "userId": parent.user.uid,
            },
            cache: false,
            type: "get",
            success: function (response) {
                //console.log("server response for insert user:" + JSON.stringify(response));
            },
            error: function (xhr) {
                //console.log("server response for insert user:" + JSON.stringify(xhr));
            }
        });
        $.ajax({

    url: "https://emailoctopus.com/lists/2c799aab-b6dc-11e7-a9b5-026662568990/members/external-add",
    headers: {'content-type': 'application/json'
          },
data :{
"api_key": "e5a710d5-b6db-11e7-a9b5-026662568990",
"email_address": "joe@bloggs.com",
"first_name": "Joe",
"last_name": "Bloggs",
"subscribed": true
  },
    cache: false,
    type: "post",
    success: function (response) {
        console.log("server response for insert user:" + JSON.stringify(response));
    },
    error: function (xhr) {
        console.log("server response for insert user:" + JSON.stringify(xhr));
    }
});

        $.ajax({

            url: "https://ravle.us16.list-manage.com/subscribe/post?u=d1b731e8626c899361d706073&amp;id=98952b8900",
            headers: {'content-type': 'application/json'
                  },
        data :{"email_address":"sujaym0610@gmail.com","first_name":"sujay", "last_name":"mahesh",  "status":"subscribed"} ,
            cache: false,
            type: "post",
            success: function (response) {
                //console.log("server response for insert user:" + JSON.stringify(response));
            },
            error: function (xhr) {
                //console.log("server response for insert user:" + JSON.stringify(xhr));
            }
        });
    },

    getOrdersData: function () {
        let parent = this;
        console.log('fetching orders data..');
        return new Promise(
            function (resolve, reject) {
                firebase.database().ref('/orders/' + parent.user.uid).once('value').then(function (snapshot) {
                    if (snapshot && snapshot.val()) {
                        resolve(snapshot.val());
                    } else {
                        reject('No orders found!!');
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        );
    },

    getTripsDataRest: function () {
        let parent = this;
        console.log('fetching trips data -rest');
        return new Promise(
            function (resolve, reject) {
                $.ajax({
                    url: "/tripsData",
                    cache: false,
                    type: "get",
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (xhr) {
                        reject(xhr);
                    }
                });
            }
        );
    },

    getTripsData: function () {
        console.log('fetching trips data ');
        return new Promise(
            function (resolve, reject) {
                if (tripId !== undefined || tripId !== null) {
                    firebase.database().ref('/trips').once('value').then(function (snapshot) {
                        return snapshot && snapshot.val() ? resolve(snapshot.val()) : reject ? reject('No data available- trips') : '';
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    resolve(null);
                }
            }
        );
    },

    getTripDetailDataRest: function (tripId) {
        let parent = this;
        console.log('fetching trip detail data -rest  for id:' + tripId);
        return new Promise(
            function (resolve, reject) {
                if (tripId !== undefined || tripId !== null) {
                    $.ajax({
                        url: "/tripDetailsData?tripId=" + tripId,
                        cache: false,
                        type: "get",
                        success: function (response) {
                            resolve(response);
                        },
                        error: function (xhr) {
                            reject(xhr);
                        }
                    });
                } else {
                    resolve(null);
                }
            }
        );
    },

    getTripDetailData: function (tripId) {
        console.log('fetching trip detail data for id:' + tripId);
        return new Promise(
            function (resolve, reject) {
                if (tripId !== undefined || tripId !== null) {
                    firebase.database().ref('/tripDetails/' + tripId).once('value').then(function (snapshot) {
                        return snapshot && snapshot.val() ? resolve(snapshot.val()) : reject ? reject('No data available- tripDetails') : '';
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    resolve(null);
                }
            }
        );
    },

    getExperienceDetailDataRest: function (expId) {
        let parent = this;
        console.log('fetching experience detail data -rest  for id:' + expId);
        return new Promise(
            function (resolve, reject) {
                if (expId !== undefined || expId !== null) {
                    $.ajax({
                        url: "/experienceDetailsData?experienceId=" + expId,
                        cache: false,
                        type: "get",
                        success: function (response) {
                            resolve(response);
                        },
                        error: function (xhr) {
                            reject(xhr);
                        }
                    });
                } else {
                    resolve(null);
                }
            }
        );
    },
    getExperienceDetailData: function (expId) {
        console.log('fetching Experience detail data for id:' + expId);
        return new Promise(
            function (resolve, reject) {
                if (expId !== undefined || expId !== null) {
                    firebase.database().ref('/experienceDetails/' + expId).once('value').then(function (snapshot) {
                        return snapshot && snapshot.val() ? resolve(snapshot.val()) : reject ? reject('No data available - experienceDetails') : '';
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    resolve(null);
                }
            }
        );
    },

    getSpotDetailDataRest: function (spotId) {
        let parent = this;
        console.log('fetching spot detail data -rest  for id:' + spotId);
        return new Promise(
            function (resolve, reject) {
                if (spotId !== undefined || spotId !== null) {
                    $.ajax({
                        url: "/spotDetailsData?spotId=" + spotId,
                        cache: false,
                        type: "get",
                        success: function (response) {
                            resolve(response);
                        },
                        error: function (xhr) {
                            reject(xhr);
                        }
                    });
                } else {
                    resolve(null);
                }
            }
        );
    },
    getSpotDetailData: function (spotId) {
        console.log('fetching spot details data..id:' + spotId);
        return new Promise(
            function (resolve, reject) {
                if (spotId !== undefined || spotId !== null) {
                    firebase.database().ref('/spotDetails/' + spotId).once('value').then(function (snapshot) {
                        return snapshot && snapshot.val() ? resolve(snapshot.val()) : reject ? reject('No data available - spotDetails') : '';
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    resolve(null);
                }
            }
        );
    },

    getToken: function () {
        let parent = this;
        firebase.auth().currentUser.getToken(true).then(function (idToken) {
            parent.token = idToken;
        }).catch(function (error) {
            console.log("failed to get fb token.." + error);
        });
    },

    logout: function () {
        firebase.auth().signOut();
        this.isLoggedIn = false;
        this.user = undefined;
    },

// fetchTrips is a boolean param, tripId,spotId,expId - specify the id, success and failure callbacks refer to user
// login success or failure
    initFirebase: function (fetchTrips, tripId, spotId, expId, onSuccessCallback, onFailureCallback) {
     let parent = this;
     firebase.initializeApp(this.config);
     var userPromise = parent.initLoginSession();
        var tripsPromise = fetchTrips ? parent.getTripsDataRest().then((trips) => {
            console.log("fetched all trips, summary..");
         parent.trips = trips;
        }).catch((error) => console.log(error)) : true;
        var tripDetailPromise = tripId ? parent.getTripDetailDataRest(tripId).then((tripDetail) => {
            console.log('trip detail fetched');
            parent.tripDetail = tripDetail;
        }).catch((err) => console.log(err)) : true;
        var spotDetailPromise = spotId ? parent.getSpotDetailDataRest(spotId).then((spotDetail) => {
            console.log('spot detail fetched');
            parent.spotDetail = spotDetail;
        }).catch((err) => console.log(err)) : true;
        var experiencePromise = expId ? parent.getExperienceDetailDataRest(expId).then((expDetail) => {
            console.log('experience detail fetched');
            parent.experienceDetail = expDetail;
        }).catch((err) => console.log(err)) : true;

        Promise.all([tripsPromise, tripDetailPromise, spotDetailPromise, experiencePromise, userPromise]).then(values => {
         console.log('all promises resolved');
         onSuccessCallback();
     }).catch(function (err) {
            console.log('some promises failed/error in successCallback..' + err);
         onFailureCallback();
     });
 },
    initLoginSession: function () {
        let parent = this;
        return firebase.auth().onAuthStateChanged(function (user) {
            console.log('user account resolved');
            if (user) {
                parent.isLoggedIn = true;
                parent.user = user;
                user.getIdToken().then(function (token) {
                    parent.token = token;
                    console.log("token resolved");
                    parent.updateUser();
                });
                //fetching orders info from server...not needed here
                /*parent.getOrdersData().then(function (orders) {
                    parent.orders = orders;
                }).catch(function (err) {
                    console.log(err);
                 });*/
            } else {
                parent.isLoggedIn = false;
                parent.orders = undefined;
                parent.user = undefined;

            }
        }, function (error) {
            console.log(error);
        });
    },

    initLoginUI: function (divId, successCallBack, failureCallBack) {
        try {
            let ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start(divId, this.uiConfig);
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    if (successCallBack) successCallBack();
                } else {
                    if (failureCallBack) failureCallBack();
                }
            });

        } catch (err) {
            console.log('Firebase UI scripts not loaded!!');
        }

    }
};
window.session = session;
