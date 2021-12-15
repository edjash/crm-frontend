import ContactsIcon from '@mui/icons-material/AccountBox';
import CompaniesIcon from '@mui/icons-material/Business';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { SystemProps } from '@mui/system';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { Companies } from '../../components/Companies';
import { Contacts } from '../../components/Contacts';
import TopBar from '../../components/TopBar';

interface TabPanelProps {
    children?: React.ReactNode;
    ident: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, ident, ...other } = props;

    let sx = {
        zIndex: 2,
        paddingLeft: '10px',
        paddingRight: '10px'
    } as SystemProps;

    if (value !== ident) {
        sx = {
            position: 'absolute',
            top: 0,
            left: -9000,
            zIndex: 1,
            visibility: 'hidden'
        } as SystemProps;
    }

    return (
        <Box
            sx={{ ...sx }}
            role="tabpanel"
            id={`nav-tabpanel-${ident}`}
            aria-labelledby={`nav-tab-${ident}`}
            {...other}
        >
            {children}
        </Box>
    );
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default function Home() {

    const [state, setState] = useState({
        navOpen: true,
        selected: 'contacts'
    });

    const onNavClick = (ident: string) => {
        setState({
            ...state,
            selected: ident
        });

        PubSub.publish('NAV.ITEMCLICK', { ident: ident });
    };

    const toggleNav = () => {
        setState((state) => {
            return {
                ...state,
                navOpen: !state.navOpen
            };
        });
    };

    const closeNav = () => {
        setState({
            ...state,
            navOpen: false,
        });
    }

    useEffect(() => {
        PubSub.subscribe('NAV.BURGERCLICK', toggleNav);
        return () => {
            PubSub.unsubscribe('NAV.BURGERCLICK');
        }
    }, []);


    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <TopBar />
            <Drawer
                open={state.navOpen}
                anchor="left"
                PaperProps={{ elevation: 1 }}
                onClose={closeNav}
                sx={{ zIndex: 1 }}
                variant="temporary"
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <DrawerHeader />
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
            <Box component="main" sx={{ flexGrow: 1, position: 'relative', }}>
                <DrawerHeader />
                <TabPanel value={state.selected} ident="contacts">
                    <Contacts />
                </TabPanel>
                <TabPanel value={state.selected} ident="companies">
                    <Companies />
                </TabPanel>
            </Box>
        </Box>
    );
}
