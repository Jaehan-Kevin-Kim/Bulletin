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
    setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
    const [newMember, onChangeNewMember, setNewMember] = useInput('')
    const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

    // const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    // console.log('channel', channel)

    const { data: userData } = useSWR<IUser | false>(`/api/users`, fetcher)

    const { mutate: mutateMember } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher
    )

    // const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    const onInviteMember = useCallback((e) => {
        e.preventDefault();
        if (!newMember || !newMember.trim()) {
            return;
        }

        axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
            email: newMember,
        }).then(() => {
            setShowInviteChannelModal(false);
            setNewMember('')
            mutateMember();
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
                    <span>Channel Member Invite</span>
                    <Input id="member" value={newMember} onChange={onChangeNewMember} />
                </Label>
                <Button type="submit">Invite</Button>
            </form>
        </Modal>
    )
}

export default InviteChannelModal
