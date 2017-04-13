# Google Maps
Vanilla JavaScript plugin to integrate Google Maps into your project with ease.
 
## Features
  - Uses [Google Maps API](http://developers.google.com/maps/)
  - Supports multiple locations
  - Marker icons, different settings for each location
  - Marker content pop-ups
  - Map options, supports the full list of available [options](http://developers.google.com/maps/documentation/javascript/reference#MapOptions)
  - Map styling, recommend [snazzymaps.com](http://snazzymaps.com/)
  - Re-center the map on resize
  - Enable scrollwheel zooming on the map only when the user clicks within the map. Disables scrollwheel again when returning to the window
  - Dynamically access the map and update as and when needed  

## Install
Google Maps only has one dependency which is the API library itself. The API key is optional but it will give you a warning in the console if it's not provided. You can generate a key [here](http://developers.google.com/maps/documentation/javascript/get-api-key).

Include the [google-maps.min.js](http://github.com/jasonalvis/google-maps/blob/master/public/js/google-maps.min.js) file.

```html
<script src="//maps.google.com/maps/api/js?key=YOUR_API_KEY"></script>
<script src="js/google-maps.min.js"></script>
```

## Usage
Google Maps requires a container to hold the map which must have a height applied via CSS.

```html
<div id="map"></div>
```

### Initiate

```js
var googleMap = new GoogleMaps(document.getElementById('map'), {
  // options, defaults listed

  locations: null,
  // array of locations, comma separated list

  mapOptions: null,
  // object of the map options https://developers.google.com/maps/documentation/javascript/reference#MapOptions

  styles: null,
  // array of the map styles

  scrollwheelMouseDown: false
  // boolean set scrollwheel zoom of the map on mousedown

  resize: false
  // boolean re-center the map on resize if set to true
}); 
```

### Working example

```js
var googleMap = new GoogleMaps(document.getElementById('map'), {
  locations: [
    {
      latLng: [51.5176216, -0.0989669]
    },
    {
      latLng: [50.8374694, -0.1412091],
      marker: '/images/marker.svg',
      markerSize: [24, 24],
      markerSizeScaled: [10, 10],
      markerOrigin: [0, 0], 
      markerAnchor: [12, 12],				
      markerContent: '<div>Content...</div>'
    }
  ],
  mapOptions: {
    zoom: 10,
    disableDefaultUI: true,
    draggable: false,
    mapTypeId: 'HYBRID',
    scrollwheel: false
  },
  styles: [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#e9e9e9'},{'lightness':17}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#f5f5f5'},{'lightness':20}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#ffffff'},{'lightness':17}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#ffffff'},{'lightness':29},{'weight':0.2}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#ffffff'},{'lightness':18}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'},{'lightness':16}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#f5f5f5'},{'lightness':21}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#dedede'},{'lightness':21}]},{'elementType':'labels.text.stroke','stylers':[{'visibility':'on'},{'color':'#ffffff'},{'lightness':16}]},{'elementType':'labels.text.fill','stylers':[{'saturation':36},{'color':'#333333'},{'lightness':40}]},{'elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#f2f2f2'},{'lightness':19}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#fefefe'},{'lightness':20}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#fefefe'},{'lightness':17},{'weight':1.2}]}],
  scrollwheelMouseDown: true,
  resize: true
}); 
```

There is a working example included in the [repo](http://github.com/jasonalvis/google-maps/blob/master/public/index.html).

### Markers explained
The following options for the markers are available, for further details please view the [Google Maps API](https://developers.google.com/maps/documentation/javascript/markers#complex_icons) documentation.

```js
{
  marker: '/images/marker.svg',
  // url of the image you want to use

  markerSize: [20, 32],
  // size of the image [width, height]

  markerSizeScaled: [10, 10],
  // scaled size of the image [width, height]

  markerOrigin: [0, 0], 
  // origin for this image [X, Y]

  markerAnchor: [0, 32],		
  // anchor for this image [X, Y]
}
```

### Accessing the map data
You can access the map data and modify as and when needed. When initialising assign the instance to a variable for later use.

```js
var googleMap = new GoogleMaps(document.getElementById('map'), {
  ...
});

// See whats available to us
console.log(googleMap);

// Set the new zoom to 15
// For available Google Maps methods please refer to the documentation
// https://developers.google.com/maps/documentation/javascript/reference
googleMap.map.setZoom(15);

// Available built in methods
googleMap.disableScrollwheel();
googleMap.enableScrollwheel();
googleMap.init();
googleMap.resize();
googleMap.scrollwheelMouseDown();
```

## Required fields

 - One location with `latLng`
 - You must specify a zoom level on the `mapOptions` object

## Supports
Supports IE9+