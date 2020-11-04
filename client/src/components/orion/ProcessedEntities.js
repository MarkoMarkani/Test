import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProcessed321Entities } from '../../actions/orion';

const Entities = ({ orion: { entities }, getProcessed321Entities }) => {
  useEffect(() => {
    getProcessed321Entities();
  }, [getProcessed321Entities]);
  
  return (
    <div className='wrapper'>
      <h3>Processed entities by the CEP</h3>
      <div>
        {entities.reverse().map((entity) => (
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
              <p><span>Count</span>: {entity.count}</p>
              <p><span>Rule Name</span>: {entity.ruleName}</p>
              {/* <p><span>Suspect description</span>: {entity.suspect_description}</p> */}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

Entities.propTypes = {
  getProcessed321Entities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { getProcessed321Entities })(Entities);
