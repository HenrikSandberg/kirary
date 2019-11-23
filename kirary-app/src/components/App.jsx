import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Navigation from './Navigation';
import LandingPage from './LandingPage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import PasswordForgetPage from './PasswordForgetPage';
import HomePage from './HomePage';
import * as ROUTES from  '../constants/routes';


const App = () => (
    <Router>
        <div>
            <Navigation/>
            <hr/>
            <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Route path={ROUTES.HOME} component={HomePage} />
            </Switch>
        </div>
    </Router>
);

export default App;