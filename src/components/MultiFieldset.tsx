import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import { useModal } from "mui-modal-provider";
import React, { ChangeEvent, Children, cloneElement, isValidElement, ReactNode, ReactElement, useState } from "react";
import PromptDialog from "./PromptDialog";
import ConfirmDialog from "./ConfirmDialog";
import { uniqueId } from 'lodash';

interface MultiFieldsetProps {
    baseName: string,
    children: ReactNode;
    legend: string;
    defaultTabLabel: string;
    activeTab?: number;
    errors?: Record<string, string>;
    defaultValues?: Record<string, string>[];
    propsCallback?: (fieldName: string, index: number) => Record<string, any>,
};

interface MultiFieldsetState {
    menuAnchorEl: null | HTMLElement;
    activeTab: number;
    values: Record<string, string>[];
    deletedIds: number[];
};

interface TabPanelProps {
    children?: ReactNode;
    active: boolean;
};

interface ClonedChild {
    name: string;
    children?: ReactNode,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    defaultValue: string | object,
    error: boolean,
    helperText: string,
};

const cloneChildren = (
    children: ReactNode,
    propsCallback: (fieldName: string) => Record<string, any>,
) => {

    const arrayChildren = Children.toArray(children);
    return Children.map(arrayChildren, (child) => {
        if (!isValidElement<ClonedChild>(child)) {
            return child;
        }

        let inputElement: ReactElement<ClonedChild> = child;
        if (child.props.children) {
            inputElement = cloneElement<ClonedChild>(inputElement, {
                children: cloneChildren(inputElement.props.children, propsCallback),
            })
        }
        const childProps = propsCallback(inputElement.props.name);
        return cloneElement(inputElement, childProps);
    });
}

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

    const [state, setState] = useState<MultiFieldsetState>(() => {
        const tabValues = props?.defaultValues ?? [];
        if (!tabValues.length) {
            tabValues.push({});
        }
        tabValues.forEach((values, index) => {
            if (!values.label) {
                values.label = (!index) ? props.defaultTabLabel : 'Other';
            }
            values.key = values?.id || uniqueId(`new_${props.baseName}_`);
            return values;
        });

        console.log(props.baseName, tabValues);

        const initialState = {
            menuAnchorEl: null,
            activeTab: props?.activeTab ?? 0,
            values: tabValues,
            deletedIds: [],
        };
        return initialState;
    });

    const { showModal } = useModal();

    const onMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setState((state) => ({
            ...state,
            menuAnchorEl: event.currentTarget
        }));
    };

    const onMenuItemClick = (event: React.MouseEvent<HTMLLIElement>, key: string) => {
        switch (key) {
            case 'edit':
                const values = [...state.values];

                const confirm = showModal(PromptDialog, {
                    title: 'Enter a label',
                    onCancel: () => {
                        confirm.hide();
                    },
                    inputValue: values[state.activeTab].label,
                    onConfirm: (value: string) => {
                        confirm.hide();
                        if (value.length) {
                            values[state.activeTab].label = value;
                            setState((state) => ({
                                ...state,
                                values: values,
                            }));
                        }
                    }
                });
                break;
            case 'delete':
                break;
        }
        setState((state) => ({
            ...state,
            menuAnchorEl: null
        }));
    }

    const onMenuClose = () => {
        setState((state) => ({
            ...state,
            menuAnchorEl: null
        }));
    }

    const onTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setState(state => ({
            ...state,
            activeTab: newValue,
        }));
    };

    const onAddClick = () => {
        const values = [...state.values];
        values.push({
            label: 'Other',
        });

        setState((prevState) => ({
            ...prevState,
            values: values,
            activeTab: values.length - 1,
        }));
    };

    const onDeleteClick = () => {
        const label = state.values[state.activeTab].label;

        const confirm = showModal(ConfirmDialog, {
            title: 'Confirm Delete',
            content: `The entry '${label}' will be deleted`,
            onCancel: () => {
                confirm.hide();
            },
            onConfirm: () => {
                confirm.hide();
                let newValues: Record<string, string>[] = [];
                let deletedId;

                state.values.forEach((value, index) => {
                    if (index != state.activeTab) {
                        newValues.push(value);
                    } else {
                        if (value?.id) {
                            deletedId = value.id;
                        }
                    }
                });

                if (newValues.length == 0) {
                    let value = state.values[0];
                    for (let k in value) {
                        if (k != 'label') {
                            value[k] = '';
                        }
                    }
                    newValues.push(value);
                }

                let deletedIds = [...state.deletedIds];
                if (deletedId) {
                    deletedIds.push(deletedId);
                }

                setState((state) => ({
                    ...state,
                    values: newValues,
                    deletedIds: deletedIds,
                    activeTab: 0
                }));
            }
        });

        setState((state) => ({
            ...state,
            menuAnchorEl: null
        }));
    }

    return (
        <fieldset style={{ borderRadius: '6px' }}>
            <legend className="" style={{ lineHeight: '1em' }}><span>{props.legend}</span></legend>
            <Box sx={{
                width: {
                    md: 320
                }
            }}>
                <Box sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Tabs
                        onChange={onTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            flexGrow: 1,
                            width: {

                            }
                        }}
                        value={state.activeTab}
                    >
                        {state.values.map((values, index) => (
                            <Tab label={values?.label ?? ':-('} value={index} key={index} />
                        ))}
                    </Tabs>
                    <Box sx={{ flexShrink: 0 }}>
                        <IconButton size="small" sx={{ alignSelf: 'center' }} onClick={onAddClick}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ alignSelf: 'center' }} onClick={onMenuClick}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <Menu
                            open={state.menuAnchorEl != null}
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
                            <MenuItem key="delete" onClick={onDeleteClick}>
                                Delete Entry
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
                {state.values.map((values, index) => (
                    <TabPanel active={state.activeTab == index} key={index}>
                        {cloneChildren(props.children, (fieldName) => {
                            const name: string = `${props.baseName}[${index}][${fieldName}]`;
                            const value: string | object = values?.[fieldName] ?? '';
                            return {
                                name: name,
                                //defaultValue: value
                            };
                        })}
                        <input type="hidden" name={`${props.baseName}[${index}][label]`} defaultValue={values?.label} />
                        {values?.id &&
                            <input type="hidden" name={`${props.baseName}[${index}][id]`} defaultValue={values?.id} />
                        }
                    </TabPanel>
                ))}
                <input type="hidden" name={`${props.baseName}_deleted`} defaultValue={state.deletedIds.join(',')} />
            </Box>
        </fieldset>
    );
}
