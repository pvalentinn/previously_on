import App_N from 'next/app'
import Head from 'next/head';
import axios from 'axios';
import Cookies from 'cookies';

export let instance = axios.create({
	headers: {
		"X-BetaSeries-Key": process.env.NEXT_PUBLIC_API_KEY
	},
});

export default function App({ Component, pageProps }) {
	let { user } = pageProps;

	instance.defaults.headers.Authorization = user && "Bearer " + user.token;
	pageProps.instance = instance;

	return (
		<>
			<Head>
				<link href="/globals.css" rel="stylesheet"></link>
            </Head>
			<Component {...pageProps} />
		</>
	)
}

App.getInitialProps = async (initial) => {
	let { ctx: { req, res } } = initial;
	const cookies = new Cookies(req, res);
	const appProps = await App_N.getInitialProps(initial);
	
	try {
		let user = await JSON.parse(cookies.get('user'));
		instance.defaults.headers.Authorization = "Bearer " + user.token;
		
		initial.ctx.res.user = user;
		initial.ctx.res.instance = instance;
		appProps.pageProps.user = user;
	} catch(e) {
		initial.ctx.res.user = null;
	}
	return { ...appProps }
}