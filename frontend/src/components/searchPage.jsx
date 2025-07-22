import React, { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import '../App.css';

const Search = () => {
    const [query, setQuery] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 20;
    const handleSearch = async (newPage = 1) => {

        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/search?q=${query}&page=${newPage}&limit=${limit}`);
            console.log(res.data.data)
            console.log("Page: ", newPage, page)
            setProfiles(res.data.data);
            setPage(newPage)
        } catch (error) {
            console.log(error);
            console.log("Error");
        }
        setLoading(false);
    }
    const handleNext = () => handleSearch(page + 1);
    const handleBack = () => {
        if (page > 1) handleSearch(page - 1);
    };

    return (
        <div className="main-div">
            <div className="search">
                <input type="text" placeholder="Search..." className="search-input" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                <button className="search-button" onClick={() => handleSearch(1)}>Search</button>
            </div>

            {loading ? (
                <div className="loading">
                    <CircularProgress />
                </div>
            ) : (
                <div className="results-container"> {/* Added a container for the table */}
                    {
                        <table> {/* New table element */}
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Job</th>
                                    <th>Skills</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile._id}> {/* Each profile is a table row */}
                                        <td>{profile.first_name} {profile.last_name}</td>
                                        <td>{profile.job}</td>
                                        <td>{profile.skills?.join(", ")}</td>
                                        <td>{profile.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            )}

            <div className="pagination">
                <button onClick={handleBack} disabled={page === 1}>
                    Back
                </button>
                <button onClick={handleNext} disabled={profiles.length < limit}>Next</button>
            </div>
        </div>
    )
}

export default Search;