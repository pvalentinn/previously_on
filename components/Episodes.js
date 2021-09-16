import { useState } from 'react';
import styles from '../styles/Episodes.module.css';

export default function Episodes({ episodes, instance }) {
    let [ hidden, setHidden ] = useState(true);
    let [ modal, setModal ] = useState(false);
    let [ id, setId ] = useState(null);

    let expand = ({ target }) => {
        let div = target.parentNode.childNodes[2];

        if( target.style.transform == 'rotate(0deg)') {
            target.style.transform = 'rotate(-90deg)'
            div.style.height = '0px';
        } else {
            target.style.transform = 'rotate(0deg)'
            div.style.height = '100px';
        }
    }

    let setWatchedById = async (id, seen, before = false) => {
        let method = seen ? "DELETE" : "POST";

        if(before) {
            let here = false;
            let beforeIds = episodes.slice(0).reverse().reduceRight((val, el) => {
                el.forEach(e => {
                    if(e.id == id) here = true;
                    else if(!e.id != id && !here) {
                        if(e.user.seen == seen) val.push(e.id);
                    }
                });
    
                return val;
            }, []);
    
            id = beforeIds.join(',') + ',' + id;
        }

        try {
            let options = {
                url: 'https://api.betaseries.com/episodes/watched',
                method,
                data: { id }
            }
            let res = await instance(options);
        } catch({ response }) {
            console.log(response)
        }
    }

    let toggleModal = (id) => {
        setModal(true);
        setId(id);
    }

    return (
        <>
            <button className={styles.show} onClick={() => setHidden(hidden ? false : true)}>Hide/Show</button>
            {modal && <Modal id={id} instance={instance} setModal={setModal} />}
            {episodes.map((season, i) => (
            <div key={`season ${i+1}`} className={styles.season}>
                <h2>Season {i+1}</h2>
                <img src='https://image.flaticon.com/icons/png/512/60/60781.png' className={styles.expand} alt='expand season' onClick={(e) => expand(e)} />
                <div>
                    {season.map((ep) => {
                        let seen = ep.user.seen;

                        return (
                            <>
                                <div key={ep.id} className={styles.episode_item} style={{display: seen ? hidden ? 'none' : 'flex' : 'flex'}}>
                                    <h4>{ep.code}</h4>
                                    <span className={styles.bubble} onClick={() => toggleModal(ep.id)}>💬</span>
                                    <span style={{color: seen ? "#9ACD32" : "grey"}} onClick={() => setWatchedById(ep.id, seen, true)} >⇧</span>
                                    <span style={{color: seen ? "#9ACD32" : "grey"}} onClick={() => setWatchedById(ep.id, seen)} >✓</span>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
            ))}
        </>
    )
}

let Modal = ({ id, instance, setModal }) => {
    let [ text, setText ] = useState('');

    let comment = async (id) => {
        console.log(id, text);

        try {
            let res = await instance.post('https://api.betaseries.com/comments/comment', {
                id,
                text,
                type: 'episode'
            })
            console.log(res);
            setModal(false);
        } catch (e) {
            console.log(e.response);
        }
    }

    let close = (e) => {
        if(e.nativeEvent.path.length == 9) setModal(false);
    }

    return (
        <div className={styles.modal} onClick={(e) => close(e)}>
            <div className={styles.modal_container}>
                <h3>Commenter cet épisode :</h3>
                <textarea rows={10} cols={35} onChange={(e) => setText(e.target.value)}></textarea>
                <button onClick={() => comment(id)}>Send</button>
            </div>
        </div>
    )
}