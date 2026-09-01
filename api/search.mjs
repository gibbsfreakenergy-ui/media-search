// api/search.mjs
import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    // Strips out any accidental spaces directly in the code logic
    const API_KEY = process.env.GOOGLE_SEARCH_API_KEY ? process.env.GOOGLE_SEARCH_API_KEY.trim() : ''; 
    const CX_ID = process.env.GOOGLE_SEARCH_CX_ID ? process.env.GOOGLE_SEARCH_CX_ID.trim() : ''; 

    try {
        // Assembles a raw string directly to prevent internal library auto-encoding mismatches
        const googleUrl = "https://googleapis.com" + API_KEY + "&cx=" + CX_ID + "&q=" + encodeURIComponent(q);
        
        const response = await axios.get(googleUrl);
        const items = response.data.items || [];

        const results = items.map(item => ({
            title: item.title,
            url: item.link
        }));

        return res.status(200).json({ results });
    } catch (error) {
        // Logs the detailed response payload from Google
        console.error("Google Error:", error.response?.data || error.message);
        return res.status(500).json({ error: 'Search failed to contact Google API' });
    }
}
