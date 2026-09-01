// api/search.mjs
import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Queries an open, non-blocked text meta-aggregator routing system
        const searchUrl = `https://duckduckgo.com{encodeURIComponent(q + " media file")}`;
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Basic clean regex extraction parsing links directly out of the raw response page
        const html = response.data;
        const linkRegex = /<a class="result__url" href="([^"]+)"/g;
        const titleRegex = /<a class="result__snip"[^>]*>([\s\S]*?)<\/a>/g;
        
        let results = [];
        let match;
        
        // Gathers the raw target anchor locations discovered across the web
        while ((match = linkRegex.exec(html)) !== null && results.length < 10) {
            let directUrl = match[1];
            if (directUrl.includes('//://duckduckgo.com')) {
                directUrl = decodeURIComponent(directUrl.split('uddg=')[1]);
            }
            results.push({
                title: `Source Link Asset #${results.length + 1}`,
                url: directUrl
            });
        }

        if (results.length === 0) {
            // Fallback layout if parsing delays occur
            results.push({ title: `Search Result: ${q} Asset`, url: `https://archive.org{encodeURIComponent(q)}` });
        }

        return res.status(200).json({ results });
    } catch (error) {
        console.error("Search Engine Error:", error.message);
        return res.status(500).json({ error: 'Failed to fetch open web results' });
    }
}
