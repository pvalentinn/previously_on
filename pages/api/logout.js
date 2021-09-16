import Cookies from 'cookies';
import { instance } from '../_app';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({
            error: "Method not allowed."
        })
    } else {
        let cookies = new Cookies(req, res);
        let token;
        
        try {
            ({ token } = await JSON.parse(cookies.get('user')));
        } catch(e) {
            return res.status(400).send({
                error: "No token passed!"
            })
        }

        try {
            await instance.post('https://api.betaseries.com/members/destroy', {}, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            cookies.set('user');
        } catch(e) {
            console.log(e.response);
            return res.status(400).send({ error: "destroy error" });
        }

        return res.status(200).send({ error: false, data: "Logged out successfully" });
    }
}
  