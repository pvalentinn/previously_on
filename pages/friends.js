import { useEffect, useState } from "react";
import Header from "../components/Header";
import styles from "../styles/Friends.module.css";

export default function Friends({ user, users, instance }) {
    const [ friends, setFriends ] = useState(users);

    let removeFriend = async (id) => {

        try {
            await instance('https://api.betaseries.com/friends/friend', {
                method: 'DELETE',
                data: {
                    id
                }
            })

            setFriends(friends.filter(e => e.id != id));
        } catch (e) {
            console.log(e.response)
        }
    }

    let blockFriend = async ({id, in_account}) => {

        let method = in_account ? "POST" : "DELETE"
        try {
            await instance('https://api.betaseries.com/friends/block', { 
                method,
                data: {
                    id
                }
            });

            setFriends(friends.map((e) => {
                if(e.id == id) e.in_account = e.in_account ? false : true
                return e
            }))

        } catch (e) {
            console.log(e.response);
        }
    }

	return (
    <>
        <Header user={user} instance={instance} />
        <div className={styles.container}>
            <h1>Friends page</h1>

            <div className={styles.list}>
                <h3>List :</h3>
                <ul>
                    {friends && friends.map(e => (
                        <li className={styles.item} key={e.id}>
                            {e.login}
                            <span onClick={() => removeFriend(e.id)}>❌</span>
                            <span onClick={() => blockFriend(e)}>{e.in_account ? '🚫' : '🔓'}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </>
    )
}

export async function getServerSideProps({ req, res }) {
    let { user, instance } = res;

    if(!user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    try {
        let { data: { users } } = await instance.get('https://api.betaseries.com/friends/list');
        let { data: { users: blocked } } = await instance.get('https://api.betaseries.com/friends/list', { params: { blocked: false } });
        
        return {
            props: {
                users: [...users, ...blocked]
            }
        }

    } catch(e) {
        console.log(e)
    }


}