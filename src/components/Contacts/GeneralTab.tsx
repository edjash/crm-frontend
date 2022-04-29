import { Box } from "@mui/material";
import { CompanySelect } from "../Form/CompanySelect";
import CountrySelect from "../Form/CountrySelect";
import Fieldset from "../Form/Fieldset";
import MultiFieldset from "../Form/MultiFieldset";
import ProfileAvatar from "../Form/ProfileAvatar";
import RemoteSelect from "../Form/RemoteSelect";
import TextFieldEx from "../Form/TextFieldEx";
import SocialIcon from "../SocialIcon";
import TabPanel from "../TabPanel";

interface GeneralTabProps {
    value: number;
    isActive: boolean;
    isDesktop?: boolean;
    data?: Record<string, any>;
}

export default function GeneralTab(props: GeneralTabProps) {

    return (
        <TabPanel
            value={props.value}
            isActive={props.isActive}
            sx={{
                display: 'grid',
                gridTemplateColumns: (props.isDesktop) ? '320px 320px 320px' : 'auto',
                alignItems: 'start',
                p: 1,
                gap: 1
            }}
        >
            <Box display="grid" gap={1}>
                <Fieldset legend="Personal">
                    {!props.isDesktop &&
                        <ProfileAvatar
                            name="avatar"
                            filename={props?.data?.avatar}
                            sx={{ justifySelf: "left" }}
                            size={100}
                        />
                    }
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                        <RemoteSelect
                            name="title"
                            label="Title"
                            sx={{ m: 0 }}
                            options={[
                                { value: 'Mr', label: 'Mr' },
                                { value: 'Mrs', label: 'Mrs' },
                                { value: 'Miss', label: 'Miss' },
                                { value: 'Ms', label: 'Ms' },
                                { value: 'Mx', label: 'Mx' },
                            ]}
                        />
                        <RemoteSelect
                            label="Pronouns"
                            name="pronouns"
                            options={[
                                { value: 'She/Her', label: 'She/Her' },
                                { value: 'He/Him', label: 'He/Him' },
                                { value: 'They/Them', label: 'They/Them' },
                            ]}
                        />
                    </Box>
                    <Box>
                        <TextFieldEx
                            name="firstname"
                            label="First Name"
                            required
                        />
                        <TextFieldEx
                            name="lastname"
                            label="Last Name"
                        />
                        <TextFieldEx
                            name="nickname"
                            label="Nick Name"
                        />
                    </Box>
                </Fieldset>
                <Fieldset legend="Company">
                    <CompanySelect
                        name="company"
                        label="Company"
                    />
                    <TextFieldEx
                        name="jobtitle"
                        label="Job Title"
                    />
                </Fieldset>
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
                <MultiFieldset
                    legend="Phone Number"
                    baseName="phone_number"
                >
                    <TextFieldEx name="number" label="Phone Number" />
                </MultiFieldset>
            </Box>
            <Box display="grid" gap={1}>
                <Fieldset legend="Social Media">
                    {['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Teams', 'Skype'].map((network, index) => (
                        <Box display="flex" alignItems="center" gap={1} key={network}>
                            <SocialIcon network={network} />
                            <TextFieldEx
                                name={`socialmedia.${network.toLowerCase()}`}
                                label={network}
                            />
                        </Box>
                    ))}
                </Fieldset>
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
        </TabPanel>
    );
}
