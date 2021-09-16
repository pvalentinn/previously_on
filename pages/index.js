export default function Index() {

	return <></>
}

// export async function getStaticProps({ req, res }) {
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
		redirect: {
			destination: '/login',
			permanent: false
		}
	}
}