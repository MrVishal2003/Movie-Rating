import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from "react-slick";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';

function Videos({ title }) {
    const [movies, setMovies] = useState([]);

    const setting = {
        dots: true,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1
    }

    useEffect(() => {
        axios.get("https://api.themoviedb.org/3/movie/upcoming?api_key=4d515835e70ed91238de09e575d7d8b2&language=en-US&page=1")
            .then(res => {
                setMovies(res.data.results)
            })
            .catch(error => console.error("Error fetching movies:", error));
    }, []);

    return (
        <>
            <div className="relative">
                <div className="ml-[110px] bottom-0 left-0 p-2 border-l-4 border-yellow_default flex items-center">
                    <span className="ml-2 mr-1 font-bold text-[23px]">{title} Movies</span>
                    <ArrowForwardIosIcon sx={{ fontSize: "26px" }} className="arrow" />
                </div>
            </div>
            <Slider {...setting} className="mx-[90px] mb-16">
                {movies.map(movie => (
                    <div key={movie.id} className='p-[20px] relative'>
                        <MovieTrailers movieId={movie.id} originalTitle={movie.title} />
                    </div>
                ))}
            </Slider>
        </>
    );
}

Videos.propTypes = {
    title: PropTypes.string.isRequired,
};

function MovieTrailers({ movieId, originalTitle }) {
    const [trailer, setTrailer] = useState([]);
    const [play, setPlay] = useState(false);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=4d515835e70ed91238de09e575d7d8b2`)
            .then(res => res.json())
            .then(data => {
                if (data && data.results && data.results.length > 0) {
                    let foundOfficialTrailer = false;
                    const trailers = data.results.filter(item => {
                        if (
                            !foundOfficialTrailer &&
                            item.type === "Trailer" &&
                            item.site === "YouTube" &&
                            item.official === true &&
                            item.name.includes("Official") &&
                            item.name.includes("Trailer")
                        ) {
                            foundOfficialTrailer = true;
                            return true;
                        }
                        return false;
                    });
                    setTrailer(trailers);
                }
            })
            .catch(error => console.error(`Error fetching trailers for movie ${movieId}:`, error));
    }, [movieId]);

    const handlePlay = () => {
        setPlay(1);
    };

    const handleStop = () => {
        setPlay(0);
    };

    return (
        <>
            {trailer.map(video => (
                <div key={video.id} className='relative h-fit w-fit' >
                    <iframe
                        className='w-[400px] h-[250px] p-[25px] ' onMouseLeave={handleStop} onMouseEnter={handlePlay}
                        loading="lazy"
                        style={{ border: "none" }}
                        src={`https://www.youtube.com/embed/${video.key}?autoplay=${play}&mute=1&controls=0&showinfo=0&autohide=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <div className="bg-black bg-opacity-50 text-white p-2 rounded-b-md">
                        <p className="text-center font-semibold text-lg">{originalTitle}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

MovieTrailers.propTypes = {
    movieId: PropTypes.number.isRequired,
    originalTitle: PropTypes.string.isRequired
};

export default Videos;
