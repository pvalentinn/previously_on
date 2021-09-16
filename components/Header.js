import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';

export default function Header({ user, instance }) {
    const router = useRouter();

    let logout = async () => {
        try {
            await instance.post('/api/logout', { token: user.token });
            router.push('/');
        } catch({ response }) {
            console.log(response);
        }
    }

    const routes = [
        {path: '/shows', name: 'Shows'},
        {path: '/home', name: 'Home'},
        {path: '/friends', name: 'Friends'},
    ]
   

    return (
        <header className={styles.header}>
            <h3>Welcome {user.login}</h3>

            {routes.map((route, i)=> {
                if(router.pathname == route.path) return
                return (
                    <Link href={route.path} key={i}>
                        <a>{route.name}</a>
                    </Link>
                )
            })}

            {/* {router.pathname != '/shows' ?
                <Link href="/shows">
                    <a>Shows</a>
                </Link>
            :
                <Link href="/home">
                    <a>Home</a>
                </Link>
            }
         */}
            <button onClick={logout}>Log out</button>
        </header>
    )
}