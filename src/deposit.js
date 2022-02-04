import React from 'react';
import {useFormik} from "formik";
import Card from './context';
import {ThemeContext, serverUrl} from "./context";
import {UserContext} from "./App";
import {updateBalance} from "./context";

function Deposit() {
    const {user, setUser} = React.useContext(UserContext);
    let [status, setStatus] = React.useState(false);
    let theme = React.useContext(ThemeContext);

    const Formik = useFormik({
        // Form values definition
        initialValues: {
            depositAmount: 0,
        },
        // On Submit actions
        onSubmit: () => {
            if (Object.keys(Formik.errors).length === 0) {
                let uid = user.uid;
                let balance = Formik.values.depositAmount;
                // Make deposit on db
                const url = `${serverUrl}/account/deposit/${uid}/${balance}`;
                (async () => {
                    var res = await fetch(url);
                    var data = await res.json();
                    if (data) {
                        updateBalance(uid).then((result)=>{
                            if (result) {
                                let temp = {...user};
                                temp.balance = result;
                                setUser(temp);
                                localStorage.setItem('userValues', JSON.stringify(temp));
                                setStatus(true);
                                alert('Deposit successful');
                            }
                        })
                    } else {
                        alert('No data found')
                    }
                })();
                setStatus(true);
                Formik.resetForm();
            }
        },
        // Form values validation definition
        validate: values => {
            let errors = {};
            if (!values.depositAmount) {
                errors.depositAmount = 'Must define a Deposit amount'
            }
            if (typeof(values.depositAmount) !== 'number'){
                errors.depositAmount = 'Must be a number'
            }
            if (values.depositAmount < 0){
                errors.depositAmount = 'Must be positive'
            }
            return errors;
        }
    })
    return (
        <Card
            txtcolor={theme.txtcolor}
            bgcolor={theme.bgcolor}
            header="DEPOSIT"
            status={status}
            body={(
                <form onSubmit={Formik.handleSubmit}>
                    { user &&
                        <div>BALANCE {user.balance}</div>
                    }
                    { status &&
                        <div>MAKE ANOTHER DEPOSIT</div>
                    }
                    { !status &&
                        <div>DEPOSIT AMOUNT</div>
                    }
                    <input name="depositAmount" type="number" onChange={Formik.handleChange}
                           value={Formik.values.depositAmount}/>
                    <div style={{color: 'red'}}>{Formik.errors.depositAmount}</div>
                    <button type="submit">DEPOSIT</button>
                </form>)}
        />
    )
}

export default Deposit;