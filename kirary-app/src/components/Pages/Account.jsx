import React from 'react';
import { PasswordForgetForm } from '../Authentication/PasswordForget';
import PasswordChangeForm from '../Authentication/PasswordChange';

const AccountPage = () => (
  <div>
    <h1>Account Page</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
);
export default AccountPage;