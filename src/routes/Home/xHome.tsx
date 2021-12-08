import { Contacts } from '../../components/Contacts';
import { Companies } from '../../components/Companies';
import TopBar from '../../components/TopBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ContactsIcon from '@mui/icons-material/AccountBox';
import CompaniesIcon from '@mui/icons-material/Business';
import { useState } from 'react';
import clsx from 'clsx';
import { Box, Drawer, makeStyles } from '@material-ui/core';
import MuiDrawer from '@mui/material/Drawer';

interface TabPanelProps {
    children?: React.ReactNode;
    ident: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, ident, ...other } = props;

    return (
        <div className={clsx("contentPanel", { "hidden": value !== ident })}
            role="tabpanel"
            id={`nav-tabpanel-${ident}`}
            aria-labelledby={`nav-tab-${ident}`}
            {...other}
        >
            {children}
        </div>
    );
}

const useTheme = makeStyles((theme) => ({
    header: {
        color: theme.palette.background.default
    },
}));


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
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    variant="permanent"
                    open={true}
                    color="primary"
                    anchor="left"
                >
                    <List>
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
                </Drawer>
                <div className="content">
                    <TabPanel value={state.selected} ident="contacts">
                        <Contacts />
                    </TabPanel>
                    <TabPanel value={state.selected} ident="companies">
                        <Companies />
                    </TabPanel>
                </div>
            </Box>
        </div>
    );
}
