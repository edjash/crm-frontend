import { object, string, array } from 'yup';
import './locale.ts';

const contactSchema = object({
    firstname:
        string()
            .max(255)
            .required(),
    title:
        string()
            .required()
            .nullable(),
    email_address: array()
        .of(
            object().shape({
                address: string()
                    .email()
                    .required(),
            })
        )
});


export default contactSchema;