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
        console.log(uid);
        (async () => {
            var res = await fetch(`${serverUrl}/account/delete/${uid}`);
            var data = await res.json();
            if (data) {
                alert('User removed')
                setData(JSON.stringify(data));
            } else {
                alert('No data found')
            }
        })();
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