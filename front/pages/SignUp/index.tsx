import React, { FC, useCallback, useState, VFC } from 'react'
import { Container, Header, Form, Error, Success, Label, Input, LinkContainer, Button } from './styles';

const SignUp: FC = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [misMatchError, setMisMatchError] = useState(false);

    const onChangeEmail = useCallback((e) => {
        setEmail(e.target.value)
    }, [email]);

    const onChangeNickname = useCallback((e) => {
        setNickname(e.target.value);
    }, [nickname]);

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
                    {/* {signUpError && <Error>The email address is already registered.</Error>}
                    {signUpSuccess && <Success>Success! Please Log In.</Success>} */}
                </Label>
                <Button type="submit">Sign Up</Button>
            </Form>
            <LinkContainer>
                Are you already a member??&nbsp;
                <a href="/login">Go to Log In</a>
            </LinkContainer>
        </Container>
        // </div>
    )
}

export default SignUp;
