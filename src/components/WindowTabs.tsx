import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { windowActivated } from '../store/reducers/windowSlice';
import { useStoreSelector } from '../store/store';
import Avatar from './Avatar';

interface WindowTabsState {
    prevCount: number;
}

export default function WindowTabs() {

    const windows = useStoreSelector(state => state.windows);
    const dispatch = useDispatch();

    const windowIds = Object.keys(windows.list);
    const activeIndex = windowIds.indexOf(windows.active ?? '');

    const [state, setState] = useState<WindowTabsState>({
        prevCount: 0,
    });

    useEffect(() => {
        const newCount = windowIds.length;
        if (newCount != state.prevCount) {
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

    return (
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
                        variant={type == 'company' ? 'rounded' : 'circular'}
                    />
                );
                return (
                    <Tab
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
    );
}