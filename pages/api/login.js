import Cookies from 'cookies';
import { instance } from '../_app';

export default async function handler(req, res, a) {
    if (req.method !== 'POST') {
        return res.status(405).send({
            error: "Method not allowed."
        })
    } else {
        try {
            let data = req.body;
            let cookies = new Cookies(req, res);

            let { data: { token } } = await instance.post('https://api.betaseries.com/members/auth', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let { data: { member } } = await instance.get('https://api.betaseries.com/members/infos', {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            cookies.set('user', JSON.stringify({ id: member.id, token, login: member.login }));   
                 
            return res.status(200).send({ error: false, data: member });
        } catch({ response }) {
            return res.status(400).send({
                error: response.data.errors
            })
        }
    }
}
  