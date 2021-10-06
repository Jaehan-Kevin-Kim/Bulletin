import useInput from '@hooks/useInput';
import React, { FC, useCallback, useState, VFC } from 'react'
import axios from 'axios'
import { Container, Header, Form, Error, Success, Label, Input, LinkContainer, Button } from './styles';
import { Link } from 'react-router-dom';

const SignUp: FC = () => {
    const [email, onChangeEmail, setEmail] = useInput('');
    const [nickname, onChangeNickname, setNickname] = useInput('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [misMatchError, setMisMatchError] = useState(false);
    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value)
        setMisMatchError(e.target.value !== passwordCheck);
    }, [password, passwordCheck]);

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setMisMatchError(e.target.value !== password);
    }, [password, passwordCheck])

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(email, nickname, password, passwordCheck)
        if (!misMatchError && nickname) {
            console.log('Send Sign Up Request to the Server');

            setSignUpSuccess(false);
            setSignUpError('');
            axios.post('/api/users', { email, nickname, password })
                .then((response) => {
                    console.log(response)
                    setSignUpSuccess(true)
                })
                .catch((error) => {
                    console.log(error.response)
                    setSignUpError(error.response.data);
                })
                .finally(() => { })
        }
    }, [email, nickname, password, passwordCheck])

    return (
        // <div id="container">
        <Container id="container">
            <Header>Bulletin</Header>
            <Form onSubmit={onSubmit}>
                <Label id='email-label'>
                    <span>Email Address</span>
                    <div>
                        <Input type='email' id='email' name='email' value={email} onChange={onChangeEmail}></Input>
                    </div>
                </Label>
                <Label id='nickname-label'>
                    <span>NickName</span>
                    <div>
                        <Input type='text' id='nickname' name='nickname' value={nickname} onChange={onChangeNickname}></Input>
                    </div>
                </Label>
                <Label id='password-label'>
                    <span>Password</span>
                    <div>
                        <Input type='password' id='password' name='password' value={password} onChange={onChangePassword}></Input>
                    </div>
                </Label>
                <Label id="password-check-label">
                    <span>Password</span>
                    <div>
                        <Input
                            type="password"
                            id="password-check"
                            name="password-check"
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                        />
                    </div>
                    {misMatchError && <Error>Password is not matched!</Error>}
                    {!nickname && <Error>Please insert a nickname.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                    {signUpSuccess && <Success>Success! Please Log In.</Success>}
                </Label>
                <Button type="submit">Sign Up</Button>
            </Form>
            <LinkContainer>
                Are you already a member??&nbsp;
                <Link to="/login">Go to Log In</Link>
            </LinkContainer>
        </Container>
        // </div>
    )
}

export default SignUp;
