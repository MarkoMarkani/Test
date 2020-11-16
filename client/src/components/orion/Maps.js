import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';

import { getCameraEntities } from '../../actions/orion';
export const icon = new Icon({
  iconUrl: '../../../videocamera.svg',
  iconSize: [25, 25],
});


const Maps = ({ orion: { entities }, getCameraEntities }) => {
  useEffect(() => {
    getCameraEntities();
  }, [getCameraEntities]);


  const [activeCamera, setActiveCamera] = React.useState(null);

  return (
    <div className='wrapper'>
      <h3>Maps</h3>
      <Map center={[52.370216,4.895168]} zoom={12}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {entities.map((entity) => (
          <Fragment key={entity.id}>
            <Marker
            
              position={[entity.camLatitude, entity.camLongitude]}
              onClick={() => {
                setActiveCamera(entity);
              }}
              icon={icon}
            />

          </Fragment>
        ))}

        {activeCamera && (
          <Popup
            position={[activeCamera.camLatitude, activeCamera.camLongitude]}
            onClose={() => {
              setActiveCamera(null);
            }}
          >
            <div>
              <Link to={`/camera/${activeCamera.id}`}>
                Camera id : {activeCamera.id}
              </Link>
              <p>Camera latitude : {activeCamera.camLatitude}</p>
              <p>Camera longitude : {activeCamera.camLongitude}</p>
            </div>
          </Popup>
        )}
      </Map>
      
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
