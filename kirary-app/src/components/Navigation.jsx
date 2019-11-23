import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from './Authentication/SignOut';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from './Session';

import logo from '../resources/images/logo.png';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <nav class="navigation">
    <ul class="menu">
      <li>
        <Link to={ROUTES.LANDING}>
          <img src={logo} className='brand-logo'/>
        </Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li class='sign-out'>
        <SignOutButton />
      </li>
    </ul>
  </nav>
);

const NavigationNonAuth = () => (
  <nav class="navigation">
    <ul class="menu">
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;