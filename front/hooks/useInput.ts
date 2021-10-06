import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'

type ReturnTypes<T=any> = [T, (e:any)=> void, Dispatch<SetStateAction<T>>];

const useInput = <T = any> (initialValue: T )  : ReturnTypes<T>=> {
    const [value, setValue] = useState(initialValue);
    const handler = useCallback((e:any) => {
        setValue(e.target.value);
    }, [])
    return [value, handler, setValue];
}

export default useInput