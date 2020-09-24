import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import useSWR from 'swr';
import { getCameraEntities } from '../../actions/orion';
export const icon = new Icon({
  iconUrl: '../../../videocamera.svg',
  iconSize: [25, 25],
});
// const fetcher = (...args) =>
//   fetch(...args
//   //   , {
//   //   method: 'get',
//   //   headers: {
//   //     'Fiware-Service': 'a4blue',
//   //     'Fiware-ServicePath': '/a4blueevents',
//   //   },
//   // }
//   ).then((response) => response.json());


const Maps = ({orion: { entities }, getCameraEntities }) => {
  useEffect(() => {
    getCameraEntities();
  }, [getCameraEntities]);

  // const url =
  //   'http://217.172.12.192:1026/v2/entities?type=IP_Camera&options=keyValues&limit=1000';
  // const { data, error } = useSWR(url, { fetcher });
  // const cameras = data && !error ? data : [];
  // console.log(entities);
  const [activeCamera, setActiveCamera] = React.useState(null);

  return (
    <div className='wrapper'>
      <h3>Maps</h3>
      <Map center={[44.786568, 20.448921]} zoom={12}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {entities.map((entity) => (
          <Marker
            key={entity.id}
            position={[entity.camLatitude, entity.camLongitude]}
            onClick={() => {
              setActiveCamera(entity);
            }}
            icon={icon}
          />
        ))}

        {activeCamera && (
          <Popup
            position={[activeCamera.camLatitude, activeCamera.camLongitude]}
            onClose={() => {
              setActiveCamera(null);
            }}
          >
            <div>
              <Link to={`/camera/${activeCamera.id}`}>Camera id : {activeCamera.id}</Link>
              <p>Camera latitude : {activeCamera.camLatitude}</p>
              <p>Camera longitude : {activeCamera.camLongitude}</p>
            </div>
          </Popup>
        )}
      </Map>
      )
    </div>
  );
};

Maps.propTypes = {
  getCameraEntities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { getCameraEntities })(Maps);
