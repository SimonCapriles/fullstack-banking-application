import React, {useEffect} from 'react';
import Account from './account';
import {serverUrl} from "./context";

function AllData({firebase}){
    const [data, setData] = React.useState('');
    let users = null
    useEffect(()=>{
        if (firebase.auth().currentUser) {
            firebase.auth().currentUser.getIdToken()
                .then(idToken => {
                    fetch(`${serverUrl}/account/all`, {
                        method: 'GET',
                        headers: {
                            'Authorization': idToken
                        }
                    })
                        .then(response => response.json())
                        .then(data => {setData(JSON.stringify(data));})
                })
        }

    })
    if (data) {
        users = JSON.parse(data)
    }

    const removeUser = uid => {
        if (firebase.auth().currentUser) {
            firebase.auth().currentUser.getIdToken()
                .then(idToken => {
                    fetch(`${serverUrl}/account/delete/${uid}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': idToken
                        }
                    })
                        .then(response => response.json())
                        .then(data => {setData(JSON.stringify(data));})
                })
        }
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Password</th>
                </tr>
            </thead>
            { users &&
            <tbody>
                {users.map((account, i) => (
                    <Account key={i} index={i} account={account} remove={removeUser}/>
                ))}
            </tbody>
            }

        </table>
    )
}

export default AllData;