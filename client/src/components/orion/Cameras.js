import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCameraEntities } from '../../actions/orion';

const Cameras = ({ orion: { entities }, getCameraEntities }) => {
  useEffect(() => {
    getCameraEntities();
  }, [getCameraEntities]);
 console.log(entities);
  return (
    <div className='wrapper'>
      <h3>Camera list</h3>
      <div>
        {entities.map((entity) => (
          <ul className='entityList' key={entity.id}>
            <li>
              <Link to={`/camera/${entity.id}`}><span>Id</span>: {entity.id}</Link>
              <p><span>Type</span>: {entity.type}</p>
              <p><span>Cam Latitude</span>: {entity.camLatitude}</p>
              <p><span>Cam Longitude</span>: {entity.camLongitude}</p>
       
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

Cameras.propTypes = {
  getCameraEntities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { getCameraEntities })(Cameras);
