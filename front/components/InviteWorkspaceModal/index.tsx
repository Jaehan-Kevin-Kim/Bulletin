import React, { useCallback, VFC } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import Modal from '@components/Modal'
import useInput from '@hooks/useInput'
import { Button, Input, Label } from '@pages/SignUp/styles'
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db'
import fetcher from '@utils/fetcher'

interface Props {
    show: boolean;
    onCloseModal: () => void,
    setShowInviteWorkspaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
    const [newMember, onChangeNewMember, setNewMember] = useInput('')
    const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

    const { data: userData } = useSWR<IUser | false>('/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    const { mutate: mutateMembers } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    const onInviteMember = useCallback((e) => {
        e.preventDefault();
        if (!newMember || !newMember.trim()) {
            return;
        }

        axios.post(`/api/workspaces/${workspace}/members`, {
            email: newMember,
        }).then(() => {
            setShowInviteWorkspaceModal(false);
            setNewMember('')
            mutateMembers();
        }).catch((error) => {
            console.dir(error)
            toast.error(error.response?.data, { position: 'bottom-center' })
        })
    }, [newMember],
    )

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onInviteMember}>
                <Label id="member-label">
                    <span>Email</span>
                    <Input id="member" value={newMember} onChange={onChangeNewMember} />
                </Label>
                <Button type="submit">Invite</Button>
            </form>
        </Modal>
    )
}

export default InviteWorkspaceModal
