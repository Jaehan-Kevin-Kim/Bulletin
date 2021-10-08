import React, { FC, useCallback } from 'react'
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect } from 'react-router';



const Workspace: FC = ({ children }) => {
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
            .then(() => { });
    }, [])

    if (data) {
        // return <Redirect to='/login' />
    }

    return (
        <div>
            <button onClick={onLogout}>Logout</button>
            {children}
        </div>
    )
}

export default Workspace;
