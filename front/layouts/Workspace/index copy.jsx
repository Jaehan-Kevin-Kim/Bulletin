// import React, { useCallback } from 'react';
// import useSWR from 'swr';
// import fetcher from '@utils/fetcher';
// import axios from 'axios';
// import gravatar from 'gravatar'
// import { Redirect, Link } from 'react-router-dom';
// import { Header, RightMenu, ProfileImg } from './styles';

// const Workspace = ({ children }) => {
//     const { data: userData, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)


//     const onLogout = useCallback(() => {
//         axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
//             .then(() => {
//                 mutate();
//             });
//     }, [])

//     if (!userData) {
//         return <Redirect to='/login' />
//     }

//     console.log('data', userData)
//     return (
//         <div>
//             <Header>
//                 <RightMenu>
//                     <span>
//                         <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt="" />
//                     </span>
//                 </RightMenu>
//             </Header>
//             <button onClick={onLogout}>Logout</button>
//             {children}
//         </div>
//     )
// }

// export default Workspace;
