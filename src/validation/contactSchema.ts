import { Email } from '@mui/icons-material';
import { object, string, array } from 'yup';
import './locale.ts';

const contactSchema = object({
    title:
        string().required().nullable(),
    firstname:
        string()
            .max(255)
            .required(),
    email_address:
        array().of(
            object().shape({
                address: string().email()
            })
        )
});

export default contactSchema;