import styles from '../styles/List.module.css';
import { useRouter } from 'next/router';

export default function List({ data, instance }) {
    let router = useRouter();

    let addToShows = async (target, index) => {
        let { id } = data[index];

        try {
            await instance.post('https://api.betaseries.com/shows/show', { id });
            target.parentNode.remove()
        } catch({ response }) {
            console.log(response);
        }
    }

    return (
        <div className={styles.list}>
            {data.map((e, i) => {
                let img = Object.values(e.images).sort().find((img) => img);
                return(
                    <div key={e.id} className={styles.card_container} style={{backgroundImage: `url(${img})`}}>
                        <div className={styles.card}>
                            <h3>{e.title}</h3>
                            <button onClick={() => router.replace(`/show/${e.id}`)}>See more</button>
                        </div>
                        {!e.user.next.id && e.user.status == 0 && <button onClick={({ target }) => addToShows(target, i)} className={styles.plus}>+</button>}
                    </div>
                )
            })}
        </div>
    )
}