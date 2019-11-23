import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Navigation from './Navigation';
import Account from './Pages/Account'
import Landing from './Pages/Landing';
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import PasswordForget from './Authentication/PasswordForget';
import HomePage from './Pages/Home';
import * as ROUTES from  '../constants/routes';
import { withAuthentication } from './Session';


const App = () => (
    <Router>
        <div>
            <Navigation/>
            <Switch>
                <Route path={ROUTES.ACCOUNT} component={Account} />
                <Route exact path={ROUTES.LANDING} component={Landing} />
                <Route path={ROUTES.SIGN_UP} component={SignUp} />
                <Route path={ROUTES.SIGN_IN} component={SignIn} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                <Route path={ROUTES.HOME} component={HomePage} />
            </Switch>
        </div>
    </Router>
);

export default withAuthentication(App);