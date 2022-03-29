import { AccountBox as ContactsIcon, Business as CompaniesIcon } from '@mui/icons-material/';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    Box, Divider, Drawer as MuiDrawer, List,
    ListItem,
    ListItemIcon,
    ListItemText, styled, Theme, Typography,
    useMediaQuery
} from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { CSSObject, SystemProps } from '@mui/system';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import Companies from '../../components/Companies/Companies';
import { Contacts } from '../../components/Contacts';
import SessionExpiredDialog from '../../components/Dialogs/SessionExpiredDialog';
import Footer from '../../components/Footer';
import TopBar from '../../components/TopBar';

interface TabPanelProps {
    children?: React.ReactNode;
    ident: any;
    value: any;
    sx?: Record<string, any>
}

function TabPanel(props: TabPanelProps) {
    const { children, value, ident, sx, ...other } = props;

    let styles = {
        zIndex: 2,
        ...sx,
    } as SystemProps;

    if (value !== ident) {
        styles = {
            position: 'absolute',
            top: 0,
            left: -9000,
            zIndex: 1,
            height: '100%'
        } as SystemProps;
    }

    return (
        <Box
            sx={{ ...styles }}
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

const openNavAnimation = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closeNavAnimation = (theme: Theme): CSSObject => ({
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

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openNavAnimation(theme),
            '& .MuiDrawer-paper': openNavAnimation(theme),
        }),
        ...(!open && {
            ...closeNavAnimation(theme),
            '& .MuiDrawer-paper': closeNavAnimation(theme),
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

interface DrawerProps {
    open: boolean;
    isMobile?: boolean;
    children: React.ReactNode;
    onClose: () => void;
};

const MobileDrawer = (props: DrawerProps) => {

    const [open, setOpen] = useState(props.open);

    useEffect(() => {
        const token = PubSub.subscribe('NAV.TOGGLE', (msg, data) => {
            setOpen(!open);
        });
        return () => {
            PubSub.unsubscribe(token);
        }
    }, [open]);

    const toggle = (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event &&
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setOpen(open);
            if (!open && props.onClose) {
                props.onClose();
            }
        };

    return (
        <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={toggle(false)}
            onOpen={toggle(true)}
            disableSwipeToOpen={true}
            disableDiscovery={true}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <Typography variant="subtitle2" sx={{
                textAlign: 'center',
                padding: 3,
                overflow: 'hidden',
                mb: 1
            }}>
                <i>CRMdemo</i>
            </Typography>
            <div style={{ width: '80vw' }}>
                {props.children}
            </div>
        </SwipeableDrawer>
    );
}

const Drawer = (props: DrawerProps) => {
    if (props.isMobile) {
        return (
            <MobileDrawer open={props.open} onClose={props.onClose}>
                {props.children}
            </MobileDrawer>
        );
    }
    return (
        <DesktopDrawer
            anchor="left"
            open={props.open}
            PaperProps={{ elevation: 1 }}
            sx={{ zIndex: 1 }}
            variant="permanent"
            ModalProps={{
                keepMounted: true,
            }}
        >
            {props.children}
        </DesktopDrawer>
    );
};

export default function Home() {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const margin = (isMobile) ? 0 : 1;

    const [state, setState] = useState({
        navOpen: false,
        selected: 'contacts',
        canPullRefresh: isMobile,
    });

    const onNavClick = (ident: string) => {

        setState({
            ...state,
            selected: ident
        });

        if (isMobile) {
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
        const navToken = PubSub.subscribe('NAV.TOGGLE', toggleNav);
        return () => {
            PubSub.unsubscribe(navToken);
        }
    }, []);

    const onNavToggleClick = () => {
        PubSub.publishSync('NAV.TOGGLE');
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Drawer isMobile={isMobile} onClose={closeNav} open={state.navOpen}>
                {!isMobile &&
                    <DrawerHeader />
                }
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
                    <Divider sx={{ mt: 5, mb: 2 }} hidden={!isMobile} />
                    {isMobile &&
                        <ListItem button key="logout"
                            onClick={() => { PubSub.publish('AUTH.LOGOUT'); }}
                        >
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    }
                    {/* <ListItem disabled button key="companies"
                        onClick={() => { onNavClick('companies'); }}
                        selected={state.selected === 'companies'}
                    >
                        <ListItemIcon><CompaniesIcon /></ListItemIcon>
                        <ListItemText primary="Companies" />
                    </ListItem> */}
                </List>
            </Drawer>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TopBar sx={{ flexGrow: 0 }} onNavToggleClick={onNavToggleClick} />
                <DrawerHeader />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        position: 'relative',
                        marginLeft: margin,
                        marginRight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <TabPanel value={state.selected} ident="contacts" sx={{ display: 'grid', flexGrow: 1, height: '100%' }}>
                        <Contacts />
                    </TabPanel>
                    <TabPanel value={state.selected} ident="companies" sx={{ display: 'grid', flexGrow: 1, height: '100%' }}>
                        <Companies />
                    </TabPanel>
                    <Footer />
                </Box>
            </Box>
            <SessionExpiredDialog />
        </Box>
    );
}
