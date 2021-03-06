import { Add, KeyboardArrowLeft, KeyboardArrowRight, MoreVert } from '@mui/icons-material/';
import { ButtonBase, IconButton, Menu, MenuItem, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import { useModal } from "mui-modal-provider";
import React, { ChangeEvent, Children, cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import PromptDialog from "../Dialogs/PromptDialog";
import Fieldset from './Fieldset';
import SkeletonEx from './SkeletonEx';


interface MultiFieldsetProps {
    baseName: string;
    defaultValue?: Record<string, any>;
    children: ReactNode;
    legend: string;
    activeTab?: number;
};

interface MultiFieldsetState {
    menuAnchorEl: null | HTMLElement;
    activeTab: number;
    emptyField: Record<string, any>;
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
    propsCallback: (props: Record<string, any>) => Record<string, any>,
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
        const childProps = propsCallback(inputElement.props);
        return cloneElement(inputElement, childProps);
    });
}

export default function MultiFieldSet(props: MultiFieldsetProps) {
    return (
        <Controller
            render={({ ...controlProps }) => {
                return (
                    <MultiFieldsetBase
                        {...props}
                    // defaultValue={controlProps.field.value}
                    />
                );
            }}
            name={props.baseName}
        />
    );
}

const TabScrollButton = (props: any) => {

    const onClick = () => {
        // props.onClick();
        props.onScrollClick(props.direction);
    }

    const buttonProps = {
        ...props,
        disabled: false
    };
    delete buttonProps.onScrollClick;

    return (
        <ButtonBase
            component="div"
            {...buttonProps}
            sx={{
                opacity: (props.disabled) ? 0.3 : 1
            }}
            onClick={onClick}
        >
            {props.direction === 'left' ? (
                <KeyboardArrowLeft fontSize="small" />
            ) : (
                <KeyboardArrowRight fontSize="small" />
            )}
        </ButtonBase>
    );
};

const getLabel = (index: number, label?: string) => {
    if (label) {
        return label;
    }
    return (index > 0) ? 'Other' : 'Primary';
}

function MultiFieldsetBase(props: MultiFieldsetProps) {

    const { showModal } = useModal();
    const { register, setValue, getValues, getFieldState } = useFormContext();
    const { fields, append, update, remove } = useFieldArray({
        name: props.baseName,
        keyName: 'key'
    });

    const [state, setState] = useState<MultiFieldsetState>(() => {
        const emptyField: Record<string, any> = {};

        fields.forEach((item: Record<string, string>, index) => {
            if (!item?.label) {
                item.label = getLabel(index);
                update(index, item);
            }
            if (index === 0) {
                Object.keys(item).map(k => emptyField[k] = null);
            }
        });

        register(`${props.baseName}_deleted`);

        return {
            emptyField: emptyField,
            menuAnchorEl: null,
            activeTab: props?.activeTab ?? 0,
        };
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({ ...state.emptyField, label: getLabel(0) });
        } else {
            fields.forEach((item: Record<string, string>, index) => {
                if (!item?.label) {
                    item.label = getLabel(index);
                    update(index, item);
                }
            });
        }
    }, [
        fields,
        state.emptyField,
        append,
        update,
    ]);

    const onMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setState((state) => ({
            ...state,
            menuAnchorEl: event.currentTarget
        }));
    };

    const onMenuItemClick = (event: React.MouseEvent<HTMLLIElement>, key: string) => {
        switch (key) {
            case 'edit':
                const field: Record<string, string> = fields[state.activeTab];

                const confirm = showModal(PromptDialog, {
                    title: 'Enter a label',
                    onCancel: () => {
                        confirm.hide();
                    },
                    inputValue: field.label,
                    onConfirm: (value: string) => {
                        confirm.hide();
                        if (value.length) {
                            update(state.activeTab, { ...field, label: value });
                        }
                    }
                });
                break;
        }
        closeMenu();
    }

    const closeMenu = () => {
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

    const onTabScrollClick = (direction: string) => {
        setState((state) => {
            let tab = state.activeTab;
            if (direction === 'left') {
                tab = (tab > 0) ? tab - 1 : tab;
            } else {
                tab = (tab < fields.length - 1) ? tab + 1 : tab;
            }
            return {
                ...state,
                activeTab: tab,
            };
        });
    }

    const onAddClick = () => {
        append({ ...state.emptyField, label: getLabel(1) });
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

                if (field.id) {
                    let deletedIds = getValues(`${props.baseName}_deleted`);
                    if (!deletedIds) {
                        deletedIds = [];
                    }
                    deletedIds.push(parseInt(field.id));
                    setValue(`${props.baseName}_deleted`, deletedIds);
                }

                remove(state.activeTab);
                setState((state) => ({
                    ...state,
                    activeTab: 0
                }));
            }
        });
        closeMenu();
    }

    return (
        <Fieldset legend={props.legend} styles={{ paddingTop: 50 }}>
            <Box sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: 1,
                left: 12,
                right: 12,
                height: 50
            }}>
                <Tabs
                    onChange={onTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    value={state.activeTab}
                    sx={{
                        flexGrow: 1,
                        [`& .MuiTabScrollButton-horizontal`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        },
                    }}
                    ScrollButtonComponent={(props) =>
                        <TabScrollButton
                            {...props}
                            onScrollClick={onTabScrollClick}
                        />
                    }
                >
                    {fields.map((item: Record<string, string>, index) => (
                        <Tab
                            label={<SkeletonEx>{getLabel(index, item.label)}</SkeletonEx>}
                            value={index} key={item.key}
                            className='skeleton-box'
                        />
                    ))}
                </Tabs>
                <Box
                    sx={{
                        flexShrink: 0,
                    }}
                >
                    <IconButton size="small" sx={{ alignSelf: 'center' }} onClick={onAddClick}>
                        <Add fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ alignSelf: 'center' }} onClick={onMenuClick}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                    <Menu
                        open={state.menuAnchorEl != null}
                        anchorEl={state.menuAnchorEl}
                        onClose={closeMenu}
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
                <div hidden={!(state.activeTab === index)} key={item.key}>
                    {cloneChildren(props.children, (cProps) => {
                        const name = `${props.baseName}.${index}.${cProps.name}`;
                        const fstate = getFieldState(name);
                        return {
                            ...cProps,
                            name: name,
                            error: (!!fstate.error || !!cProps?.error),
                            helperText: fstate?.error?.message || cProps?.helperText,
                        };
                    })}
                </div>
            ))}
        </Fieldset>
    );
}
