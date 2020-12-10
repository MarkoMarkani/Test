import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import axios from 'axios';
import { addSecondRule } from '../../actions/perseo';
import { setAlert } from '../../actions/alert';
import RuleForm from '../layout/RuleForm';

const AddRule = ({ perseo: { rules }, addSecondRule }) => {


  return (
   <RuleForm addRule={addSecondRule}/>
  );
};

AddRule.propTypes = {
  addSecondRule: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  perseo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  perseo: state.perseo,
});

export default connect(mapStateToProps, { addSecondRule, setAlert })(AddRule);
