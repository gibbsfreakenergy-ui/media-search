// api/search.mjs
import { search, SafeSearchType } from 'duck-duck-scrape';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // SafeSearchType.MODERATE is the exact required property type layout
        const searchResults = await search(q, {
            safeSearch: SafeSearchType.MODERATE
        });

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
