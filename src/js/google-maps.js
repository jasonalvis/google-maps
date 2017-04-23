/*!
 * Name: Google Maps
 * Author: Jason Alvis
 * Author URI: http://jasonalvis.co.uk
 * Description: Google Maps JavaScript Plugin
 * Version: 0.0.1
 */ 

(function (root, factory) {
  /* eslint-disable */
  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.GoogleMaps = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
  /* eslint-enable */
  
  'use strict'; 

  /**
   * Default options
   * @private
   * @type {Object}
   */
  var defaults = {
    locations: null,
    mapOptions: null,
    styles: null,
    scrollwheelMouseDown: false,
    resize: false
  };

  /**
   * Merge defaults with user options
   * @private
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   * @returns {Object} Merged values of defaults and options
   */
  var extend = function ( defaults, options ) {
    var extended = {};
    var prop;

    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }

    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }

    return extended;
  };

  /**
   * Constructor
   * @public
   * @param element The html element to initialize
   * @param {Object} options User options
   * @constructor
   */
  function GoogleMaps( element, options ) {
    /**
     * DOM element
     */
    this.element = element;

    /**
     * Merge user options with defaults
     */
    this.options = extend( defaults, options || {} );

    // If no element or locations return
    if(!this.element || !this.options.locations) {
      return;
    }

    // Initialise
    this.init();
  }

  /**
   * Initialise
   * @public
   */
  GoogleMaps.prototype.init = function() {  
    var _this     = this;
    var options   = _this.options;
    var locations = options.locations;

    // Map type
    if(options.mapOptions) {
      if(options.mapOptions.mapTypeId === 'HYBRID') {
        options.mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
      } else if(options.mapOptions.mapTypeId === 'SATELLITE') {
        options.mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
      } else if(options.mapOptions.mapTypeId === 'TERRAIN') {
        options.mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
      } else {
        options.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
      }      
    } else {
      options.mapOptions = {};
      options.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
    }

    if(locations.length > 1) {
      // Create empty latLngBounds object if more than 1 location
      var latLngBounds = new google.maps.LatLngBounds();
    } else {
      // Else there is only 1 location, set the center and zoom to that marker
      options.mapOptions.center = new google.maps.LatLng(locations[0].latLng[0], locations[0].latLng[1]);
    }

    // Create map
    _this.map = new google.maps.Map(_this.element, options.mapOptions);

    // Set any map styles, no styles by default
    if(options.styles) {
      _this.map.setOptions({
        styles: options.styles
      });
    }

    // Loop through the locations and apply a marker
    locations.forEach(function(location) {
      var mapIcon = null; 

      // If a custom marker has been supplied apply it
      if(location.marker && location.markerSize && location.markerOrigin && location.markerAnchor) {
        mapIcon = {
          url: location.marker,
          size: new google.maps.Size(location.markerSize[0], location.markerSize[1]),
          origin: new google.maps.Point(location.markerOrigin[0], location.markerOrigin[1]),
          anchor: new google.maps.Point(location.markerAnchor[0], location.markerAnchor[1])
        }; 

        if(location.markerSizeScaled) {
          mapIcon.markerSizeScaled = new google.maps.Size(location.markerSizeScaled[0], location.markerSizeScaled[1]);          
        }
      }

      // Add the icon to the marker
      var mapMarker = new google.maps.Marker({
        position: new google.maps.LatLng(location.latLng[0], location.latLng[1]),
        map: _this.map,
        icon: mapIcon
      });   

      // Add marker content
      if(location.markerContent) {
        var infowindow = new google.maps.InfoWindow({
          content: location.markerContent
        });

        mapMarker.addListener('click', function() {
          infowindow.open(_this.map, mapMarker);
        });
      }

      // Extend the bounds to include each markers position if more than 1 location
      if(locations.length > 1) {
        latLngBounds.extend(mapMarker.position);
      }
    }); 

    // Center the map dynamically between all the markers if more than 1 location
    if(locations.length > 1) {
      _this.map.fitBounds(latLngBounds);
    }
  
    // Enable scroll wheel on mouse down
    if(options.scrollwheelMouseDown) {
      _this.scrollwheelMouseDown();
    }

    // Enable resize to re-center the map
    if(options.resize) {
      _this.resize();
    }
  };

  /**
   * Zoom with scrollwheel on mouse down
   * @public
   */
  GoogleMaps.prototype.scrollwheelMouseDown = function() {
    var _this = this;

    // Make sure its turned off by default
    _this.disableScrollwheel();

    // On mousedown: enable scrollwheel the map with mouse wheel
    google.maps.event.addListener(_this.map, 'mousedown', function() {
      _this.enableScrollwheel();
    });

    // On window scroll: disable scrollwheel
    window.addEventListener('scroll', function() {
      _this.disableScrollwheel();
    });
  };

  /**
   * Enable scrollwheel
   * @public
   */
  GoogleMaps.prototype.enableScrollwheel = function() {
    // Only run if its false
    if(!this.options.mapOptions.scrollwheel) { 
      this.map.setOptions({
        scrollwheel: true
      });

      // Set it to true on our options
      this.options.mapOptions.scrollwheel = true;
    }
  };

  /**
   * Disable scrollwheel
   * @public 
   */
  GoogleMaps.prototype.disableScrollwheel = function() {
    // Only run if its true
    if(this.options.mapOptions.scrollwheel) {
      this.map.setOptions({
        scrollwheel: false
      });

      // Set it to false on our options
      this.options.mapOptions.scrollwheel = false; 
    }   
  };   

  /**
   * Re-center the map on resize
   * @public     
   */
  GoogleMaps.prototype.resize = function() {
    var _this     = this;
    var locations = _this.options.locations;

    // Center the map dynamically between all the markers if more than 1 location
    if(locations.length > 1) {
      var latLngBounds = new google.maps.LatLngBounds();

      locations.forEach(function(location) {
        latLngBounds.extend(new google.maps.LatLng(location.latLng[0], location.latLng[1]));
      });

      // Set the center on resize
      google.maps.event.addDomListener(window, 'resize', function() {
        _this.map.fitBounds(latLngBounds);
      });
    } else {
      var center;

      // Get the center once the map has finished setting up
      google.maps.event.addDomListener(_this.map, 'idle', function() {
        center = _this.map.getCenter();      
      });

      // Set the center on resize
      google.maps.event.addDomListener(window, 'resize', function() {
        _this.map.setCenter(center);
      });
    }
  };

  return GoogleMaps;

});