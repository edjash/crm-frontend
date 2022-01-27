import { IconButton, Menu, MenuItem } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import React, { ReactNode, Children, cloneElement, isValidElement, useState, ChangeEvent, ChangeEventHandler } from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import PromptDialog from "./PromptDialog";
import { useModal } from "mui-modal-provider";
import { validateDateTime } from "@mui/lab/internal/pickers/date-time-utils";


type EnrichedChildren = {
    name: string;
    children?: React.ReactNode,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    defaultValue: string
};

type FieldValues = {
    [index: string]: string;
};


const enrichElements = (
    children: React.ReactNode,
    baseName: string,
    values: FieldValues,
    changeHandler: (e: ChangeEvent<HTMLInputElement>) => void): any => {

    const arrayChildren = Children.toArray(children);

    return Children.map(arrayChildren, (child) => {
        if (!isValidElement<EnrichedChildren>(child)) {
            return child
        }

        let elementChild: React.ReactElement<EnrichedChildren> = child;

        if (child.props.children) {
            elementChild = cloneElement<EnrichedChildren>(elementChild, {
                children: enrichElements(elementChild.props.children, baseName, values, changeHandler),
            })
        }

        const name: string = `${baseName}_${elementChild.props.name}`;
        const value = values?.[name] ?? '';

        return cloneElement(elementChild, {
            name: name,
            defaultValue: value,
        });

    });
}

type MultiFieldsetProps = {
    baseName: string,
    children: React.ReactNode;
    legend: string;
    defaultFieldLabel: string;
    activeTab?: number;
};

type MultiFieldsetState = {
    menuAnchorEl: null | HTMLElement;
    count: number;
    activeTab: number;
    labels: string[];
    values: FieldValues;
};

type TabPanelProps = {
    value: string;
    children?: ReactNode;
    active: boolean;
};

export function TabPanel(props: TabPanelProps) {

    return (
        <div
            role="tabpanel"
            hidden={!props.active}
        >
            {props.children}
        </div>
    );
}

export default function MultiFieldset(props: MultiFieldsetProps) {

    const [state, setState] = useState<MultiFieldsetState>({
        menuAnchorEl: null,
        count: 1,
        activeTab: props?.activeTab ?? 0,
        labels: [
            props.defaultFieldLabel
        ],
        values: {}
    });

    const { showModal } = useModal();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {

        // const values = {
        //     ...state.values,
        //     [e.target.name]: e.target.value
        // };

        // setState((state) => {
        //     return {
        //         ...state,
        //         values: values
        //     };
        // });
    };

    const TabPanels: ReactNode[] = [],
        TabLabels: ReactNode[] = [],
        labels = [...state.labels],
        newLabels: string[] = [];

    let other = 0;

    for (let i = 0; i < state.count; i++) {
        const groupPrefix = `${[props.baseName]}_${i}`;
        const tabValue = `${i}`;
        const active = (state.activeTab === i);

        TabPanels.push(
            <TabPanel value={tabValue} active={active} key={tabValue}>
                {enrichElements(props.children, groupPrefix, state.values, onChange)}
            </TabPanel>
        );

        let label = '';
        if (labels.length > 0) {
            label = labels.shift()!;
        } else {
            other++;
            label = (other < 2) ? `Additional` : `Additional #${other}`;
        }


        TabLabels.push(<Tab label={label} value={tabValue} key={tabValue} />);
        newLabels.push(label);
    }

    const onAddClick = () => {
        setState((state) => {

            return {
                ...state,
                count: state.count + 1,
                activeTab: state.count
            }
        });
    };

    const onMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setState((state) => {
            return {
                ...state,
                menuAnchorEl: event.currentTarget
            }
        });
    };

    const onMenuItemClick = (event: React.MouseEvent<HTMLLIElement>, key: string) => {
        switch (key) {
            case 'edit':
                const confirm = showModal(PromptDialog, {
                    title: 'Enter a label',
                    onCancel: () => {
                        confirm.hide();
                    },
                    inputValue: newLabels[state.activeTab],
                    onConfirm: (value: string) => {
                        confirm.hide();
                        if (value.length) {
                            newLabels[state.activeTab] = value;
                            setState((state) => {
                                return {
                                    ...state,
                                    labels: newLabels
                                };
                            });
                        }
                    }
                });
                break;
            case 'delete':
                break;
        }
        setState((state) => {
            return {
                ...state,
                menuAnchorEl: null
            }
        });
    }

    const onMenuClose = () => {
        setState((state) => {
            return {
                ...state,
                menuAnchorEl: null
            }
        });
    }

    const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setState({
            ...state,
            activeTab: parseInt(newValue)
        });
    };

    return (
        <fieldset style={{ borderRadius: '6px' }}>
            <legend className=""><span>{props.legend}</span></legend>
            <TabContext value={`${state.activeTab}`}>
                <Box sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    width: {
                        md: 385
                    }
                }}>
                    <TabList
                        onChange={onTabChange}
                        variant="scrollable"
                        scrollButtons={true}
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        {TabLabels}
                    </TabList>
                    <IconButton size="small" sx={{ alignSelf: 'center' }} onClick={onAddClick}>
                        <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ alignSelf: 'center' }} onClick={onMenuClick}>
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                        open={Boolean(state.menuAnchorEl)}
                        anchorEl={state.menuAnchorEl}
                        onClose={onMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem key="edit" onClick={(event) => onMenuItemClick(event, "edit")}>
                            Edit Label
                        </MenuItem>
                        <MenuItem key="delete" onClick={(event) => onMenuItemClick(event, "delete")}>
                            Delete Entry
                        </MenuItem>
                    </Menu>
                </Box>
                {TabPanels}
            </TabContext>
        </fieldset>
    );
}
