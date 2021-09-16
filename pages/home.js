import Head from 'next/head';
import { Header, List } from "../components";

export default function Home({ shows, user, instance }) {

    return (
        <>
            <Head>
                <title>Previously - Home</title>
            </Head>
            <Header user={user} instance={instance} />
            <List user={user} data={shows} instance={instance} />
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

    let url = 'https://api.betaseries.com/shows/discover';
    let { data: { shows } } = await instance.get(url);

    return {
        props: {
            shows
        }
    }
}