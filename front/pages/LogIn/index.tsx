import useInput from '@hooks/useInput';
import { Container, Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
// import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
// import useSWR from 'swr';

const LogIn = () => {
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
                )
                .then(() => {
                })
                .catch((error) => {
                    setLogInError(error.response?.data?.code === 401);
                });
        },
        [email, password],
    );

    //   console.log(error, userData);
    //   if (!error && userData) {
    //     console.log('로그인됨', userData);
    //     return <Redirect to="/workspace/sleact/channel/일반" />;
    //   }

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