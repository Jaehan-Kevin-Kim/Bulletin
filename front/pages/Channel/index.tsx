import React, { useCallback } from 'react'
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { Container } from '@pages/Channel/styles'
import { Header } from './styles';

const Channel = () => {
    const [chat, onChangeChat, setChat] = useInput('')


    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log("submit")
        setChat('');
    }, [])

    return (
        <Container>
            <Header> Channel</Header>
            <ChatBox placeholder="placeholder" chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} ></ChatBox>
        </Container>
    )
}

export default Channel
