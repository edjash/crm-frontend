import { object, string } from 'yup';
import './locale.ts';

const loginSchema = object({
    email:
        string()
            .email()
            .max(255)
            .required(),
    password:
        string()
            .max(255)
            .required(),
});


export default loginSchema;