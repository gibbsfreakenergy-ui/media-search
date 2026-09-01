// api/search.mjs
import { search } from 'duck-duck-scrape';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Searches the web for your query terms
        const searchResults = await search(q, {
            safeSearch: 'moderate'
        });

        // Maps the web search results into names and website addresses
        const results = searchResults.results.map(item => ({
            title: item.title,
            url: item.url
        }));

        return res.status(200).json({ results });
    } catch (error) {
        console.error("Search Engine Error:", error.message);
        return res.status(500).json({ error: 'Failed to fetch open web results' });
    }
}
