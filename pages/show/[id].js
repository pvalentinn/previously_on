import Episodes from '../../components/Episodes';
import styles from '../../styles/Show.module.css';

export default function DisplayShow({ data, user, episodes, instance }) {
    if(data.code) {
        return (
            <div className={styles.error}>
                <h2>
                    Error code {data.code}
                </h2>
                <p>
                    {data.text}
                </p>
            </div>
        )
    } 

    let { show } = data;
    console.log(show);
    // console.log(episodes);
    // console.log(user.token);
    let img = Object.values(show.images).find((e) => e);
    let genres = Object.values(show.genres);

    let archive = async (id) => {
        let url = "https://api.betaseries.com/shows/archive";
        let method = show.user.archived ? "DELETE" : "POST";
        
        try {
            await instance({
                url,
                method,
                data: { id }
            });
            show.user.archived = show.user.archived ? false : true;
        } catch ({ response }) {
            console.log(response);
        }
    }

	return (
        <>
            <div className={styles.bg} style={{ backgroundImage: `url(${img})` }}></div>
            <div className={styles.container}>
                <div className={styles.header} >
                    <div className={styles.poster}>
                        <img src={show.images.poster} />
                    </div>
                    <div className={styles.title}>
                            <h1>{show.title}</h1>
                            <h2>Note: {show.notes.mean.toString().slice(0, 4)}/5 sur {show.notes.total} votes</h2>
                            <div className={styles.description}>
                                <em title={show.description}>{show.description}</em>
                            </div>
                    </div>
                    <div className={styles.archive}>
                        <button onClick={() => archive(show.id)}>Archive</button>
                    </div>
                </div>
                <div className={styles.body} >
                    <div className={styles.infos}>
                        <h3>Genres: </h3>
                        <p>
                            {genres.map((e, i) => <span key={i}>{e}{i != (genres.length - 1) ? ', ' : '.'}</span>)}
                        </p>
                        <h3>Nombre de saison: </h3>
                        <p>{show.seasons}</p>
                        <h3>Nombre d'épisodes: </h3>
                        <p>{show.episodes}</p>
                        <h3>Longueur d'épisode: </h3>
                        <p>{show.length}min</p>
                    </div>
                    <div className={styles.episodes}>
                        <Episodes episodes={episodes} instance={instance} />
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res, query }) {
    let { user, instance } = res;
    let { id } = query;

    if(!user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    try {
        let url = 'https://api.betaseries.com/shows/display';
        let { data } = await instance.get(url, { params: { id } });

        let { data: { episodes: allEpisodes } } = await instance.get('https://api.betaseries.com/shows/episodes', { params: { id } });

        let episodes = allEpisodes.reduceRight((val, el) => {
            let index = el.season - 1;
            
            if(!val[index]) val[index] = [];
            val[index].unshift(el);

            // if(!val[index]) {
            //     val[index] = {
            //         seen: [],
            //         unseen: []
            //     }
            // }

            // if(el.user.seen) {
            //     val[index].seen.unshift(el)
            // } else if (!el.user.seen)  {
            //     val[index].unseen.unshift(el);
            // }

            return val;
        }, []);

        return {
            props: {
                data,
                episodes
            }
        }
    } catch({ response: { data } }) {
        return {
            props: {
                data: data.errors[0]
            }
        }
    }
}