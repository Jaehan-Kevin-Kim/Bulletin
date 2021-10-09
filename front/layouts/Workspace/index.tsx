import React, { useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar'
import { Redirect, Link, Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
import { Header, RightMenu, ProfileImg, WorkspaceWrapper, Workspaces, Channels, WorkspaceName, Chats, MenuScroll } from './styles';

interface DataPaylaod<T> {
    [key: string]: T;
}

interface DataResponse<T> {
    data: T;
    isLoading: boolean;
    isError: any;
}

const Workspace = ({ children }) => {
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)



    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
            .then(() => {
                mutate();
            });
    }, [])

    if (!data) {
        return <Redirect to='/login' />
    }

    console.log('data', data)
    return (
        <div>
            <Header>
                <RightMenu>
                    <span>
                        <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'retro' })} alt="" />
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>Logout</button>
            <WorkspaceWrapper>
                <Workspaces>
                    test
                </Workspaces>
                <Channels>
                    <WorkspaceName>Bulletin</WorkspaceName>
                    <MenuScroll>
                        MenuScroll
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path='/workspace/channel' component={Channel} />
                        <Route path='/workspace/dm' component={DirectMessage} />
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
        </div>
    )
}

export default Workspace;
