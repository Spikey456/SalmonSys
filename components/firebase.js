import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCrtAOZF_LsREEunsraF9jWthN7l1UkBf0',
  authDomain: 'maimai-89309.firebaseapp.com',
  databaseURL: 'https://maimai-89309.firebaseio.com',
  projectId: 'maimai-89309',
  storageBucket: 'maimai-89309.appspot.com',
  messagingSenderId: '650135569553',
  appId: '1:650135569553:web:8fe6972f65f21989eaeb30',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
