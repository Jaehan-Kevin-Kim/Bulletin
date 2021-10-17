import React, { useCallback, useState, VFC } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar'
import { Redirect, Link, Switch, Route } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useParams } from 'react-router';
import loadable from '@loadable/component';
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
import { Header, RightMenu, ProfileImg, WorkspaceWrapper, Workspaces, Channels, WorkspaceName, Chats, MenuScroll, ProfileModal, LogOutButton, WorkspaceButton, AddButton, WorkspaceModal } from './styles';
import Menu from '@components/Menu';
import { IChannel, IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import CreateChannelModal from '@components/CreateChannelModal';


interface DataPaylaod<T> {
    [key: string]: T;
}

interface DataResponse<T> {
    data: T;
    isLoading: boolean;
    isError: any;
}

const Workspace: VFC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('')
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('')

    const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    const { workspace } = useParams<{ workspace: string }>();
    const { data: channelData } = useSWR<IChannel[]>(userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null, fetcher)

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
            .then(() => {
                mutate();
            });
    }, [])

    const onClickUserProfile = useCallback(
        () => {
            // console.log('hi');
            setShowUserMenu((prev) => !prev);
        },
        [],
    )

    const onCloseUserProfile = useCallback(
        (e) => {
            e.stopPropagation();
            setShowUserMenu(false);
        },
        [],
    )


    const onClickCreateWorkspace = useCallback(
        () => {
            setShowCreateWorkspaceModal(true);
        },
        [],
    )

    const onCreateWorkspace = useCallback((e) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;
        axios.post('http://localhost:3095/api/workspaces', {
            workspace: newWorkspace,
            url: newUrl,
        }, { withCredentials: true }).then(() => {
            mutate();
            setShowCreateWorkspaceModal(false);
            setNewWorkspace('');
            setNewUrl('');
        }).catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center' });
        })
    },
        [newWorkspace, newUrl],
    )

    const onCloseModal = useCallback(
        () => {
            setShowCreateWorkspaceModal(false);
            setShowCreateChannelModal(false);
        },
        [],
    )

    const onChaneNewWorkspace = useCallback(
        () => {

        },
        [],
    )

    const onChangeNameUrl = useCallback(
        () => {

        },
        [],
    )

    const toggleWorkspaceModal = useCallback(
        () => {
            setShowWorkspaceModal((prev) => !prev);
        },
        [],
    )

    const onClickAddChannel = useCallback(
        () => {
            setShowCreateChannelModal(true);
        },
        [],
    )

    if (!userData) {
        return <Redirect to='/login' />
    }



    console.log('userData', userData)
    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                        {showUserMenu && (
                            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                                    <div>
                                        <span id="profile-name">{userData.nickname}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>Logout</LogOutButton>
                            </Menu>)}
                    </span>
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces.map((ws) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${123}/channel/general`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        )
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>Bulletin</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                            <WorkspaceModal>
                                <h2>Bulletin</h2>
                                {/* <h2>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</h2> */}
                                {/* <button onClick={onClickInviteWorkspace}>Add a user for the workspace</button>*/}
                                <button onClick={onClickAddChannel}>Create Channel</button>
                                <button onClick={onLogout}>Logout</button>
                            </WorkspaceModal>
                        </Menu>
                        {channelData?.map((v) => (<div>{v.name}</div>))}
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path='/workspace/:workspace/channels/:channel' component={Channel} />
                        <Route path='/workspace/:workspace/dm/:id' component={DirectMessage} />
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>Workspace Name</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />

                    </Label>
                    <Label id="workspace-url-label">
                        <span>Workspace Url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">Create</Button>
                </form>
            </Modal>
            <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal}
                setShowCreateChannelModal={setShowCreateChannelModal}
            />
        </div >
    )
}

export default Workspace;
