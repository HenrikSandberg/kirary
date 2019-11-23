import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Navigation from './Navigation';
import Account from './Pages/Account'
import LandingPage from './Pages/LandingPage';
import SignInPage from './Authentication/SignIn';
import SignUpPage from './Authentication/SignUp';
import PasswordForget from './Authentication/PasswordForget';
import HomePage from './Pages/HomePage';
import * as ROUTES from  '../constants/routes';
import { withAuthentication } from './Session';


const App = () => (
    <Router>
        <div>
            <Navigation/>
            <hr/>
            <Switch>
                <Route path={ROUTES.ACCOUNT} component={Account} />
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                <Route path={ROUTES.HOME} component={HomePage} />
            </Switch>
        </div>
    </Router>
);

export default withAuthentication(App);