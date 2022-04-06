import { CSSObject, Drawer as MuiDrawer, ListItem, ListItemIcon, ListItemText, styled, SwipeableDrawer, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";

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

export const NavbarSpacer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface NavDrawerProps {
    isMobile?: boolean;
    children: React.ReactNode;
};

export default function NavDrawer(props: NavDrawerProps) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const s1 = PubSub.subscribe('NAV.TOGGLECLICK', () => {
            setOpen(!open);
        });
        return () => {
            PubSub.unsubscribe(s1);
        };
    }, [open]);

    const onClose = () => {
        console.log("Close");
    }

    const toggle = (open: boolean) => {
        setOpen(open);
        console.log("set open", open);
        // (event: React.KeyboardEvent | React.MouseEvent) => {
        //     if (
        //         event &&
        //         event.type === 'keydown' &&
        //         ((event as React.KeyboardEvent).key === 'Tab' ||
        //             (event as React.KeyboardEvent).key === 'Shift')
        //     ) {
        //         return;
        //     }
        //     console.log("set open", open);
        //     setOpen(open);
        //     if (!open) {
        //         onClose();
        //     }
        // };
    }

    if (props.isMobile) {
        return (
            <SwipeableDrawer
                anchor="left"
                open={open}
                onClose={() => toggle(false)}
                onOpen={() => toggle(true)}
                disableSwipeToOpen={true}
                disableDiscovery={true}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        textAlign: 'center',
                        padding: 3,
                        overflow: 'hidden',
                        mb: 1
                    }}
                >
                    <i>CRMdemo</i>
                </Typography>
                <div style={{ width: '80vw' }}>
                    <NavbarSpacer />
                    {props.children}
                </div>
            </SwipeableDrawer>
        );
    }
    return (
        <DesktopDrawer
            anchor="left"
            open={open}
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

interface NavItemProps {
    label: string;
    id: string;
    selected?: boolean;
    icon: JSX.Element;
    onClick: () => void;
}

export const NavItem = (props: NavItemProps) => {
    return (
        <ListItem
            button
            key={props.id}
            onClick={props.onClick}
            selected={props.selected}
        >
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText primary={props.label} />
        </ListItem>
    );
}