import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllEntities } from '../../actions/orion';

const Overview = ({ orion: { entities }, getAllEntities }) => {
  useEffect(() => {
    getAllEntities();
  }, [getAllEntities]);
  console.log(entities);
  return (
    <div class='wrapper'>
      <h3 class='title'>Overview</h3>

    </div>
  );
};

Overview.propTypes = {
  getAllEntities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { getAllEntities })(Overview);
