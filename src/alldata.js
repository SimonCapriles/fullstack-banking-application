import React, {useEffect} from 'react';
import Account from './account';
import {serverUrl} from "./context";

function AllData(){
    const [data, setData] = React.useState('');
    let users = null
    useEffect(()=>{
        fetch(`${serverUrl}/account/all`)
            .then(response => response.json())
            .then(data => {setData(JSON.stringify(data));})
    })
    if (data) {
        users = JSON.parse(data)
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
                    <Account key={i} index={i} account={account}/>
                ))}
            </tbody>
            }

        </table>
    )
}

export default AllData;