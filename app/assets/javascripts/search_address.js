(function() {
  var GOOGLE_API_KEY = "AIzaSyArZdA9op5OI5Tkuow3LkyPqjCPPdSPMEw";

  window.searchAddress = function(el) {
    var currentAddress = $(el).val();
    var $dropdown = $(".custom-dropdown");

    if (!currentAddress) {
      $dropdown.empty();
      $dropdown.removeClass("active");
    } else {
      geocode(currentAddress).then(function(r) {
        var results = r.results;
        var status = r.status;

        $dropdown.empty();
        $dropdown.addClass("active");

        if (status === "OK") {
          var addresses = results.map(function(r) { return r.formatted_address; } );
          addresses.forEach(function(address) {
            $dropdown.append("<li>" + address + "</li>");
          });
        } else {
          $dropdown.append("<li class='notification'>the address indicated not found on the google map</li>");
        }
      });
    }
  }

  function geocode(address) {
    return fetch(composeGeocoderUrl(address)).then(function(r) { return r.json(); });
  }

  function composeGeocoderUrl(address) {
    return "https://maps.googleapis.com/maps/api/geocode/json?address=" + address +
      "&key=" + GOOGLE_API_KEY;
  }
})();
