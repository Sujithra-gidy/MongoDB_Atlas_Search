import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import '../App.css';

// Search feature
const Search = () => {
    const [query, setQuery] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    // function to perform the search operation 
    const handleSearch = async (newPage = 1) => {
        if (!query.trim()) return;
        const invalidData = /[$&<>{};'"\\]/;
        const validData = /^[a-zA-Z0-9\s\+\#\.]+$/;

        if (query && (invalidData.test(query) || !validData.test(query))) {
            console.log(query);
            toast.error("Invalid query");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/search?q=${query}&page=${newPage}&limit=${limit}`);
            const { data, totalPages } = res.data;
            console.log("Result ✅✅✅✅", res.data)
            setProfiles(data);
            setPage(newPage);
            setTotalPages(totalPages);
        } catch (error) {
            const message = error?.response?.data?.message || "Search failed. Please try again.";
            console.error("Search error: ❌", error);
            toast.error(message);
        }
        setLoading(false);
    };

    // function to retrieve all the data
    const handleProfile = async (newPage = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/profiles?page=${newPage}&limit=${limit}`);
            const { data, totalPages } = res.data;
            setProfiles(data);
            setPage(newPage)
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Profile fetch error:", error);
        }
        setLoading(false);
    };

    // function to clear the search
    const handleClear = (e) => {
        setQuery("");
        handleProfile(1);
    }

    // function for next button 
    const handleNext = () => {
        if (page < totalPages) handleSearch(page + 1);
    };

    // function fro back button 
    const handleBack = () => {
        if (page > 1) handleSearch(page - 1);
    };

    const getRegexFromQuery = (query) => {
        if (!query.trim()) return null;

        const words = query.trim().split(/\s+/);
        const escaped = words.map(word =>
            word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );
        const pattern = `(?<!\\w)(${escaped.join("|")})(?!\\w)`;
        return new RegExp(pattern, "gi");
    };

    const renderHighlightedText = (text, query) => {
        if (!query || !text) return text;

        const regex = getRegexFromQuery(query);
        const parts = text.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        );
    };

    const renderHighlightedArray = (array, query) => {
        if (!Array.isArray(array) || !query) return array.join(", ");

        const regex = getRegexFromQuery(query);

        return array.map((item, i) => {
            const isMatch = regex.test(item);
            return (
                <span key={i}>
                    {isMatch ? <mark>{item}</mark> : item}
                    {i !== array.length - 1 ? ", " : ""}
                </span>
            );
        });
    };




    useEffect(() => {
        handleProfile(1);
    }, []);

    return (
        <div className="main-div">

            <div className="search">

                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(1)}
                />

                <button className="search-button" onClick={() => handleSearch(1)} disabled={query === ""}>Search</button>
                <button className="search-button" onClick={(e) => handleClear(e)} disabled={query === ""}>Clear</button>

            </div>


            {loading ? (
                <div className="loading">
                    <CircularProgress />
                </div>
            ) : profiles.length === 0 ? <p>Seems like we have no data related to your search, try changing the keywords</p> : (
                <div className="results-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Job</th>
                                <th>Skills</th>
                                <th>Location</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile) => (
                                <tr key={profile._id}>
                                    <td>
                                        {renderHighlightedText(profile.first_name, query)}{" "}
                                        {renderHighlightedText(profile.last_name, query)}
                                    </td>


                                    <td>{renderHighlightedText(profile.job, query)}</td>
                                    <td>{renderHighlightedArray(profile.skills, query)}</td>
                                    <td>{renderHighlightedText(profile.location, query)}</td>

                                    <td>{profile.email_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination">

                <button onClick={handleBack} disabled={page === 1}>
                    Back
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={handleNext} disabled={page === totalPages}>
                    Next
                </button>

            </div>
            <Toaster />
        </div>

    );
};

export default Search;
