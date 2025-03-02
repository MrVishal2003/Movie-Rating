import PropTypes from 'prop-types';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import Button from './Button';
import { StarBorderOutlined, Star } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export default function Page(props) {
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [mediaData, setMediaData] = useState([]);
    const [page, setPage] = useState(1);
    const [loadMoreClicked, setLoadMoreClicked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('movie');
    const [expanded, setExpanded] = useState(false);

    const type = () => {
        if (selectedOption === 'all') {
            return 'All';
        }
        else if (selectedOption === 'movie' || selectedOption === 'tv') {
            return selectedOption === 'movie' ? 'Movie' : 'TV Series';
        }
        else {
            return 'All';
        }
    };

    const setApi = (title) => {
        if (title === 'Movie') {
            return 'https://api.themoviedb.org/3/genre/movie/list?api_key=4d515835e70ed91238de09e575d7d8b2';
        } else {
            return 'https://api.themoviedb.org/3/genre/tv/list?api_key=4d515835e70ed91238de09e575d7d8b2';
        }
    }


    useEffect(() => {
        // Fetch genres from API
        axios.get(setApi(props.title))
            .then(response => {
                const genreNames = response.data.genres.map(genre => ({ id: genre.id, name: genre.name, selected: false }));
                setGenres(genreNames);
            })
            .catch(error => console.error('Error fetching genres:', error));

        // Fetch languages from API
        axios.get('https://api.themoviedb.org/3/configuration/languages?api_key=4d515835e70ed91238de09e575d7d8b2')
            .then(response => {
                const filteredLanguages = response.data.filter(language =>
                    ['English', 'Hindi', 'French', 'Korean', 'Japanese', 'Gujarati', 'Spanish', 'Italian'].includes(language.english_name)
                );
                setLanguages(filteredLanguages);
            })
            .catch(error => console.error('Error fetching languages:', error));

        // Fetch movie data when the component mounts
        fetchMediaData();
    }, []);

    useEffect(() => {
        // Fetch movie data whenever selected genres or languages change
        fetchMediaData();
    }, [selectedGenres, selectedLanguages, page, selectedOption]);

    const fetchMediaData = () => {
        const genreIds = selectedGenres.filter(genre => genre.selected).map(genre => genre.id).join(',');
        const languageCodes = selectedLanguages.filter(language => language.selected).map(language => language.iso_639_1).join(',');

        const links = {
            "Movie": `https://api.themoviedb.org/3/discover/movie?api_key=4d515835e70ed91238de09e575d7d8b2&with_genres=${genreIds}&with_original_language=${languageCodes}&page=${page}`,
            "TV Series": `https://api.themoviedb.org/3/discover/tv?api_key=4d515835e70ed91238de09e575d7d8b2&include_adult=false&include_null_first_air_dates=false&with_genres=${genreIds}&with_original_language=${languageCodes}&page=${page}&sort_by=popularity.desc`,
            "Trending": `https://api.themoviedb.org/3/trending/${selectedOption}/day?api_key=4d515835e70ed91238de09e575d7d8b2&language=en-US&page=${page}`,
            "Top Rated": `https://api.themoviedb.org/3/${selectedOption}/top_rated?api_key=4d515835e70ed91238de09e575d7d8b2&language=en-US&page=${page}`
        };

        const api = links[props.title];

        // Fetch movie data from API based on selected genres and languages
        axios.get(api)
            .then(response => {
                if (loadMoreClicked && page !== 1) {
                    setMediaData(prevMediaData => [...prevMediaData, ...response.data.results]);
                } else {
                    setMediaData(response.data.results);
                }
            })
            .catch(error => console.error('Error fetching media data:', error));
    };

    const handleGenreClick = (index) => {
        const updatedGenres = [...genres];
        updatedGenres[index].selected = !updatedGenres[index].selected;
        setGenres(updatedGenres);
        setSelectedGenres(updatedGenres);
        setLoadMoreClicked(false);
        setPage(1);
    };

    const handleLanguageClick = (index) => {
        const updatedLanguages = [...languages];
        updatedLanguages[index].selected = !updatedLanguages[index].selected;
        setLanguages(updatedLanguages);
        setSelectedLanguages(updatedLanguages);
        setLoadMoreClicked(false);
        setPage(1);
    };

    const loadmore = () => {
        setPage(page1 => page1 + 1);
        setLoadMoreClicked(true);
    }

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setPage(1);
        setExpanded(false);
    };

    function handleType() {
        if (selectedOption == 'movie') {
            if (props.title == 'TV Series') {
                return 'tv'
            }
            return 'movie'
        }
        else if (selectedOption == 'tv') {
            return 'tv'
        }
        else {
            return props.title.toLowerCase()
        }
    }

    return (
        <>
            <div className='mx-[80px]'>
                <p className='text-[34px] mb-8'> Explore {props.title} </p>
                <div className="flex mb-8">
                    {["Movie", "TV Series"].includes(props.title) && (
                        <>
                            <div className='mr-4'>
                                <Accordion sx={{ backgroundColor: '#202020', color: 'white', width: '300px' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        Genre
                                    </AccordionSummary>
                                    <AccordionDetails style={{ height: 'auto', overflowY: 'auto' }}>
                                        <ul className='flex flex-wrap justify-center'>
                                            {genres.map((genre, index) => (
                                                <li key={index} className='mr-2 mb-2' onClick={() => handleGenreClick(index)}>
                                                    <Button name={genre.name} fit="fit"
                                                        bgColor={genre.selected ? 'yellow_default' : 'transparent'}
                                                        textColor={genre.selected ? 'black' : 'yellow_default'}
                                                        borderColor='yellow_default'>
                                                        {genre.name}
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>
                            </div><div className='mr-4'>
                                <Accordion sx={{ backgroundColor: '#202020', color: 'white', width: '300px' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        Language
                                    </AccordionSummary>
                                    <AccordionDetails style={{ height: 'auto', overflowY: 'auto' }}>
                                        <ul className='flex flex-wrap justify-center'>
                                            {languages.map((language, index) => (
                                                <li key={index} className='mr-2 mb-2' onClick={() => handleLanguageClick(index)}>
                                                    <Button name={language.english_name} fit="fit"
                                                        bgColor={language.selected ? 'yellow_default' : 'transparent'}
                                                        textColor={language.selected ? 'black' : 'yellow_default'}
                                                        borderColor='yellow_default'>
                                                        {language.english_name}
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </>
                    )}

                    {["Trending", "Top Rated"].includes(props.title) && (
                        <>
                            <div className='mr-4'>
                                <Accordion sx={{ backgroundColor: '#202020', color: 'white', width: '300px' }} expanded={expanded} onChange={() => setExpanded(!expanded)}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white', cursor: 'pointer' }} />}>
                                        {type()}
                                    </AccordionSummary>
                                    {["Trending"].includes(props.title) && (
                                        <AccordionDetails style={{ height: 'auto', overflowY: 'auto', cursor: 'pointer' }}>
                                            <div onClick={() => handleOptionClick('all')}>All</div>
                                        </AccordionDetails>
                                    )}
                                    <AccordionDetails style={{ height: 'auto', overflowY: 'auto', cursor: 'pointer' }}>
                                        <div onClick={() => handleOptionClick('movie')}>Movies</div>
                                    </AccordionDetails>
                                    <AccordionDetails style={{ height: 'auto', overflowY: 'auto', cursor: 'pointer' }}>
                                        <div onClick={() => handleOptionClick('tv')}>TV Series</div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </>
                    )}

                </div>

                <div className="grid grid-cols-7 gap-6">
                    {mediaData.map(media => (
                        <NavLink key={media.id} to={`/${media.media_type ? media.media_type : handleType()}/${media.id}`}>
                            <div className='relative w-[200px]'>
                                <img className='h-[290px] w-full object-cover object-top rounded-tr-md rounded-tl-md' src={`https://image.tmdb.org/t/p/original/${media.poster_path}`} alt={media.title} />
                                <div className="h-[100px] w-full bg-gray_default rounded-bl-md rounded-br-md p-2 text-white flex flex-col">
                                    <div className="flex items-center mb-1">
                                        <Star className="text-yellow-500 mr-1" />
                                        <span className="text-sm mr-1">{media.vote_average.toFixed(1)}</span>
                                        <StarBorderOutlined className="text-blue-500 ml-auto" />
                                    </div>
                                    <p className="text-md font-bold">{media.title || media.name}</p>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div onClick={loadmore} className='flex justify-center my-5'>
                <Button name="Load More" bgColor='yellow_default' textColor='black' />
            </div>
        </>
    );
}

Page.propTypes = {
    title: PropTypes.string.isRequired,
};
