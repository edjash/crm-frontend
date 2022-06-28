import { Box } from "@mui/material";
import CountrySelect from "../Form/CountrySelect";
import Fieldset from "../Form/Fieldset";
import IndustrySelect from "../Form/IndustrySelect";
import MultiFieldset from "../Form/MultiFieldset";
import ProfileAvatar from "../Form/ProfileAvatar";
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
                <Fieldset legend="Identity">
                    {!props.isDesktop &&
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
        </TabPanel>
    );
}
