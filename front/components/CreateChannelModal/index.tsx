import Modal from '@components/Modal'
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles'
import axios from 'axios';
import React, { useCallback, VFC } from 'react'
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;

}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

    const onCreateChannel = useCallback((e) => {
        e.preventDefault();
        axios.post(`http://localhost:3095/workspaces/${workspace}/channels`, {
            name: newChannel,
        }, { withCredentials: true })
            .then(() => {
                setShowCreateChannelModal(false);
                setNewChannel('')
            })
            .catch((error) => {
                console.dir(error)
                toast.error(error.response?.data, { position: 'bottom-center' })
            })
    }, [newChannel])

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
