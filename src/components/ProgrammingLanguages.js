import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgrammingLanguages = () => {
    const [languages, setLanguages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/api/programming_language/programming_languages')
            .then(response => {
                setLanguages(response.data);
            })
            .catch(err => {
                console.error('Error fetching languages:', err);
                setError('Failed to fetch languages.');
            });
    }, []);

    return (
        <div>
            <h2>Programming Languages</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {languages.length ? (
                <ul>
                    {languages.map(language => (
                        <li key={language.id}>{language.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No programming languages found.</p>
            )}
        </div>
    );
};

export default ProgrammingLanguages;
