import { Autocomplete } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import TextFieldEx from "./TextFieldEx";
import PromptDialog, { PromptProps } from './PromptDialog';
import { useModal } from "mui-modal-provider";

type ComboOption = {
    value: string,
    label: string
};

type CustomComboProps = {
    options: ComboOption[];
    selected: string | null;
    promptProps?: PromptProps;
    label?: string
};

export default function CustomCombo(props: CustomComboProps) {

    const defaultOption = '';

    const [state, setState] = useState({
        selected: props.selected,
        options: props.options.concat({ value: 'custom', label: 'Custom' })
    });

    const { showModal } = useModal();

    const onChange = (event: SyntheticEvent, newValue: ComboOption | null) => {

        if (newValue?.value == 'custom') {
            setState({
                ...state,
                selected: defaultOption
            });

            const confirm = showModal(PromptDialog, {
                title: 'Custom Value',
                onCancel: () => {
                    confirm.hide();
                },
                onConfirm: (value: string) => {

                    let options = state.options;
                    options.unshift({ value: value, label: value });

                    setState({
                        ...state,
                        options: options,
                        selected: value
                    });

                    confirm.hide();
                },
                ...props.promptProps
            });

            return;
        }

        setState({
            ...state,
            selected: newValue?.value ?? null
        });
    };

    let selectedOption = null;

    state.options.map((option) => {
        if (option.value === state.selected) {
            selectedOption = option;
        }
    });

    return (
        <Autocomplete
            value={selectedOption}
            options={state.options}
            onChange={onChange}
            renderInput={(params) => <TextFieldEx {...params} label={props.label} />}
        />
    );
}


