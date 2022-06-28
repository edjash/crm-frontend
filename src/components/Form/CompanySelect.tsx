import { EVENTS } from "../../app/constants";
import SearchField from "./SearchField";

interface CompanySelectProps {
    name: string;
    label: string;
}

export function CompanySelect(props: CompanySelectProps) {

    const onAddCompany = (): Promise<Record<string, any>> => {
        return new Promise((resolve, reject) => {
            PubSub.publish(EVENTS.COMPANIES_NEW, {
                onSave: (success: boolean, data: Record<string, any>) => {
                    if (success) {
                        resolve(data.company);
                    } else {
                        reject(data);
                    }
                },
                noAnimation: true,
            })
        });
    }

    return (
        <SearchField
            url="/companies"
            labelField="name"
            valueField="id"
            name={props.name}
            label={props.label}
            remoteDataProperty="data"
            onAddClick={onAddCompany}
        />
    );
}