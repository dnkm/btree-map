import React from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_MAP_API,
  });

  const [map, setMap] = React.useState(null);

  const [locations, setLocations] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  React.useEffect(() => {
    // Fetch location data from JSON file
    fetch("/locations.json")
      .then((response) => response.json())
      .then((data) => setLocations(data.locations));
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          title={location.name}
          onClick={() => setSelectedLocation(location)}
        >
          {selectedLocation && selectedLocation.id === location.id && (
            <InfoWindow onCloseClick={() => setSelectedLocation(null)}>
              <div>
                <h2>{location.name}</h2>
                <p>{location.description}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(App);
