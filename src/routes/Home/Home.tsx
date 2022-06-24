import { AccountBox as ContactsIcon, Business as CompaniesIcon, Label } from '@mui/icons-material/';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    Box, Divider, List, ListItem, Theme, useMediaQuery
} from '@mui/material';
import { SystemProps } from '@mui/system';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EVENTS } from '../../app/constants';
import Companies from '../../components/Companies/Companies';
import { Contacts } from '../../components/Contacts';
import ContextMenu, { bindContextMenu, useContextMenuHandler } from '../../components/ContextMenu';
import SessionExpiredDialog from '../../components/Dialogs/SessionExpiredDialog';
import TopBar from '../../components/TopBar';
import WindowTabs from '../../components/WindowTabs';
import { logout } from '../../store/reducers/auth/authSlice';
import { useStoreSelector } from '../../store/store';
import NavDrawer, { NavbarSpacer, NavItem } from './Nav';

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
        display: 'grid',
        flexGrow: 1,
        height: '100%',
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


export default function Home() {
    const dispatch = useDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const margin = (isMobile) ? 0 : 1;
    const contextMenuHandler = useContextMenuHandler();
    const windows = useStoreSelector(state => state.windows);
    const [selected, setSelected] = useState<string>('contacts');

    const onNavClick = (ident: string) => {
        if (ident === 'logout') {
            return dispatch(logout());
        }
        if (isMobile) {
            PubSub.publishSync('NAV.TOGGLECLICK');
        }
        setSelected(ident);
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <NavDrawer isMobile={isMobile}>
                {!isMobile &&
                    <NavbarSpacer />
                }
                <List
                    sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
                    {...bindContextMenu(contextMenuHandler)}
                >
                    <NavItem
                        id="contacts"
                        label="Contacts"
                        selected={selected === 'contacts'}
                        icon={<ContactsIcon />}
                        onClick={() => onNavClick('contacts')}
                    />
                    <NavItem
                        id="companies"
                        label="Companies"
                        selected={selected === 'companies'}
                        icon={<CompaniesIcon />}
                        onClick={() => onNavClick('companies')}
                    />
                    <Divider sx={{ mt: 5, mb: 2 }} hidden={!isMobile} />
                    {!isMobile &&
                        <WindowTabs />
                    }
                    <ListItem
                        sx={{ flexGrow: 1 }}
                    />
                    <NavItem
                        id="logout"
                        label="Logout"
                        icon={<LogoutIcon />}
                        onClick={() => onNavClick('logout')}
                    />
                    <ContextMenu
                        contextMenuHandler={contextMenuHandler}
                        onItemClick={() => {
                            for (const windowId in windows.list) {
                                PubSub.publish(EVENTS.WINDOW_CLOSE, windowId);
                            }
                        }}
                        items={[
                            {
                                label: "Close all Windows",
                                key: 'closeall',
                                disabled: !(Object.keys(windows.list).length)
                            }
                        ]}
                    />
                </List>
            </NavDrawer>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TopBar />
                <NavbarSpacer />
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
                    <TabPanel value={selected} ident="contacts">
                        <Contacts />
                    </TabPanel>
                    <TabPanel value={selected} ident="companies">
                        <Companies />
                    </TabPanel>
                </Box>
            </Box>
            <SessionExpiredDialog />
        </Box>
    );
}
