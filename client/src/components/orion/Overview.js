import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProcessed321Entities } from '../../actions/orion';

const Overview = ({ orion: { entities }, getProcessed321Entities }) => {
  useEffect(() => {
    getProcessed321Entities();
  }, [getProcessed321Entities]);
  console.log(entities);
  return (
    <div className='wrapper'>
      {/* <h3 className='title'>Overview</h3> */}
      <table id="overview">
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Input</th>
    <th>Input Topic</th>
    <th>Output</th>
    <th>Output Topic</th>
  </tr>
  <tr>
    <td>Requalification of a face recognition</td>
    <td>Rule that checks if a desired suspect has been detected by any of the cameras more than once within a time period of 1 minute, with a recognition possibility range  from 50%-80%</td>
    <td>Face recognition with score between 50% and 80%</td>
    <td>TOP321_FACE_RECO_EVENT</td>
    <td>Face recognition message with score 80%</td>
    <td>TOP321_FACE_RECO_EVENT</td>
  </tr>
  <tr>
    <td>Same person, same zone, in a day</td>
    <td>Rule that checks if a person (in the blacklist) has been seen more than once during the same day at a certain geo zone (within several hundred meters)</td>
    <td>Face recognition (with score more than 80%), cameraId (position), timestamp</td>
    <td>TOP321_FACE_RECO_EVENT</td>
    <td></td>
    <td>New topic</td>
  </tr>
  <tr>
    <td>Same person, same zone, in a short period</td>
    <td>Rule that checks if a person (in the blacklist) has been seen more than once in a "short period" at a certain geo zone (within several hundred meters)</td>
    <td>Face recognition (with score more than 80%), cameraId (position), timestamp</td>
    <td>TOP321_FACE_RECO_EVENT</td>
    <td></td>
    <td>New topic</td>
  </tr>
  <tr>
    <td>Group of people, same zone, short period</td>
    <td>Rule that checks if any member of “blacklist” has been detected at a certain geo zone during desired period of time. Depending of number of recognitions by security cameras as well as the time gap between them, a different message to Kafka has been sent after processing incoming data</td>
    <td>Face recognition (with score more than 80%), cameraId (position), timestamp</td>
    <td>TOP321_FACE_RECO_EVENT</td>
    <td></td>
    <td>New topic</td>
  </tr>
  <tr>
    <td>Group of people, same zone, short period</td>
    <td>Rule that checks if a person (in the blacklist) has been recognised and within a certain geo zone (within several hundred meters) an abanEVENTd back-pack is found/detected</td>
    <td>Face recognition (with score more than 80%), object detection, cameraId (position), timestamp</td>
    <td>TOP321_FACE_RECO_EVENT, TOP301_OBJECT_DETECT_EVENT</td>
    <td></td>
    <td>New topic</td>
  </tr>
</table>
    </div>
  );
};

Overview.propTypes = {
  getProcessed321Entities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { getProcessed321Entities })(Overview);
