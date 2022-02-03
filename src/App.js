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
import {app} from './firebase'

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
    let theme = React.useContext(ThemeContext);

    return (
        <HashRouter>
            <ThemeContext.Provider value={theme}>
                {/* Context step 5: Passing the contextValue as mentioned to Consumer child components */}
                <UserContext.Provider value={userValue}>
                    <NavBar/>
                    <div className="container">
                        <Routes>
                            <Route path="/" exact element={<CustomCard/>}/>
                            <Route path="/CreateAccount/" element={<CreateAccount/>}/>
                            <Route path="/login/" element={<Login/>}/>
                            <Route path="/alldata/" element={<AllData/>}/>
                            <Route path="/deposit/" element={<Deposit/>}/>
                            <Route path="/withdraw/" element={<Withdraw/>}/>
                        </Routes>
                    </div>
                </UserContext.Provider>
            </ThemeContext.Provider>
        </HashRouter>
    );
}

export default App;
