//
//
// //Add gps coordiante to array spotsLocationArray
//
// var spotsLocationArray=[{lat:48.9567, lng:2.3508},{lat:48.8567, lng:2.3508},{lat:48.6567, lng:2.5508},{lat:48.8567, lng:2.4508},{lat:48.8367, lng:2.3578},{lat:48.6667, lng:2.2208}];
//
//
//
// function addMarkersToMap(map) {
//
//
//   var icon = new H.map.Icon('public/img/Pindrop.svg',{size:{w:40,h:40}});
//
//
//   var group = new H.map.Group();
//   for(var i=0; i<spotsLocationArray.length;i++)
//   {
//
//      var parisMarker = new H.map.Marker(spotsLocationArray[i],  { icon: icon });
//      // add markers to the group
//      group.addObjects([parisMarker]);
//   }
//
//
//   map.addObject(group);
//
//   // get geo bounding box for the group and set it to the map
//   map.setViewBounds(group.getBounds());
// }
//
//
//
// //Step 1: initialize communication with the platform
// var platform = new H.service.Platform({
//   app_id: '0xXWtM8YjKytm00you04',
//   app_code: '4TxZjGadhaswrhkA1L9x1Q',
//   useCIT: true,
//   useHTTPS: true
// });
// var defaultLayers = platform.createDefaultLayers();
//
// //Step 2: initialize a map - this map is centered over Europe
// var map = new H.Map(document.getElementById('map'),
//   defaultLayers.normal.map,{
//   center: {lat:48.9567, lng:2.3508},
//   zoom: 10
// });
//
// //Step 3: make the map interactive
// // MapEvents enables the event system
// // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
// var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
//
// // Create the default UI components
// var ui = H.ui.UI.createDefault(map, defaultLayers);
//
// // Now use the map as required...
// addMarkersToMap(map);
