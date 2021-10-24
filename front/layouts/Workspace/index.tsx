import React, { FC, useCallback, useState, VFC } from 'react'
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect, Link, Switch, Route, useParams } from "react-router-dom";
import gravatar from 'gravatar';
import { Header, RightMenu, ProfileImg, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll, ProfileModal, LogOutButton, WorkspaceButton, AddButton, WorkspaceModal } from './styles';
import loadable from '@loadable/component';
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
import { IChannel, IUser } from '@typings/db';
import Menu from '@components/Menu';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify'
import CreateChannelModal from '@components/CreateChannelModal';




const Workspace: VFC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const { workspace } = useParams<{ workspace: string }>();

    const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)
    const { data: channelData } = useSWR<IChannel[]>(userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null, fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)


    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
            .then(() => {
                mutate();
            });
    }, [])

    const onClickUserProfile = useCallback(
        () => {
            setShowUserMenu((prev) => !prev)
        },
        [],
    )

    const onCloseUserProfile = useCallback(
        (e: any) => {
            e.stopPropagation();
            setShowUserMenu(prev => !prev)
        },
        [],
    )

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, [])

    const onCloseModal = useCallback(
        () => {
            console.log('click')
            setShowCreateWorkspaceModal(false);
            setShowCreateChannelModal(false);
        }, [],
    )

    const onCreateWorkspace = useCallback(
        (e) => {
            e.preventDefault();
            if (!newWorkspace || !newWorkspace.trim()) return;
            if (!newUrl || !newUrl.trim()) return;
            axios.post('http://localhost:3095/api/workspaces', {
                workspace: newWorkspace,
                url: newUrl,
            }, {
                withCredentials: true
            })
                .then(() => {
                    mutate();
                    setShowCreateWorkspaceModal(false);
                    setNewWorkspace('')
                    setNewUrl('')
                }).catch((error) => {
                    console.dir(error);
                    toast.error(error.response?.data, { position: 'bottom-center' })
                })
        }, [newWorkspace, newUrl],
    )

    const toggleWorkspaceModal = useCallback(
        () => {
            setShowWorkspaceModal((prev) => !prev)
        },
        [],
    )

    const onClickInviteWorkspace = useCallback(() => {

    }, [],
    )

    //아래 FUNCTION이 작동되면 Channel을 만드는 모달이 뜨게 하기
    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    }, [],
    )
    const onLogOut = useCallback(() => {

    }, [],
    )


    if (!userData) {
        return <Redirect to='/login' />
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt="userData.nickname"></ProfileImg>
                        {showUserMenu &&
                            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile} >
                                <ProfileModal>
                                    <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt="" />
                                    <div>
                                        <span id="profile-name">{userData.nickname}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>Logout</LogOutButton>
                            </Menu>
                        }
                    </span>
                </RightMenu>
            </Header>

            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces.map((ws) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${workspace}/channel/general`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        )
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>
                        {/* {userData?.Workspaces.find((v)=>)} */}
                        Bulletin
                    </WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                            <WorkspaceModal>
                                {/* <h2>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</h2> */}
                                <h2>Bulletin</h2>
                                <button onClick={onClickInviteWorkspace}>Invite a user to the Workspace</button>
                                <button onClick={onClickAddChannel}>Create a channel</button>
                                <button onClick={onLogOut}>Logout</button>
                            </WorkspaceModal>
                        </Menu>
                        {/* {channelData && channelData.map((v) => { (<div>{v.name}</div>) })} */}
                        {channelData?.map((v) => (<div>{v.name}</div>))}
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route exact path='/workspace/:workspace/channel/:channel' component={Channel} />
                        <Route path='/workspace/:workspace/dm/:id' component={DirectMessage} />
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            {/* 아래 modal은 input이 들어있기 때문에 component로 분리 하는게 좋음 */}
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>Workspace Name</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                    </Label>
                    <Label id="workspace-url-label">
                        <span>Workspace url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">Create</Button>
                </form>
            </Modal>
            <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal}
            />


        </div>
    )
}

export default Workspace;
