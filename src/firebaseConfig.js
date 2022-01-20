import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAGg1PRC7qy-jUDSafB8e1IbzXVKFZiorU",
    authDomain: "courso-1213c.firebaseapp.com",
    databaseURL: "https://courso-1213c-default-rtdb.firebaseio.com",
    projectId: "courso-1213c",
    storageBucket: "courso-1213c.appspot.com",
    messagingSenderId: "668320405478",
    appId: "1:668320405478:web:6879c0d746bcb894e4e827"
}

const app = initializeApp(firebaseConfig);

export {app}