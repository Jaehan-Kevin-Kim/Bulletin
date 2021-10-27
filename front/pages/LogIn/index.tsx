
import useInput from '@hooks/useInput';
import { Container, Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
    const { data, error, mutate } = useSWR('/api/users', fetcher); //이건 login 후에 내 정보를 가져오는 GET 요청 (API 참고)
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setLogInError(false);
            axios
                .post(
                    '/api/users/login',
                    { email, password },
                    { withCredentials: true }
                )
                .then(() => {
                    mutate(); //이걸 안넣어도 되지만, 이걸 안넣으면 login 하고 바로 data값이 변하는게 아닌 SWR 자체적으로 보내는 응답 체크시간에 반응을 하는 것이기 때문에, 반응이 느릴 수 있음. 이렇게 해주면, login 버튼을 누르고 응답이 성공하자 마자, data 값을 변하게 해서 원하는 동작을 시킬 수 있음.
                    // console.log('mutate', mutate);
                })
                .catch((error) => {
                    setLogInError(error.response?.data?.code === 401);
                });
        },
        [email, password, mutate],
    );

    if (data === undefined) { // this command for loading screen (보통의 경우는 datㄱ)
        return <div>Loading....</div>
    }

    if (data) {
        return <Redirect to="/workspace/bulletin/channel/general" />
    }



    return (
        <Container id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>Email</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>Password</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                    {logInError && <Error>Password is not correct.</Error>}
                </Label>
                <Button type="submit">LogIn</Button>
            </Form>
            <LinkContainer>
                Are you not a member?&nbsp;
                <Link to="/signup">Go to Sign Up</Link>
            </LinkContainer>
        </Container>
    );
};

export default LogIn;
