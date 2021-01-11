import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Alert from '../layout/Alert';
import ProcessedEntities from '../orion/ProcessedEntities';
import Overview from '../orion/Overview';
import Topics from '../orion/Topics';
import Cameras from '../orion/Cameras';
import Camera from '../orion/Camera';
import Maps from '../orion/Maps';
import Object301 from '../orion/Object301';
import Face321 from '../orion/Face321';
import Chart from '../orion/Chart';
import RulesList from '../perseo/RulesList';
import AddFirstRule from '../perseo/AddFirstRule';
import AddSecondRule from '../perseo/AddSecondRule';
import AddThirdRule from '../perseo/AddThirdRule';
import AddFourthRule from '../perseo/AddFourthRule';
// import Register from '../auth/Register';
// import Login from '../auth/Login';


// import NotFound from '../layout/NotFound';
// import PrivateRoute from '../routing/PrivateRoute';

const Routes = (props) => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/' component={Maps} />
        <Route exact path='/overview' component={Overview} />
        <Route exact path='/processedentities' component={ProcessedEntities} />
        <Route exact path='/topics' component={Topics} />
        <Route exact path='/face321' component={Face321} />
        <Route exact path='/object301' component={Object301} />
        <Route exact path='/cameras' component={Cameras} />
        <Route exact path='/camera/:id' component={Camera} />
        <Route exact path='/maps' component={Maps} />
        <Route exact path='/chart' component={Chart} />
        <Route exact path='/ruleslist' component={RulesList} />
        <Route exact path='/addfirstrule' component={AddFirstRule} />
        <Route exact path='/addsecondrule' component={AddSecondRule} />
        <Route exact path='/addthirdrule' component={AddThirdRule} />
        <Route exact path='/addfourthrule' component={AddFourthRule} />

        {/* <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route component={NotFound} /> */}
      </Switch>
    </section>
  );
};

export default Routes;
