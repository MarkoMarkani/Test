import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProcessed321Entities } from '../../actions/orion';

const Overview = ({ orion: { entities }, getProcessed321Entities }) => {
  useEffect(() => {
    getProcessed321Entities();
  }, [getProcessed321Entities]);
 // console.log(entities);
  return (
    <div className='wrapper'>
      {/* <h3 className='title'>Overview</h3> */}
      <table id="overview">
      <tbody>
  <tr className="tableHead">
    <th>Name</th>
    <th>Description</th>
    <th>Input</th>
    <th>Input Topic</th>
    <th>Action</th>
  </tr>
  <tr>
    <td>Rule#1 - Requalification of a face recognition</td>
    <td>Rule that checks if a desired suspect has been detected by any of the cameras more than once within a time period of n minute(s), with a recognition possibility range  from n%-m%</td>
    <td>Face recognition with score between n% to m%</td>
    <td>TOP321_FACE_RECO_DONE</td>
    <td><Link className="btnPrimary" to={'/addfirstrule'}>Create</Link></td>
  </tr>
  <tr>
    <td>Rule#2 - Same person, same zone, in a day</td>
    <td>Rule that checks if a person (in the blacklist) has been seen more than once during the n day(s) at a certain geo zone (within several hundred meters)</td>
    <td>Face recognition (with score more than n%), cameraId (position), timestamp</td>
    <td>TOP321_FACE_RECO_DONE</td>
    <td><Link className="btnPrimary" to={'/addsecondrule'}>Create</Link></td>
  </tr>
  <tr>
    <td>Rule#3 - Same person, same zone, in a short period</td>
    <td>Rule that checks if a person (in the blacklist) has been seen more than once in a "short period" at a certain geo zone (within several hundred meters)</td>
    <td>Face recognition (with score more than n%), cameraId (position), timestamp</td>
    <td>TOP321_FACE_RECO_DONE</td>
    <td><Link className="btnPrimary" to={'/addthirdrule'}>Create</Link></td>
  </tr>
  <tr>
    <td>Rule#4 - Group of people, same zone, short period</td>
    <td>Rule that checks if any member of “blacklist” has been detected at a certain geo zone during desired period of time. Depending of number of recognitions by security cameras as well as the time gap between them, a different message to Kafka has been sent after processing incoming data</td>
    <td>Face recognition (with score more than n%), cameraId (position), timestamp</td>
    <td>TOP321_FACE_RECO_DONE</td>
    <td><Link className="btnPrimary" to={'/addfourthrule'}>Create</Link></td>
  </tr>
  </tbody>
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
