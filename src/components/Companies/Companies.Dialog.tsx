import { Box, DialogTitle, Theme, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EVENTS } from '../../app/constants';
import { windowMinimized, windowOpened } from '../../store/reducers/windowSlice';
import { useStoreSelector } from '../../store/store';
import companySchema from '../../validation/companySchema';
import apiClient from '../apiClient';
import DialogEx from '../Dialogs/DialogEx';
import CountrySelect from '../Form/CountrySelect';
import Fieldset from '../Form/Fieldset';
import Form from '../Form/Form';
import IndustrySelect from '../Form/IndustrySelect';
import MultiFieldset from '../Form/MultiFieldset';
import ProfileAvatar from '../Form/ProfileAvatar';
import TextFieldEx from '../Form/TextFieldEx';
import Overlay from '../Overlay';
import SocialIcon from '../SocialIcon';

export interface CompanyDialogData {
    id: number;
    name: string;
    avatar?: string;
};

export interface CompanyDialogProps {
    type: 'new' | 'edit',
    data?: CompanyDialogData,
    onCancel?: () => void;
    onSave?: (success: boolean, data: Record<string, any>) => void;
    noAnimation?: boolean;
    hideBackdrop?: boolean;
};

interface CompanyDialogState {
    loading: boolean;
    ready: boolean;
    open: boolean;
    minimise: boolean;
    defaultValues: Record<string, any>;
    windowId: string;
}
interface TitleProps extends CompanyDialogProps {
    isDesktop: boolean;
    avatar?: string;
}

const Title = (props: TitleProps) => {

    const isDesktop = props.isDesktop;
    let title = props.data?.name ?? 'Unnamed';
    if (props.type === 'new') {
        title = 'New Company';
    }

    return (
        <Box display="flex" alignItems="center" gap={isDesktop ? 2 : 1} p={isDesktop ? 2 : 0}>
            {isDesktop &&
                <ProfileAvatar
                    name="avatar"
                    filename={props.avatar}
                    sx={{ justifySelf: "left" }}
                    variant="squircle"
                />
            }
            <DialogTitle>
                {title}
            </DialogTitle>
        </Box>
    );
}

