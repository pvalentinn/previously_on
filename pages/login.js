import Head from 'next/head';
import Router from 'next/router';
import { useState } from 'react';
import { MD5 } from 'crypto-js';
import styles from '../styles/Home.module.css';

export default function Login({ instance }) {
    let [ form, setForm ] = useState({login: "", password: ""});
    let [ error, setError ] = useState('');

    let connect = (e) => {
        e.preventDefault();
        setError('');

        let data = {
            login: form.login,
            password: MD5(form.password).toString()
        };
        console.log(data);

        (async () => {
            try {
                await instance.post('/api/login', data);
                Router.push('/home');
            } catch({ response }) {
                let string = '';
                if(response) {
                    response.data.error.forEach(e => string += e.text + '\n');
                    setError(string);
                }
            }
        })();
    }


    return (
        <>
            <Head>
				<title>Previously - Login</title>
			</Head>
            <div>
                <form onSubmit={connect} className={styles.login}>
                    {error ? <p className={styles.login_error}>{error}</p> : null}
                    <input type="text" placeholder='Login' className={styles.login_input} onChange={(e) => setForm({...form, login: e.target.value})} />
                    <input type="password" placeholder='Password' className={styles.login_input} onChange={(e) => setForm({...form, password: e.target.value})} />

                    <button className={styles.login_button}>Login</button>
                </form> 
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res }) {
    if(res.user) {
        return {
            redirect: {
                destination: '/home',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}