import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import { uniqueId } from 'lodash';
import { useModal } from "mui-modal-provider";
import React, { ChangeEvent, Children, cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import ConfirmDialog from "../ConfirmDialog";
import PromptDialog from "../PromptDialog";


interface MultiFieldsetProps {
    baseName: string;
    defaultValue?: Record<string, any>;
    children: ReactNode;
    legend: string;
    defaultTabLabel: string;
    activeTab?: number;
    errors?: Record<string, string>;
    propsCallback?: (fieldName: string, index: number) => Record<string, any>,
};

interface MultiFieldsetState {
    menuAnchorEl: null | HTMLElement;
    activeTab: number;
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


export default function MultiFieldSet(props: MultiFieldsetProps) {
    return (
        <Controller
            render={({ ...controlProps }) => {
                const errorMessage = controlProps.fieldState.error?.message ?? '';
                const onChange = (selValue: string | null) => {
                    controlProps.field.onChange(selValue);
                }

                return (
                    <MultiFieldsetBase
                        {...props}
                        defaultValue={controlProps.field.value}
                    />
                );
            }}
            name={props.baseName}
        />
    );
}


function MultiFieldsetBase(props: MultiFieldsetProps) {

    const { register } = useFormContext();
    const { fields, append, update, remove } = useFieldArray({
        name: props.baseName
    });

    fields.map((item: Record<string, string>, index) => {
        if (!item?.label) {
            item.label = (index > 0) ? 'Other' : 'Primary';
            update(index, item);
        }
    });

    const [state, setState] = useState<MultiFieldsetState>(() => {
        return {
            menuAnchorEl: null,
            activeTab: props?.activeTab ?? 0,
            deletedIds: [],
        };
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
                // //const values = [...state.values];

                // const confirm = showModal(PromptDialog, {
                //     title: 'Enter a label',
                //     onCancel: () => {
                //         confirm.hide();
                //     },
                //     inputValue: values[state.activeTab].label,
                //     onConfirm: (value: string) => {
                //         confirm.hide();
                //         if (value.length) {
                //             values[state.activeTab].label = value;
                //             setState((state) => ({
                //                 ...state,
                //                 values: values,
                //             }));
                //         }
                //     }
                // });
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

        append({ label: 'Other' });

        setState((prevState) => ({
            ...prevState,
            activeTab: fields.length,
        }));
    };

    const onDeleteClick = () => {
        const field: Record<string, string> = fields[state.activeTab];

        const confirm = showModal(ConfirmDialog, {
            title: 'Confirm Delete',
            content: `The entry '${field.label}' will be deleted`,
            onCancel: () => {
                confirm.hide();
            },
            onConfirm: () => {
                confirm.hide();

                let deletedIds = [...state.deletedIds];
                if (field.dbid) {
                    deletedIds.push(parseInt(field.dbid));
                }

                remove(state.activeTab);

                setState((state) => ({
                    ...state,
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

    useEffect(() => {
        console.log("ACTIVE TAB", state.activeTab);
        console.table(fields);
    }, [fields]);

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
                        {fields.map((item: Record<string, string>, index) => (
                            <Tab label={item.label} value={index} key={index} />
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
                {fields.map((item: Record<string, string>, index) => (
                    <TabPanel active={state.activeTab == index} key={item.id}>
                        {cloneChildren(props.children, (fieldName) => {
                            return {
                                name: `${props.baseName}.${index}.${fieldName}`
                            };
                        })}
                    </TabPanel>
                ))}
                <input type="hidden" name={`${props.baseName}_deleted`} defaultValue={state.deletedIds.join(',')} />
            </Box>
        </fieldset>
    );
}
