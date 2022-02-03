import React from 'react';
import {ThemeContext, serverUrl} from "./context";
import {useFormik} from "formik";
import Card from './context';
import {validateEmail} from "./context";

import {signInWithRedirect, getRedirectResult, signInWithPopup, GoogleAuthProvider, getAuth} from "firebase/auth";

import {createUserWithEmailAndPassword} from "firebase/auth";

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
    return re.test(String(password))
}

function CreateAccount() {
    let [status, setStatus] = React.useState(false);
    let theme = React.useContext(ThemeContext);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: "select_account"
    });
    const auth = getAuth();
    const Formik = useFormik({
        // Form initial value definition
        initialValues: {
            name: '',
            email: '',
            password: '',
            showPassword: false,
            googleLogin: false
        },
        // On Submit button actions
        onSubmit: () => {
            if (Object.keys(Formik.errors).length === 0) {
                if (!Formik.values.googleLogin) {
                    // Get parameters from fields
                    let name = Formik.values.name;
                    let email = Formik.values.email;
                    let password = Formik.values.password;
                    // Firebase create user with email
                    createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            // Signed in
                            const user = userCredential.user;
                            let uid = user.uid
                            // Message if user created
                            alert('Firebase Account created');
                            // Create records in Mongodb
                            const url = `${serverUrl}/account/create/${name}/${email}/${password}/${uid}`;
                            (async () => {
                                var res = await fetch(url);
                                var data = await res.json();
                                if (data) {
                                    console.log('Account created in database');
                                }
                            })();
                            setStatus(true);
                            Formik.resetForm();
                        })
                        .catch((error) => {
                            console.log(`Error: ${error.code} ${error.message}`);
                        });
                } else {
                    signInWithPopup(auth, provider)
                        .then((result) => {
                            // This gives you a Google Access Token. You can use it to access the Google API.
                            const credential = GoogleAuthProvider.credentialFromResult(result);
                            const token = credential.accessToken;
                            // The signed-in user info.
                            const user = result.user;
                            alert('Firebase Account created');
                        }).catch((error) => {
                        // Handle Errors here.
                        console.log(error.message);
                        getRedirectResult(auth)
                            .then((result) => {
                                // This gives you a Google Access Token. You can use it to access Google APIs.
                                const credential = GoogleAuthProvider.credentialFromResult(result);
                                const token = credential.accessToken;

                                // The signed-in user info.
                                const user = result.user;
                            }).catch((error) => {
                            // Handle Errors here.
                            console.log(error.message);
                            // The email of the user's account used.
                            const email = error.email;
                            // The AuthCredential type that was used.
                            const credential = GoogleAuthProvider.credentialFromError(error);
                        });
                        signInWithRedirect(auth, provider);
                    });
                }
            }
        },
        // Form values validation definition
        validate: values => {
            let errors = {};
            if (!values.googleLogin) {
                if (!values.email) {
                    errors.email = 'Field required'
                } else {
                    if (!validateEmail(values.email)) {
                        errors.email = 'Username should be an email'
                    }
                }
                if (!values.password) {
                    errors.password = 'Required'
                } else {
                    if (!validatePassword(values.password)) {
                        errors.password = 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
                    }
                }
            }
            return errors;
        }
    })
    return (
        <Card
            txtcolor={theme.txtcolor}
            bgcolor={theme.bgcolor}
            header="CREATE ACCOUNT"
            status={status}
            body={(
                <form onSubmit={Formik.handleSubmit}>
                    { (Formik.values.googleLogin === false) &&
                        <div>
                            <input placeholder="Username..." id="username" name="name" type="text" onChange={Formik.handleChange} value={Formik.values.name}/>
                            <div>EMAIL</div>
                            <input name="email" type="text" onChange={Formik.handleChange} value={Formik.values.email}/>
                            <div style={{color: 'red'}}>{Formik.errors.email}</div>
                            <div>PASSWORD</div>
                            <input name="password" type={Formik.values.showPassword ? 'text' : 'password'}
                                   onChange={Formik.handleChange} value={Formik.values.password}/>
                            <input name="showPassword" type="checkbox" onChange={Formik.handleChange}/>
                            <div style={{color: 'red'}}>{Formik.errors.password}</div>
                            {
                                (status !== false && Formik.values.googleLogin === false) &&
                                <button type="submit">CREATE ANOTHER ACCOUNT</button>
                            }
                            {
                                (status === false && Formik.values.googleLogin === false) &&
                                <button type="submit">CREATE ACCOUNT</button>
                            }
                        </div>
                    }
                    <div>Login with google <input name="googleLogin" type="checkbox" onChange={Formik.handleChange}/></div>
                    {
                        (Formik.values.googleLogin !== false) &&
                        <button type="submit">GOOGLE LOGIN</button>
                    }
                </form>)}
        />
    )
}

export default CreateAccount;