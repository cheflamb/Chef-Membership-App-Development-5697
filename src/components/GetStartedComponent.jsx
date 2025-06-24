import React from 'react';
import {GetStarted} from '@questlabs/react-sdk';
import {useAuth} from '../context/AuthContext';
import questConfig from '../questConfig';

const GetStartedComponent = () => {
  const {user} = useAuth();

  if (!user) {
    return null;
  }

  return (
    <GetStarted
      questId={questConfig.GET_STARTED_QUESTID}
      uniqueUserId={localStorage.getItem('userId') || questConfig.USER_ID}
      accent={questConfig.PRIMARY_COLOR}
      autoHide={false}
    >
      <GetStarted.Header />
      <GetStarted.Progress />
      <GetStarted.Content />
      <GetStarted.Footer />
    </GetStarted>
  );
};

export default GetStartedComponent;