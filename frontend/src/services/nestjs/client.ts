import axios from 'axios';

const nestjsClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NESTJS_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default nestjsClient;