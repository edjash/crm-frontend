import { Contacts } from '../../components/Contacts';
import TopBar from '../../components/TopBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ContactsIcon from '@material-ui/icons/AccountBox';
import CompaniesIcon from '@material-ui/icons/Business';

export default function Home() {

    return (
        <div className="home">
            <TopBar />
            <div className="main">
                <List className="nav">
                    <ListItem button key="contacts" selected>
                        <ListItemIcon><ContactsIcon /></ListItemIcon>
                        <ListItemText primary="Contacts" />
                    </ListItem>
                    <ListItem button key="accounts">
                        <ListItemIcon><CompaniesIcon /></ListItemIcon>
                        <ListItemText primary="Companies" />
                    </ListItem>
                </List>
                <div className="content">
                    <Contacts />
                </div>
            </div>
        </div>
    );
}
