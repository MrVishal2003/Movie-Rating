import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { NavLink, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function Navbar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleToggleSearch = () => {
        setIsExpanded(!isExpanded);
    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleOutsideClick = (event) => {
        if (!event.target.closest('.search-container')) {
            setIsExpanded(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            axios.get(`https://api.themoviedb.org/3/search/multi?query=${searchQuery}&api_key=4d515835e70ed91238de09e575d7d8b2`)
                .then(response => {
                    setSearchResults(response.data.results);
                })
                .catch(error => console.error('Error fetching search results:', error));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <nav className="h-[100px] w-full bg-black flex items-center justify-between px-20 py-10 mb-[30px] sticky top-0 z-10">
            <div className="flex items-center">
                <div className="mr-[36px] font-bold">MovieSaga</div>
                <ul className="flex space-x-[36px]">
                    <li>
                        <NavLink to="/" activeclassname="active" className="p-1">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/movies" activeclassname="active" className="p-1">
                            Movies
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tv-series" activeclassname="active" className="p-1">
                            TV Series
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/trending" activeclassname="active" className="p-1">
                            Trending
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/top-rated" activeclassname="active" className="p-1">
                            Top Rated
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="flex items-center relative search-container">
                <div>
                    {isExpanded && (
                        <>
                            <input
                                placeholder='Search'
                                className={`bg-black text-white border-b-2 pb-1 border-yellow_default focus:outline-none`}
                                value={searchQuery}
                                onChange={handleInputChange}
                            />
                            {searchResults.length > 0 && (
                                <div className="search-results rounded absolute mt-2 p-2 w-full h-auto overflow-y-auto bg-gray_default" style={{ zIndex: 100 }}>
                                    <div className=''>
                                        <ul>
                                            {searchResults
                                                .filter(result => (result?.media_type === 'movie' || result?.media_type === 'tv') && result?.poster_path !== null && result?.profile_path !== null)
                                                .slice(0, 4)
                                                .map((result) => (
                                                    <Link to={`${result.media_type}/${result.id}`} key={result.id}>
                                                        <div className='flex'>
                                                            <div className='mr-4 mb-4'>
                                                                <img className='h-[80px] w-full object-cover rounded-md' src={`https://image.tmdb.org/t/p/original/${result.poster_path}`} alt={result.title || result.name} />
                                                            </div>
                                                            <div>
                                                                <li>{result.title || result.name}</li>
                                                                <li>{result.vote_average ? result.vote_average.toFixed(1) : 'NA'}</li>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <IconButton onClick={handleToggleSearch}>
                    <SearchIcon className="text-white mr-10" />
                </IconButton>
                <li className='list-none'>
                    {isLoggedIn ? (
                        <NavLink to="/" onClick={handleLogout} activeclassname="active" className="p-1">
                            Sign Out
                        </NavLink>
                    ) : (
                        <NavLink to="/signin" activeclassname="active" className="p-1">
                            Sign In
                        </NavLink>
                    )}
                </li>
            </div>
        </nav>
    );
}

export default Navbar;
