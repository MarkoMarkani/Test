import React, {  useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get321EntitiesByDeviceId } from '../../actions/orion';

const Cameras = ({ orion: { entities }, get321EntitiesByDeviceId, match }) => {
  useEffect(() => {
    get321EntitiesByDeviceId(match.params.id);
  }, [get321EntitiesByDeviceId, match.params.id]);

  const [paramData, setParam] = useState({
    nameParam: '',
    scoresParam: 0
  });

  const { nameParam, scoresParam } = paramData;
  const onChange = (e) =>
    setParam({ ...paramData, [e.target.name]: e.target.value });

  const params = match.params.id.split(':')[3];



  const showEntitiesList = (entity) => (
    <ul className='entityList' key={entity.id}>
      <li>
        <p>
          <span>Id</span>: {entity.id}
        </p>
        <p>
          <span>Type</span>: {entity.type}
        </p>
        <p>
          <span>Time Instant</span>: {entity.TimeInstant}
        </p>

        <p>
          <span>Cam Latitude</span>: {entity.camLatitude}
        </p>
        <p>
          <span>Cam Longitude</span>: {entity.camLongitude}
        </p>
        <p>
          <span>Class Names</span>: {entity.class_names}
        </p>
        <p>
          <span>Description</span>: {entity.description}
        </p>
        <p>
          <span>Device Id</span>: {entity.deviceId}
        </p>
        <p>
          <span>Object Store Id</span>: {entity.objectStoreId}
        </p>
        <p>
          <span>Scores</span>: {entity.scores}
        </p>

      </li>
    </ul>
  );

  return (
    <div className='wrapper'>
      <h3>Camera {params} detections</h3>
      <p>
        <label>
          Filter by the suspect
          <input
            className='search-box'
            type='text'
            name='nameParam'
            placeholder='Enter name'
            value={nameParam}
            onChange={onChange}
          />
        </label>
      </p>
      <p>
        <label>
          Filter by the percentage
          <input
            className='search-box'
            type='text'
            name='scoresParam'
            placeholder='Enter detection percentage'
            value={scoresParam}
            onChange={onChange}
          />
        </label>
      </p>

      <div>
        { !nameParam 
          ? entities
              .filter((entity) => entity.deviceId === params && entity.scores > scoresParam)
              .map((entity) => showEntitiesList(entity))
          : entities
              .filter(
                (entity) =>
                  entity.deviceId === params && entity.class_names === nameParam && entity.scores > scoresParam
              )
              .map((entity) => showEntitiesList(entity))}
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
