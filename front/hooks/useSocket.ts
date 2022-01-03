import io from 'socket.io-client';
import { useCallback } from 'react'
import axios from 'axios';

// 사용방법은 아주 간단함. 아래처럼만 해 주면 됨.
const backUrl = 'http://localhost:3095'

const sockets: {} = {};
const useSocket = (workspace?: string) => {
    console.log('rerender bulletine');


    const disconnect = useCallback(() => {
        if (workspace) {
            sockets[workspace].disconnect();
            delete sockets[workspace];
        }
    }, [workspace],
    )

    if (!workspace) {
        return [undefined, disconnect];
    }

    if (!sockets[workspace]) {
        sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, { transports: ['websocket'] });
        // 위처럼 만 하면 socket.io 사용 준비가 완료 됨.
    }



    return [sockets[workspace], disconnect]

}

export default useSocket;