export default function CompanyDialog(props: CompanyDialogProps) {

    const [state, setState] = useState<CompanyDialogState>({
        loading: false,
        ready: (props.type === 'new'),
        open: true,
        minimise: false,
        defaultValues: {},
        windowId: 'company_' + props.data?.id,
    });

    const dispatch = useDispatch();
    const activeWindow = useStoreSelector(state => state.windows.active);
    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const formId = useRef(uniqueId('companyForm'));

    useEffect(() => {
        if (props.type === 'edit' && !state.ready) {
            apiClient.get(`/companies/${props.data?.id}`).then((response) => {
                if (!state.open) {
                    return;
                }
                const values = prepareIncomingValues(response.data);

                setState((state) => ({
                    ...state,
                    open: true,
                    defaultValues: values,
                    ready: true,
                }));
            }).catch((error) => {

            });
        }
    }, [props.type, state.ready, state.open, props.data?.id]);

    useEffect(() => {
        if (activeWindow && activeWindow === state.windowId) {
            setState(state => ({
                ...state,
                minimise: false,
            }));
        }
    }, [activeWindow, state.windowId]);

    useEffect(() => {
        if (!state.ready) {
            return;
        }

        PubSub.subscribe(EVENTS.WINDOW_RESTORE, (e, data: string) => {
            if (data === state.windowId) {
                setState(state => ({
                    ...state,
                    minimise: false,
                }));
            }
        });

        dispatch(windowOpened({
            image: props.data?.avatar,
            text: props.data?.name,
            windowId: state.windowId,
        }));

    }, [
        state.ready,
        dispatch,
        props.data?.avatar,
        props.data?.name,
        state.windowId
    ]);

    const onSubmit = (data: any) => {

        setState({ ...state, loading: true });

        data = prepareOutgoingValues(data);

        let url = '/companies';
        if (props.type === 'edit' && props.data?.id) {
            url = `${url}/${props.data.id}`;
        }

        apiClient.post(url, data)
            .then((response) => {
                setState({ ...state, loading: false });
                if (props.onSave) {
                    props.onSave(true, response.data);
                }
                if (props.type === 'edit') {
                    PubSub.publish(EVENTS.COMPANIES_REFRESH);
                } else {
                    PubSub.publish(EVENTS.TOAST, {
                        message: 'Company Added',
                        autoHide: true,
                    });
                    PubSub.publish(EVENTS.COMPANIES_REFRESH);
                }

            }).catch((response) => {
                setState({ ...state, loading: false });
                if (props.onSave) {
                    props.onSave(false, response);
                }
                // apiClient.showErrors(response, formMethods.setError);
            });
    }

    const onError = (data: any) => {
        console.log("Validation Error", data);
    };

    const onMinimise = () => {
        setState(state => ({
            ...state,
            minimise: true
        }));
        dispatch(windowMinimized(state.windowId));
    }

    const prepareOutgoingValues = (values: Record<string, any>) => {
        if (values.address) {
            values.address =
                values.address.map((item: Record<string, any>) => {
                    if (item.country && typeof item.country === 'object') {
                        item.country = item.country.code;
                    }
                    return item;
                });
        }

        values.industry_id = values?.industry?.id || null;
        // values.industry_id = (typeof values.industry === 'object')
        //     ? values.industry.id : values.industry;
        // delete values.industry;

        return values;
    }

    const prepareIncomingValues = (values: Record<string, any>) => {
        values.social_media_url.forEach((item: Record<string, string>) => {
            values[`socialmedia.${item.ident}`] = item.url;
        });
        delete values['social_media_url'];

        values.address =
            values.address.map((addr: Record<string, any>) => {
                if (addr?.country_code && addr?.country_name) {
                    addr.country = {
                        code: addr?.country_code,
                        name: addr?.country_name,
                    };
                } else {
                    addr.country = null;
                }
                return addr;
            });

        return values;
    }

    let extraProps: Record<string, any> = {};
    if (props.noAnimation) {
        extraProps['transitionDuration'] = 0;
    }
    if (props.hideBackdrop) {
        extraProps['hideBackdrop'] = true;
    }

    const ready = ((props.type === 'edit' && state.ready) || props.type === 'new');

    return (
        <Form
            onSubmit={onSubmit}
            onError={onError}
            defaultValues={state.defaultValues}
            validationSchema={companySchema}
            id={formId.current}
        >
            <DialogEx
                open={state.open}
                onCancel={props.onCancel}
                titleComponent={<Title {...props} isDesktop={isDesktop} avatar={props.data?.avatar} />}
                displayMode={isDesktop ? 'normal' : 'mobile'}
                showMinimize={true}
                onMinimise={onMinimise}
                saveButtonProps={{
                    type: 'submit',
                    form: formId.current,
                    disabled: !ready,
                }}
                {...extraProps}
                className={clsx({ skeletons: !ready, windowMinimise: state.minimise })}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: (isDesktop) ? '320px 320px 320px' : 'auto',
                        alignItems: 'start',
                        gap: 1,
                    }}
                >
                    {!state.minimise &&
                        <>
                            <Box display="grid" gap={1}>
                                <Fieldset legend="Identity">
                                    {!isDesktop &&
                                        <ProfileAvatar
                                            name="avatar"
                                            sx={{ justifySelf: "center" }}
                                            size={100}
                                        />
                                    }
                                    <TextFieldEx
                                        name="name"
                                        label="Name"
                                        required
                                    />
                                    <IndustrySelect
                                        label="Industry"
                                        name="industry"
                                    />
                                    <TextFieldEx
                                        name="description"
                                        label="Description"
                                        multiline
                                        rows={3}
                                    />
                                </Fieldset>
                                <MultiFieldset
                                    legend="Phone Number"
                                    baseName="phone_number"
                                >
                                    <TextFieldEx name="number" label="Phone Number" />
                                </MultiFieldset>
                                <MultiFieldset
                                    legend="Email Address"
                                    baseName="email_address"
                                >
                                    <TextFieldEx
                                        name="address"
                                        label="Email Address"
                                    />
                                </MultiFieldset>
                            </Box>
                            <Box display="grid" gap={1}>
                                <MultiFieldset
                                    baseName="address"
                                    legend="Address"
                                >
                                    <TextFieldEx name="street" label="Street" />
                                    <TextFieldEx name="town" label="Town / City" />
                                    <TextFieldEx name="county" label="County / State" />
                                    <TextFieldEx name="postcode" label="Zip / Postal Code" />
                                    <CountrySelect
                                        label="Country"
                                        name="country"
                                    />
                                </MultiFieldset>
                            </Box>
                            <Box display="grid" gap={1}>
                                <Fieldset legend="Social Media">
                                    {['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Teams', 'Skype'].map((network, index) => (
                                        <Box display="flex" alignItems="center" gap={1} key={network}>
                                            <SocialIcon network={network} />
                                            < TextFieldEx
                                                name={`socialmedia.${network.toLowerCase()}`}
                                                label={network}
                                            />
                                        </Box>
                                    ))}
                                </Fieldset>
                            </Box>
                        </>
                    }
                </Box>
            </DialogEx>
            <Overlay open={state.loading} />
        </Form>
    );
}
