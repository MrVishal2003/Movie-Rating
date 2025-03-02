import { useState, useEffect } from "react";
import { StarBorderOutlined, Star } from '@mui/icons-material';
import PropTypes from 'prop-types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

function SlickSlider(props) {
    const [content, setContent] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("tv");

    const setting = {
        dots: true,
        infinite: false,
        slidesToShow: 7,
        slidesToScroll: 5,
    }

    useEffect(() => {
        const links = {
            movie: {
                "Now Playing": "https://api.themoviedb.org/3/movie/now_playing?api_key=4d515835e70ed91238de09e575d7d8b2&region=IN",
                "Top Rated": "https://api.themoviedb.org/3/movie/top_rated?api_key=4d515835e70ed91238de09e575d7d8b2&region=IN"
            },
            tv: {
                "Now Playing": "https://api.themoviedb.org/3/tv/on_the_air?api_key=4d515835e70ed91238de09e575d7d8b2&language=en-US&page=1",
                "Top Rated": "https://api.themoviedb.org/3/tv/top_rated?api_key=4d515835e70ed91238de09e575d7d8b2&language=en-US&page=1"
            }
        };

        const api = links[selectedCategory][props.title];
        axios.get(api)
            .then(res => setContent(res.data.results))
            .catch(error => console.error("Error fetching movies:", error));
    }, [props.title, selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="relative">
            <div className="ml-[110px] bottom-0 left-0 p-2 border-l-4 border-yellow_default flex items-center">
                <span className="ml-2 mr-1 font-bold text-[23px]">{props.title}</span>
                <ArrowForwardIosIcon sx={{ fontSize: "26px" }} className="arrow" />

                <div className="absolute right-[105px] top-0 flex h-[33px]">
                    <button className={`focus:outline-none border-yellow_default text-md rounded-tl-md rounded-bl-md border-2 font-semibold w-[100px] ${selectedCategory === "movie" ? "bg-yellow_default text-black" : "bg-black text-yellow_default"}`} onClick={() => handleCategoryChange("movie")}>
                        MOVIE
                    </button>

                    <button className={`focus:outline-none border-yellow_default text-md rounded-tr-md rounded-br-md border-2 font-semibold w-[100px] ${selectedCategory === "tv" ? "bg-yellow_default text-black" : "bg-black text-yellow_default"}`} onClick={() => handleCategoryChange("tv")}>
                        TV SHOW
                    </button>
                </div>

            </div>
            <Slider {...setting} className="mx-[90px] mb-16">
                {content.map(media => (
                    <Link key={media.id} to={`/${selectedCategory}/${media.id}`}>
                        <div key={media.id} className='p-[20px] relative'>
                            <img className='h-[290px] w-full object-cover object-top rounded-tr-md rounded-tl-md' src={`https://image.tmdb.org/t/p/original/${media.poster_path}`} alt={media.original_title || media.original_name} />
                            <div className="h-[100px] w-full bg-gray_default rounded-bl-md rounded-br-md p-2 text-white flex flex-col">
                                <div className="flex items-center mb-1">
                                    <Star className="text-yellow-500 mr-1" />
                                    <span className="text-sm mr-1">{media.vote_average.toFixed(1)}</span>
                                    <StarBorderOutlined className="text-blue-500 ml-auto" />
                                </div>
                                <p className="text-md font-bold">{selectedCategory === 'movie' ? media.title : media.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </Slider>
        </div>
    );
}

SlickSlider.propTypes = {
    title: PropTypes.string.isRequired,
};

export default SlickSlider;
