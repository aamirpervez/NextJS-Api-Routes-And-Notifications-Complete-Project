import { connectDatabase, insertDocument } from '../../helpers/api-util';
async function handler(req, res) {

    if (req.method === 'POST') {

        const email = req.body.email;

        if (!email || !email.includes('@')) {
            res.status(422).json({ message: 'Invalid email address.' })
            return;
        }

        let client;

        try {
            client = await connectDatabase();
        }
        catch (error) {
            res.status(500).json({ message: 'Connecting to the database failed.' + error });
            return;
        }

        try {
            await insertDocument(client, 'newsletter', { email: email });
            client.close();
        }
        catch (error) {
            res.status(500).json({ message: 'Inserting newsletter failed.' })
            return;
        }

        res.status(201).json({ message: 'Successfully Signed Up.' })
    }
}

export default handler;