import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Navigation from './Navigation';
import LandingPage from './LandingPage';
import SignInPage from './SignIn';
import SignUpPage from './SignUp';
import PasswordForgetPage from './PasswordForgetPage';
import HomePage from './HomePage';
import * as ROUTES from  '../constants/routes';
import { withFirebase } from './Firebase';


class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
        };
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
        });
    }

    componentWillUnmount() {
        this.listener();
    }
    
    render(){
        return(
            <Router>
                <div>
                    <Navigation authUser={this.state.authUser} />
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
    }
}

export default withFirebase(App);