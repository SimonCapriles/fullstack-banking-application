import React from 'react';
import {Routes, Route, HashRouter} from "react-router-dom";
import {ThemeContext} from "./context";
import NavBar from "./navbar";
import CustomCard from './home';
import CreateAccount from './createaccount';
import Login from './login';
import Deposit from './deposit';
import Withdraw from './withdraw';
import AllData from './alldata';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAGg1PRC7qy-jUDSafB8e1IbzXVKFZiorU",
    authDomain: "courso-1213c.firebaseapp.com",
    databaseURL: "https://courso-1213c-default-rtdb.firebaseio.com",
    projectId: "courso-1213c",
    storageBucket: "courso-1213c.appspot.com",
    messagingSenderId: "668320405478",
    appId: "1:668320405478:web:6879c0d746bcb894e4e827"
}

firebase.initializeApp(firebaseConfig)

// Context step 3: Create Context with default values
export const UserContext = React.createContext({
    name: null,
    mail: null,
    balance: 0,
    setUser: () => {
    }
});

// Context step 1: Create Parent Component
function App() {
    // Context step 2:Using the useSate to track changes on the user
    const [user, setUser] = React.useState(null)
    // Context step 4: Creating contextValue variable to pass with the Context.Provider
    const userValue = {user, setUser}
    // Check if there is user data in localStorage and set user
    if (!user && localStorage.getItem('userValues')) {
        userValue.user = localStorage.getItem('userValues') ? JSON.parse(localStorage.getItem('userValues')) : null;
    }
    let theme = React.useContext(ThemeContext);

    return (
        <HashRouter>
            <ThemeContext.Provider value={theme}>
                {/* Context step 5: Passing the contextValue as mentioned to Consumer child components */}
                <UserContext.Provider value={userValue}>
                    <NavBar firebase={firebase}/>
                    <div className="container">
                        <Routes>
                            <Route path="/" exact element={<CustomCard/>}/>
                            <Route path="/CreateAccount/" element={<CreateAccount/>}/>
                            <Route path="/login/" element={<Login firebase={firebase}/>}/>
                            <Route path="/deposit/" element={<Deposit/>}/>
                            <Route path="/withdraw/" element={<Withdraw/>}/>
                            <Route path="/alldata/" element={<AllData firebase={firebase}/>}/>
                        </Routes>
                    </div>
                </UserContext.Provider>
            </ThemeContext.Provider>
        </HashRouter>
    );
}

export default App;
