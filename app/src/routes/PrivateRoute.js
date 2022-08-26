import React from 'react';
import { withAuthenticationRequired  } from '@auth0/auth0-react';
import { Redirect } from '../components';

const PrivateRoute = ({ component, ...args }) => {
    args = { ...args, onRedirecting: () => <Redirect/> }
    const Component = withAuthenticationRequired(component, args);
    return <Component />;
  };

export default PrivateRoute;
