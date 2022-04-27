import TabPanel from "../TabPanel";

interface NotesTabProps {
    value: number;
    isActive: boolean;
}

export default function NotesTab(props: NotesTabProps) {
    return (
        <TabPanel
            value={props.value}
            isActive={props.isActive}
        >
            NOTES AND STUFF
        </TabPanel>
    );
}
