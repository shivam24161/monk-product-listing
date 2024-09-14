import React, { useState, useEffect } from 'react';
import useDebounce from '../../utility/useDebounce';
import { apiKey, apiUrl } from '../../constants/apiUrl';
import { TextField } from '@shopify/polaris';

function SearchComponent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const debouncedQuery = useDebounce(query, 500);
    
    useEffect(() => {
        if (debouncedQuery) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://stageapi.monkcommerce.app/task/products/search&limit=1', {
                        headers: {
                            'x-api-key': apiKey
                        }
                    });
                    const data = await response.json();
                    console.log(data, "checks")
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    return (
        <div>
            {/* <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            /> */}
            <TextField/>
            <ul>
                {results.map((result) => (
                    <li key={result.id}>{result.name}</li> // Adjust according to your data structure
                ))}
            </ul>
        </div>
    );
}

export default SearchComponent;
