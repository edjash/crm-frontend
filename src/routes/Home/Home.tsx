import ContactsIcon from '@mui/icons-material/AccountBox';
import CompaniesIcon from '@mui/icons-material/Business';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, Theme, useTheme } from '@mui/material/styles';
import { CSSObject, SystemProps } from '@mui/system';
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

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default function Home() {

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const margin = (isDesktop) ? 1 : 0;

    console.log("IS_DESKTOP", isDesktop);

    const [state, setState] = useState({
        navOpen: false,
        selected: 'contacts',
    });

    const onNavClick = (ident: string) => {
        setState({
            ...state,
            selected: ident
        });

        if (!isDesktop) {
            toggleNav();
        }

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

                sx={{
                    zIndex: 1,
                }}
                variant="permanent"
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
            <Box component="main" sx={{ flexGrow: 1, position: 'relative', marginLeft: margin, marginRight: margin }}>
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
