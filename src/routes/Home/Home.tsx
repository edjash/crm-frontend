import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ContactsIcon from '@mui/icons-material/AccountBox';
import CompaniesIcon from '@mui/icons-material/Business';
import { useState } from 'react';
import { Contacts } from '../../components/Contacts';
import { Companies } from '../../components/Companies';
import { SystemProps } from '@mui/system';
import TopBar, { navWidth } from '../../components/TopBar';


const openedMixin = (theme: Theme): CSSObject => ({
    width: navWidth,
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
        width: navWidth,
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
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


interface TabPanelProps {
    children?: React.ReactNode;
    ident: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, ident, ...other } = props;

    let sx = {
        zIndex: 2,
        paddingLeft:'10px'
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

export default function Home() {
    const theme = useTheme();
    const [state, setState] = useState({
        navOpen: true,
        selected: 'contacts'
    });

    const handleDrawerOpen = () => {
        setState({
            ...state,
            navOpen: (state.navOpen) ? false : true
        });
    };

    const onNavClick = (ident: string) => {
        console.log(ident);
        setState({
            ...state,
            selected: ident
        });
    };

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <TopBar navOpen={state.navOpen} onNavBurgerClick={handleDrawerOpen} />
            <Drawer variant="permanent" open={state.navOpen} PaperProps={{elevation:1}}>
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
