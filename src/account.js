import React from 'react';

function Account({account, remove}){
    return (
        <>
            <tr>
                <td>{account.email}</td>
                <td>{account.name}</td>
                <td>{account.password}</td>
                <td><button className="btn-danger" onClick={function(){remove(account.uid)}}>Delete</button></td>
            </tr>

        </>
    )
}

export default Account;