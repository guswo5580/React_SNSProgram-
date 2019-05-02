import React, { useState } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import AppLayout from '../components/AppLayout';

const Signup = () => {
    //기본 Form 커스텀 훅 
    const useInput = (initValue = null) => {
        const [value, setter] = useState(initValue);
        const handler = (e) => {
            setter(e.target.value);
        };
        return [value, handler];
    };
    // e.target.value로 전달 받는 커스텀 훅 이용 state
    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');
    //////////////////////////
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if(password !== passwordCheck)
            return setPasswordError(true);
        
        if(!term)
            return setTermError(true);
    };
    
    const onChangePasswordCheck = (e) => {
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    };
    const onChangeTerm = (e) => {
        setTermError(false);
        setTerm(e.target.checked);
    };


    return(
        <>
            <Head>
                <title>PeaceOcean2</title>
                <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css'/>
                <script src='https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js'/>
            </Head>
            <AppLayout>
                <Form onSubmit={onSubmit} style={{ padding : 10 }}>
                    <div>
                        <label htmlFor='user-id'>아이디</label><br/>
                        <Input name='user-id' value={id} required onChange={onChangeId} />
                    </div>
                    <div>
                        <label htmlFor='user-nick'>닉네임</label><br/>
                        <Input name='user-nick'value={nick} required onChange={onChangeNick} />
                    </div>
                    <div>
                        <label htmlFor='user-password'>비밀번호</label><br/>
                        <Input name='user-password' value={password} type='password' required onChange={onChangePassword} />
                    </div>
                    <div>
                        <label htmlFor='user-password-check'>비밀번호 확인</label><br/>
                        <Input name='user-password-check' value={passwordCheck} type='password' required onChange={onChangePasswordCheck} />
                        {passwordError && <div style={{color : 'red'}}>비밀번호가 일치하지 않습니다</div>}
                    </div>
                    <div>
                        <Checkbox name='user-term' value={term} onChange={onChangeTerm}>
                            깨끗하게 이용할 것에 동의 합니다
                        </Checkbox>
                        {termError && <div style={{color : 'red'}}>동의하셔야 합니다</div>}
                    </div>
                    <div style={{marginTop : 10}}>
                        <Button type='primary' htmlType='submit'>가입하기</Button>
                    </div>
                </Form>
            </AppLayout>
        </>
    );
};

export default Signup;