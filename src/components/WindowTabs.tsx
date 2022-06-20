import { Menu, MenuItem } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EVENTS } from '../app/constants';
import { windowActivated } from '../store/reducers/windowSlice';
import { useStoreSelector } from '../store/store';
import Avatar from './Avatar';

type MenuPos = {
    mouseX: number;
    mouseY: number;
} | null;

interface WindowTabsState {
    prevCount: number;
    contextMenuPos: MenuPos;
    contextMenuWindowId: string;
}

interface TabMenuProps {
    menuPos: MenuPos;
    windowId: string;
    onCloseClick: (windowId: string) => void;
}

const TabMenu = (props: TabMenuProps) => {

    const [state, setState] = useState({
        pos: props.menuPos,
        windowId: props.windowId,
    });

    useEffect(() => {
        setState(state => ({
            ...state,
            pos: props.menuPos,
            windowId: props.windowId
        }));
    }, [
        props.menuPos,
        props.windowId
    ]);

    const handleClose = () => {
        setState(state => ({
            ...state,
            pos: null,
        }));
    };

    const handleClick = () => {
        props.onCloseClick(state.windowId);
        handleClose();
    }

    return (
        <Menu
            open={state.pos !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                state.pos !== null
                    ? { top: state.pos.mouseY, left: state.pos.mouseX }
                    : undefined
            }
        >
            <MenuItem onClick={handleClick}>Close</MenuItem>
        </Menu>
    );
}

export default function WindowTabs() {

    const windows = useStoreSelector(state => state.windows);
    const dispatch = useDispatch();

    const windowIds = Object.keys(windows.list);
    const activeIndex = windowIds.indexOf(windows.active ?? '');

    const [state, setState] = useState<WindowTabsState>({
        prevCount: 0,
        contextMenuPos: null,
        contextMenuWindowId: '',
    });

    useEffect(() => {
        const newCount = windowIds.length;
        if (newCount !== state.prevCount) {
            setState(state => ({
                ...state,
                prevCount: newCount,
                activeTab: (newCount < state.prevCount) ? -1 : newCount - 1,
            }));
        }
    }, [
        windowIds,
        state.prevCount
    ]);

    const handleContextMenu = (event: React.MouseEvent, windowId: string) => {
        event.preventDefault();
        setState(state => {
            let pos = {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            };

            return {
                ...state,
                contextMenuPos: pos,
                contextMenuWindowId: windowId
            }
        });
    };

    const handleCloseClick = (windowId: string) => {
        console.log(windowId);
        PubSub.publish(EVENTS.WINDOW_CLOSE, windowId);
    }

    return (
        <div style={{ height: '100%' }}>
            <Tabs
                className="windowList"
                orientation="vertical"
                variant="scrollable"
                value={(activeIndex >= 0) ? activeIndex : false}
                sx={{ height: '100%' }}
            >
                {windowIds.map((windowId, index) => {
                    const win = windows.list[windowId];
                    const isActive = (windowId === windows.active);
                    const type = (windowId.indexOf('company_') > -1) ? 'company' : 'contact';
                    const icon = (
                        <Avatar
                            avatar={(win.image) ? `/storage/avatars/small/${win.image}` : null}
                            name={win.text}
                            className={clsx({ windowListIcon: true, activeWindow: isActive })}
                            variant={type === 'company' ? 'rounded' : 'circular'}
                            tooltipProps={{
                                title: win.text ?? '',
                                placement: 'right'
                            }}
                        />
                    );
                    return (
                        <Tab
                            onContextMenu={(event: React.MouseEvent) => {
                                handleContextMenu(event, win.windowId);
                            }}
                            icon={icon}
                            key={windowId}
                            value={index}
                            onClick={() => dispatch(windowActivated(windowId))}
                            className={clsx({ activeTab: isActive })}
                            sx={{
                                justifyContent: 'left',
                                alignItems: 'center'
                            }}
                        />
                    );
                })}
            </Tabs>
            <TabMenu
                menuPos={state.contextMenuPos}
                windowId={state.contextMenuWindowId}
                onCloseClick={handleCloseClick}
            />
        </div>
    );
}