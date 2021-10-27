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
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}


const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('')
    const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

    const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)

    const onCreateChannel = useCallback((e) => {
        e.preventDefault();
        axios.post(`/api/workspaces/${workspace}/channels`, {
            name: newChannel,
        }, {
            withCredentials: true,
        }).then(() => {
            setShowCreateChannelModal(false);
            setNewChannel('');
            mutateChannel();
        }).catch(error => {
            console.dir(error)
            if (error.response.statusCode === 500) {

                toast.error("Server Error. Please try again.", { position: 'bottom-center' })
            } else {
                toast.error(error.response?.data, { position: 'bottom-center' })

            }
        })
    }, [newChannel],
    )

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>Channel</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                <Button type="submit">Create</Button>
            </form>
        </Modal>
    )
}

export default CreateChannelModal