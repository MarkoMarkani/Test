import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addFourthRule } from '../../actions/perseo';
import { setAlert } from '../../actions/alert';
import RuleForm from '../layout/RuleForm';

const AddRule = ({ perseo: { rules }, addFourthRule }) => {

  return (
    <RuleForm addRule={addFourthRule}/>
  );
};

AddRule.propTypes = {
  addFourthRule: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  perseo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  perseo: state.perseo,
});

export default connect(mapStateToProps, { addFourthRule, setAlert })(AddRule);
