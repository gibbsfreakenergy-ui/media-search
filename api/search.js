// api/search.js
import axios from 'axios';

export default async function handler(req, res) {
    // 1. Allow the frontend to talk to this endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    // 2. Safely pull your keys from Vercel's Environment Variables
    const API_KEY = process.env.GOOGLE_SEARCH_API_KEY; 
    const CX_ID = process.env.GOOGLE_SEARCH_CX_ID; 

    try {
        // 3. Ask Google to search the target media sites you set up
        const googleUrl = `https://googleapis.com{API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(q)}`;
        const response = await axios.get(googleUrl);
        
        const items = response.data.items || [];

        // 4. Map the results into a clean list of titles and page links
        const results = items.map(item => ({
            title: item.title,
            url: item.link
        }));

        return res.status(200).json({ results });
    } catch (error) {
        console.error("Search error details:", error.response?.data || error.message);
        return res.status(500).json({ error: 'Search failed to contact Google API' });
    }
}
