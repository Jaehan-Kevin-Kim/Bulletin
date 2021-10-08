import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from "swr";
import SWRDevtools, { Cache } from "@jjordy/swr-devtools";
// import { cache, mutate } from 'swr';


import App from '@layouts/App'

render(
    <BrowserRouter>
        <SWRConfig value={{ provider: () => new Cache() }} >
            <App />
            <SWRDevtools />
        </SWRConfig>
        {/* <SWRDevtools cache={cache} mutate={mutate} /> */}

    </BrowserRouter>,
    document.querySelector('#app'));


    // pages - 서비스 페이지
    // components - 자잘한 컴포넌트 (페이지들 안에 들어가는)
    // layouts - 페이지들간의 공통 레이아웃
