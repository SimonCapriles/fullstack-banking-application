import React from 'react';
import Card, {ThemeContext} from './context';
import bankImage from './bank.png';

function CustomCard() {
    let theme = React.useContext(ThemeContext)
    return (
        <Card
            txtcolor={theme.txtcolor}
            bgcolor={theme.bgcolor}
            header="BadBank Landing Module"
            title="Welcome to the bank"
            text="You can move around using the navigation bar."
            body={(<img src={bankImage} className="img-fluid" alt="Bank Application"/>)}
        />
    )
}

export default CustomCard;