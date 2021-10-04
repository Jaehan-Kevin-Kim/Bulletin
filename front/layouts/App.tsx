import React from 'react'
import {  Switch, Route, Redirect } from 'react-router-dom'
import LogIn from '@pages/LogIn';
import SignUp from '@pages/SignUp'

const App = () => {
    return (
      
        <Switch>
            <Redirect exact path='/' to='/login' />
            <Route path='/login' component={LogIn}> </Route>
            <Route path='/signup' component={SignUp}></Route>
        </Switch>

    );
}

export default App;

// redux 대신 사용가능한 것: jotai, zustand, recoil.