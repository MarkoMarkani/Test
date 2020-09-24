import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get321EntitiesByDeviceId } from '../../actions/orion';

const Cameras = ({ orion: { entities }, get321EntitiesByDeviceId,match }) => {
  useEffect(() => {
    get321EntitiesByDeviceId(match.params.id);
  }, [get321EntitiesByDeviceId, match.params.id]);

const params=match.params.id.split(":")[3];

  return (
    <div className='wrapper'>
      <h3>Camera {params} detections</h3>
      <div>
        {entities.filter((entity) => (entity.deviceId===params)).map(
            entity=>(
                <ul className='entityList' key={entity.id}>
                <li>
                  <p><span>Id</span>: {entity.id}</p>
                  <p><span>Type</span>: {entity.type}</p>
                  <p><span>Time Instant</span>: {entity.TimeInstant}</p>
                  {/* <p><span>Attach Desc</span>: {entity.attachDesc}</p> */}
                  <p><span>Cam Latitude</span>: {entity.camLatitude}</p>
                  <p><span>Cam Longitude</span>: {entity.camLongitude}</p>
                  <p><span>Class Names</span>: {entity.class_names}</p>
                  <p><span>Description</span>: {entity.description}</p>
                  <p><span>Device Id</span>: {entity.deviceId}</p>
                  <p><span>Object Store Id</span>: {entity.objectStoreId}</p>
                  <p><span>Scores</span>: {entity.scores}</p>
                  {/* <p><span>Suspect description</span>: {entity.suspect_description}</p> */}
                </li>
              </ul>
        ))}
      </div>
    </div>
  );
};

Cameras.propTypes = {
  get321EntitiesByDeviceId: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { get321EntitiesByDeviceId })(Cameras);
