import React from 'react';

function Account({account}){
    return (
        <>
            <tr>
                <td>{account.email}</td>
                <td>{account.name}</td>
                <td>{account.password}</td>
            </tr>
        </>
    )
}

export default Account;