import { Account, Client, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('666cb2b6002f3da2d7c3'); 

const account = new Account(client);

export default async function handler(req, res) {
    console.log("Received request method:", req.method);
    console.log("Received request body:", req.body);
  
    try {
      if (req.method === 'POST') {
        const { userID, email, password, name } = req.body;
        if (!email || !password || !name) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }
  
        // Create user account
        const promise = await account.create(ID.unique(), email, password, name);
        res.status(201).json(promise);
      } else if (req.method === 'GET') {
        // Get current user account
        const currentAccount = await account.get();
        res.status(200).json(currentAccount);
      } else if (req.method === 'DELETE') {
        const { sessionID } = req.body;
        if (!sessionID) {
          res.status(400).json({ error: 'Missing sessionID' });
          return;
        }
  
        // Delete user session
        await account.deleteSession(sessionID);
        res.status(204).end();
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  