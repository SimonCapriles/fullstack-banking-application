import React from 'react';
import {ThemeContext, serverUrl} from './context'
import {UserContext} from "./App";
import {useFormik} from "formik";
import Card from './context';
import {validateEmail} from "./context";
import {Link} from "react-router-dom";

import {getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";

function Login() {
    let [status, setStatus] = React.useState(false);
    const {setUser} = React.useContext(UserContext);
    let theme = React.useContext(ThemeContext);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: "select_account"
    });
    const auth = getAuth();

    async function loginUser(uid){
        var res = await fetch(`${serverUrl}/account/login/${uid}`);
        var data = await res.json();
        let user_data = data[0]
        if (user_data) {
            console.log(data)
            let userValues = {
                uid: user_data.uid,
                name: user_data.name,
                balance: parseFloat(user_data.balance)
            }
            setUser(userValues);
            localStorage.setItem('userValues', JSON.stringify(userValues));
            alert(`Welcome ${user_data.name}`);
            setStatus(true);
        } else {
            alert('No data found')
        }
    }

    const Formik = useFormik({
        // Form values definition
        initialValues: {
            email: '',
            password: '',
            showPassword: false,
            googleLogin: false
        },
        // On Submit actions
        onSubmit: () => {
            if (Object.keys(Formik.errors).length === 0) {
                if (!Formik.values.googleLogin) {
                    signInWithEmailAndPassword(auth, Formik.values.email, Formik.values.password)
                        .then((userCredential) => {
                            // Signed in
                            const user = userCredential.user;
                            let uid = user.uid
                            console.log(user.email)
                            // Search for record
                            loginUser(uid);
                        })
                        .catch((error) => {
                            alert(error.message)
                        });
                } else {
                    signInWithPopup(auth, provider)
                        .then((result) => {
                            // This gives you a Google Access Token. You can use it to access the Google API.
                            // const credential = GoogleAuthProvider.credentialFromResult(result);
                            // const token = credential.accessToken;
                            // The signed-in user info.
                            const user = result.user;
                            loginUser(user.uid);
                        }).catch((error) => {
                        // Handle Errors here.
                        alert(error.message);
                    });
                }
            }
        },
        // Form values validation definition
        validate: values => {
            let errors = {};
            if (!values.googleLogin){
                if (!values.email) {
                    errors.email = 'Field required'
                } else if (!validateEmail(values.email)) {
                    errors.email = 'Username should be an email'
                }
                if (!values.password) {
                    errors.password = 'Required'
                }
            }
            return errors;
        }
    })
    return (
        <Card
            txtcolor={theme.txtcolor}
            bgcolor={theme.bgcolor}
            header={!status && "LOGIN"}
            status={status}
            body={(
                <div>
                    {!status &&
                        <form onSubmit={Formik.handleSubmit}>
                            { (Formik.values.googleLogin === false) &&
                                <div>
                                    <div>EMAIL</div>
                                    <input name="email" type="text" onChange={Formik.handleChange} value={Formik.values.email}/>
                                    <div style={{color: 'red'}}>{Formik.errors.email}</div>
                                    <div>PASSWORD</div>
                                    <input name="password" type={Formik.values.showPassword ? 'text' : 'password'}
                                           onChange={Formik.handleChange} value={Formik.values.password}/>
                                    <input name="showPassword" type="checkbox" onChange={Formik.handleChange}/>
                                    <div style={{color: 'red'}}>{Formik.errors.password}</div>
                                    <button type="submit">LOGIN</button>
                                </div>
                            }
                            <div>Login with google <input name="googleLogin" type="checkbox" onChange={Formik.handleChange}/></div>
                            {
                                (Formik.values.googleLogin !== false) &&
                                <button type="submit">GOOGLE LOGIN</button>
                            }
                        </form>
                    }
                    {status &&
                        <form>
                            <Link data-toggle="tooltip" data-placement="bottom" title="Excess money? Put it in!"
                                  to="/deposit/">
                                <button>Deposit</button>
                            </Link>
                            <Link data-toggle="tooltip" data-placement="bottom"
                                  title="Need money? Take only what you need" to="/withdraw/">
                                <button>Withdraw</button>
                            </Link>
                        </form>
                    }
                </div>
            )}
        />
    )
}

export default Login;