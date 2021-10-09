import axios from 'axios';

const fetcher:object = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);

export default fetcher;