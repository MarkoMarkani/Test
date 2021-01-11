import React, {  useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllRules } from '../../actions/perseo';

const RulesList = ({ perseo: { rules }, getAllRules }) => {

  useEffect(() => {
    getAllRules();
  }, [getAllRules]);
  console.log(rules);

  return (
    <div className='wrapper'>
      <h3>List of submitted rules</h3>
      {rules.map((rule, idx) => (
        <ul className='entityList' key={idx}>
          <li>
            <p className="ruleName">{JSON.stringify(rule.name)}</p>
            {/* <p>{JSON.stringify(rule.text)}</p> */}
          </li>
        </ul>
      ))}
    </div>
  );
};

RulesList.propTypes = {
  getAllRules: PropTypes.func.isRequired,
  perseo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  perseo: state.perseo,
});

export default connect(mapStateToProps, { getAllRules })(RulesList);
