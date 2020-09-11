import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './components/routing/Routes';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Overview from './components/orion/Overview';

const App = () => {
  return (
   <Provider store={store}>
    <Router>
     <Fragment>
      <Navbar/>
      <Switch>
       <Route exact path="/" component={Overview} />
       <Route component={Routes} />
      </Switch>
     </Fragment>
    </Router>
   </Provider>
  );
}

export default App;
