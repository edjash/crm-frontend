import { Contacts } from '../../components/Contacts';
import { Companies } from '../../components/Companies';
import TopBar from '../../components/TopBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ContactsIcon from '@material-ui/icons/AccountBox';
import CompaniesIcon from '@material-ui/icons/Business';
import { useState } from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    ident: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, ident, ...other } = props;

    return (
        <div className="contentPanel"
            role="tabpanel"
            hidden={value !== ident}
            id={`nav-tabpanel-${ident}`}
            aria-labelledby={`nav-tab-${ident}`}
            {...other}
        >
            {value === ident && (
                children
            )}
        </div>
    );
}

export default function Home() {

    const [state, setState] = useState({
        selected: 'contacts'
    });

    const onNavClick = (ident: string) => {
        console.log(ident);
        setState({ selected: ident });
    };

    return (
        <div className="home">
            <TopBar />
            <div className="main">
                <List className="nav">
                    <ListItem button key="contacts"
                        onClick={() => { onNavClick('contacts'); }}
                        selected={state.selected === 'contacts'}
                    >
                        <ListItemIcon><ContactsIcon /></ListItemIcon>
                        <ListItemText primary="Contacts" />
                    </ListItem>
                    <ListItem button key="companies"
                        onClick={() => { onNavClick('companies'); }}
                        selected={state.selected === 'companies'}
                    >
                        <ListItemIcon><CompaniesIcon /></ListItemIcon>
                        <ListItemText primary="Companies" />
                    </ListItem>
                </List>
                <div className="content">
                    <TabPanel value={state.selected} ident="contacts">
                        <Contacts />
                    </TabPanel>
                    <TabPanel value={state.selected} ident="companies">
                        <Companies />
                    </TabPanel>
                </div>
            </div>
        </div>
    );
}
