import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import '../App.css';

const Search = () => {
    const [query, setQuery] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    const handleSearch = async (newPage = 1) => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/search?q=${query}&page=${newPage}&limit=${limit}`);
            const { data, totalPages } = res.data;
            console.log(res.data)
            setProfiles(data);
            setPage(newPage);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Search error:", error);
        }
        setLoading(false);
    };

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

    const handleNext = () => {
        if (page < totalPages) handleSearch(page + 1);
    };

    const handleBack = () => {
        if (page > 1) handleSearch(page - 1);
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
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(1)}
                />
                <button className="search-button" onClick={() => handleSearch(1)}>Search</button>
            </div>

            {loading ? (
                <div className="loading">
                    <CircularProgress />
                </div>
            ) : (
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
                                    <td>{profile.first_name} {profile.last_name}</td>
                                    <td>{profile.job}</td>
                                    <td>{profile.skills?.join(", ")}</td>
                                    <td>{profile.location}</td>
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
        </div>
    );
};

export default Search;
