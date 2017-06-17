import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// ve a https://console.firebase.google.com/ y agrega un proyecto
firebase.initializeApp({
    apiKey: "your_firebase_apiKey",
    authDomain: "your_firebase_authDomain",
    databaseURL: "your_firebase_databaseURL",
    projectId: "your_firebase_projectId",
    storageBucket: "your_firebase_storageBucket",
    messagingSenderId: "your_firebase_messagingSenderId"
  });

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
registerServiceWorker();
