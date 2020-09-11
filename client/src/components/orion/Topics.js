import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Topics = ({ orion: { Topics }, getAllTopics }) => {
//   useEffect(() => {
//     getAllTopics();
//   }, [getAllTopics]);
//   console.log(Topics);
  return (
    <div className='wrapper'>
      <h3>Topics list</h3>
      <div>
      
          <ul className='entityList' >
            
          <li> <p><Link to="/face321">TOP321_FACE_RECO_EVENT</Link></p></li>
          <li> <p><Link to="/object301">TOP301_OBJECT_DETECT_EVENT</Link></p></li>  
          
          </ul>
        
      </div>
    </div>
  );
};

Topics.propTypes = {
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { })(Topics);
