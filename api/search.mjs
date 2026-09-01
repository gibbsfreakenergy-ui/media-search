// api/search.mjs
import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    const API_KEY = process.env.GOOGLE_SEARCH_API_KEY ? process.env.GOOGLE_SEARCH_API_KEY.trim() : ''; 
    const CX_ID = process.env.GOOGLE_SEARCH_CX_ID ? process.env.GOOGLE_SEARCH_CX_ID.trim() : ''; 

    // DIAGNOSTIC CHECK: If Vercel is hiding your keys, this will instantly print in your Vercel logs
    if (!API_KEY || !CX_ID) {
        console.error("CRITICAL ERROR: Vercel is missing environment variables!");
        console.log("API_KEY Exists?", !!API_KEY, "CX_ID Exists?", !!CX_ID);
        return res.status(500).json({ error: 'Server environment configuration keys are missing inside Vercel.' });
    }

    try {
        const response = await axios.get("https://googleapis.com", {
            params: {
                key: API_KEY,
                cx: CX_ID,
                q: q
            }
        });
        
        const items = response.data.items || [];

        const results = items.map(item => ({
            title: item.title,
            url: item.link
        }));

        return res.status(200).json({ results });
    } catch (error) {
        console.error("Google Error:", error.response?.data || error.message);
        return res.status(500).json({ error: 'Search failed to contact Google API' });
    }
}
