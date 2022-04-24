import TabPanel from "../TabPanel";

interface NotesTabProps {
    index: number;
    isActive: boolean;
}

export default function NotesTab(props: NotesTabProps) {
    return (
        <TabPanel
            value={props.index}
            isActive={props.isActive}
        >
            NOTES AND STUFF
        </TabPanel>
    );
}
