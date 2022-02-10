import { setLocale } from 'yup';
import './locale.ts';

setLocale({
    mixed: {
        required: 'This is a required field'
    },
    string: {
        email: 'Must be a valid email address',
        min:'At least ${min} characters are required'
    }
});