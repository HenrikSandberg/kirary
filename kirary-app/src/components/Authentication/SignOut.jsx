import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignOutButton = (props) => {
  const onClick = event => {
    props.firebase
      .doSignOut()
      .then(() => {
        props.history.push(ROUTES.LANDING);
      })
    event.preventDefault();
  };
  
  return (
    <button type="button" onClick={onClick}>
      Sign Out
    </button>
  );
}

const signOut = compose( withRouter, withFirebase,)(SignOutButton)
export default signOut;