import React from 'react';
import {useFormik} from "formik";
import Card from "./context";
import {ThemeContext} from "./context";
import {UserContext} from "./App";

function Withdraw(){
    const {user, setUser} = React.useContext(UserContext);
    const [status, setStatus] = React.useState(false);
    const [invalid, setInvalid] = React.useState(false);
    let theme = React.useContext(ThemeContext);

    const Formik = useFormik({
        // Form values definition
        initialValues: {
            withdrawAmount: 0,
        },
        // On Submit actions
        onSubmit: () => {
            if (Object.keys(Formik.errors).length === 0) {
                if (Formik.values.withdrawAmount > user.balance){
                    setInvalid(true)
                    alert('Transaction Failed')
                } else{
                    alert('Success')
                    let temp = {...user}
                    temp.balance = user.balance - Formik.values.withdrawAmount
                    setUser(temp)
                }
                setStatus(true);
                Formik.resetForm();
            }
        },
        // Form values validation definition
        validate: values => {
            let errors = {};
            if (!values.withdrawAmount) {
                errors.withdrawAmount = 'Must define a Withdraw amount'
            }
            if (typeof(values.withdrawAmount) !== 'number'){
                errors.withdrawAmount = 'Must be a number'
            }
            if (values.withdrawAmount < 0){
                errors.withdrawAmount = 'Must be positive'
            }
            return errors;
        }
    })
    return (
        <Card
            txtcolor={theme.txtcolor}
            bgcolor={theme.bgcolor}
            header="WITHDRAW"
            status={status}
            body={(
                <form onSubmit={Formik.handleSubmit}>
                    { user &&
                        <div>BALANCE {user.balance}</div>
                    }
                    <div>WITHDRAW AMOUNT</div>
                    <input name="withdrawAmount" type="number" onChange={Formik.handleChange}
                           value={Formik.values.withdrawAmount}/>
                    <div style={{color: 'red'}}>{Formik.errors.withdrawAmount}</div>
                    <button type="submit" disabled={invalid}>WITHDRAW</button>
                </form>)}
        />
    )
}

export default Withdraw;