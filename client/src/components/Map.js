import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import PinIcon from "./PinIcon";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import context from '../context';
import Blog from "./Blog";

const INITIAL_VIEWPORT = {
  latitude: 16.05632,
  longitude: 108.1786368,
  zoom: 8,
}

const Map = ({ classes }) => {

  const { state, dispatch } = useContext(context);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition();
  }, [])

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude })
      });
    }
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" })
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: {
        latitude,
        longitude
      }
    })
  }
 
  return (
    <div className = { classes.root }>
      <ReactMapGL
      onClick = { handleMapClick }
        onViewportChange = { newViewport => { setViewport(newViewport) } }
        { ...viewport }
        width = "100vw"
        height="calc(100vh - 64px)"
        mapStyle = "mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken = "pk.eyJ1IjoibmdxdWFuZ2FuIiwiYSI6ImNqdGpvazdqbTBhZmczeXFqd242dHE3a2YifQ.x8OrqwQl6qptF7I15GwHfQ"
      >
        <div className = { classes.navigationControl }>
          <NavigationControl 
            onViewportChange = { newViewport => { setViewport(newViewport) } }
          />
        </div>

        {
          userPosition && (
            <Marker
              { ...userPosition }
              offsetLeft = { -19 }
              offsetTop = { -37 }
            >
              <PinIcon 
                size = { 40 }
                color = "red"
              />
            </Marker>
          )
        }

        { 
          state.draft && (
            <Marker
              { ...state.draft }
              offsetLeft = { -19 }
              offsetTop = { -37 }
            >
              <PinIcon 
                size = { 40 }
                color = "hotpink"
              />
            </Marker>
          )
         }
      </ReactMapGL>

      <Blog />

    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
