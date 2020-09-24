import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProcessedEntities from '../orion/ProcessedEntities';
import Overview from '../orion/Overview';
import Topics from '../orion/Topics';
import Cameras from '../orion/Cameras';
import Camera from '../orion/Camera';
import Maps from '../orion/Maps';
import Object301 from '../orion/Object301';
import Face321 from '../orion/Face321';
// import Register from '../auth/Register';
// import Login from '../auth/Login';
// import Alert from '../layout/Alert';
// import Dashboard from '../dashboard/Dashboard';
// import ProfileForm from '../profile-forms/ProfileForm';
// import AddExperience from '../profile-forms/AddExperience';
// import AddEducation from '../profile-forms/AddEducation';
// import Profiles from '../profiles/Profiles';
// import Profile from '../profile/Profile';
// import Posts from '../posts/Posts';
// import Post from '../post/Post';
// // import Markani from '../profile/Markani';
// import NotFound from '../layout/NotFound';
// import PrivateRoute from '../routing/PrivateRoute';

const Routes = props => {
  return (
    <section className="container">
      {/* <Alert /> */}
      <Switch>
      <Route exact path="/processedentities" component={ProcessedEntities} />
      <Route exact path="/overview" component={Overview} />
      <Route exact path="/topics" component={Topics} />
      <Route exact path="/face321" component={Face321} />
      <Route exact path="/object301" component={Object301} />
      <Route exact path="/cameras" component={Cameras} />
      <Route exact path="/camera/:id" component={Camera} />
      <Route exact path="/maps" component={Maps} />
      
        {/* <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:id" component={Profile} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={ProfileForm} />
        <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
        <PrivateRoute exact path="/add-experience" component={AddExperience} />
        <PrivateRoute exact path="/add-education" component={AddEducation} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <PrivateRoute exact path="/markani" component={Markani} />
        <Route component={NotFound} /> */}
      </Switch>
    </section>
  );
};

export default Routes;