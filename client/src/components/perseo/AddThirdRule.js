import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import axios from 'axios';
import { addThirdRule } from '../../actions/perseo';
import { setAlert } from '../../actions/alert';
import RuleForm from '../layout/RuleForm';

const AddRule = ({ perseo: { rules }, addThirdRule }) => {

  return (
    <RuleForm addRule={addThirdRule}/>
  );
};

AddRule.propTypes = {
  addThirdRule: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  perseo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  perseo: state.perseo,
});

export default connect(mapStateToProps, { addThirdRule, setAlert })(AddRule);
