import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import Footer from "../components/Footer";
import { Star } from "@mui/icons-material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';

function ShowMore() {
    const { mediaType, id } = useParams();
    const [content, setContent] = useState(() => {
        const savedContent = localStorage.getItem('content');
        return savedContent ? JSON.parse(savedContent) : {};
    });
    const [year, setYear] = useState('');
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [trailerKey, setTrailerKey] = useState('');
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('userId');
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!loggedIn) {
            navigate('/signin');
        }
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:3000/ratings', {
            params: {
                mediaId: id
            }
        })
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => console.error('Error fetching reviews:', error));
    }, [id]);

    // useEffect(() => {
    //     axios.get('http://localhost:3000/userdata')
    //         .then(response => {
    //             const userData = response.data;
    //             const user = userData.find(user => user.username === username);
    //             if (user) {
    //                 setUsername(user.username);
    //                 setUserId(user.userId);
    //             }
    //         })
    //         .catch(error => console.error('Error fetching user data:', error));
    // }, [username]);

    // Save content and username and userId to localStorage
    useEffect(() => {
        localStorage.setItem('content', JSON.stringify(content));
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
    }, [content, username, userId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRate = async () => {
        try {
            const currentDate = new Date();
            const currentDay = `${currentDate.getDate()}`;
            const currentMonth = `${currentDate.toLocaleString('default', { month: 'long' })}`;
            const currentYear = `${currentDate.getFullYear()}`;

            await axios.post('http://localhost:3000/showmore', {
                userId: userId,
                username: username,
                rating: rating,
                moviename: content.name || content.title,
                comment: comment,
                mediaType: mediaType,
                mediaId: id,
                day: currentDay,
                month: currentMonth,
                year: currentYear
            });

            const response = await axios.get(`http://localhost:3000/ratings?mediaId=${id}`);
            setReviews(response.data);

            handleClose();
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    useEffect(() => {
        const apiUrl = mediaType === 'movie'
            ? `https://api.themoviedb.org/3/movie/${id}?api_key=4d515835e70ed91238de09e575d7d8b2`
            : `https://api.themoviedb.org/3/tv/${id}?api_key=4d515835e70ed91238de09e575d7d8b2`;
        const castUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=4d515835e70ed91238de09e575d7d8b2&language=en-US`;
        const videoUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=4d515835e70ed91238de09e575d7d8b2&language=en-US`;

        axios.get(apiUrl)
            .then(response => {
                setContent(response.data);
                const releaseDate = response.data.first_air_date || response.data.release_date;
                if (releaseDate) {
                    const year = new Date(releaseDate).getFullYear();
                    setYear(year);
                }
            })
            .catch(error => console.error('Error fetching media details:', error));

        axios.get(castUrl)
            .then(response => {
                setCrew(response.data.crew);
                setCast(response.data.cast.slice(0, 7));
            })
            .catch(error => console.error('Error fetching credits:', error));

        axios.get(videoUrl)
            .then(response => {
                const foundOfficialTrailer = response.data.results.find(item => (
                    item.type === "Trailer" &&
                    item.site === "YouTube" &&
                    item.official === true
                ));
                if (foundOfficialTrailer) {
                    setTrailerKey(foundOfficialTrailer.key);
                }
            })
            .catch(error => console.error('Error fetching trailer:', error));
    }, [id, mediaType]);

    return (
        <>
            <div className='mx-[200px]'>
                <div className="flex justify-between items-start">
                    <div className="mb-5">
                        <div className="mb-4 text-[26px] font-bold">{mediaType === 'movie' ? content.title : content.name}</div>
                        <div className="text-gray-400">
                            <ul className="flex">
                                <li className="mr-3">{year}</li>
                                <li className="mr-3">|</li>
                                <li>{(content.episode_run_time || content.runtime) != "" ? (content.episode_run_time || content.runtime) + ' min' : "NA min"}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="text-[32px]">
                            <ul className="flex">
                                <li><Star className="text-yellow-500 pb-2" style={{ fontSize: "40px" }} /></li>
                                <li>{content.vote_average ? content.vote_average.toFixed(1) : 'NA'}</li>
                                <li><span className="text-[20px] text-gray-400 mr-6">/10</span></li>
                                <div className='cursor-pointer flex' onClick={handleClickOpen}>
                                    <li><StarBorderOutlinedIcon className="text-blue-500 ml-auto" /></li>
                                    <li><span className="text-blue-500 text-[20px]">Rate</span></li>
                                </div>

                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Rate the Movie</DialogTitle>
                                    <DialogContent>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            {[...Array(10)].map((_, index) => (
                                                <IconButton key={index} onClick={() => handleStarClick(index)}>
                                                    {index < rating ? <StarIcon color="primary" /> : <StarBorderOutlinedIcon />}
                                                </IconButton>
                                            ))}
                                        </div>
                                        <Typography align="center" variant="subtitle1">
                                            {rating === 0 ? 'Please select a rating' : `You rated: ${rating} out of 10`}
                                        </Typography>
                                        <input
                                            type="text"
                                            value={comment}
                                            onChange={handleCommentChange}
                                            placeholder="Add your comment (optional)"
                                            className="bg-gray-100 w-full px-3 py-2 mt-4 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </DialogContent>
                                    <div className='flex justify-center mb-6' onClick={handleRate}>
                                        <button type="submit" className="bg-blue-600 text-white h-[33px] w-[160px] font-bold rounded-[4px] flex justify-center items-center">
                                            Submit
                                        </button>
                                    </div>
                                </Dialog>

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex mb-[30px]">
                    <img className='h-[480px] w-[340px] object-cover object-top rounded-lg mr-[40px]' src={`https://image.tmdb.org/t/p/original/${content.poster_path}`} alt="Poster" />
                    {trailerKey ? (
                        <iframe className='h-[480px] w-[100%] object-cover object-top rounded-lg' src={`https://www.youtube.com/embed/${trailerKey}`} title="Trailer" allowFullScreen></iframe>
                    ) : (
                        <img className='h-[480px] w-[100%] object-cover object-top rounded-lg' src={`https://image.tmdb.org/t/p/original/${content.backdrop_path}`} alt="Backdrop" />
                    )}
                </div>
                <div>
                    <div className="mb-4 flex gap-2">
                        {content.genres?.map(genre => (
                            <Button key={genre} name={genre.name} bgColor='transparent' textColor='yellow_default' borderColor='yellow_default' fit='fit' />
                        ))}
                    </div>
                </div>
                <div className='flex'>
                    <div className='w-[75%]'>
                        <div>
                            <div className='font-bold text-[20px]'>
                                Overview :
                            </div>
                            <div className="mb-16">
                                {content.overview}
                            </div>
                            <div>
                                <hr />
                                <div className='flex text-[15px] my-2'>
                                    <div className='font-bold mr-4'>
                                        Director:
                                    </div>
                                    <div>
                                        {crew.find(member => member.known_for_department === 'Directing')?.name || "NA"}
                                    </div>
                                </div>
                                <hr />
                                <div className='flex text-[15px] my-2'>
                                    <div className='font-bold mr-4'>
                                        Cast :
                                    </div>
                                    <div>
                                        <ul className="flex">
                                            {cast.map(actor => (
                                                <li key={actor.id} className="mr-4 text-blue-600">{actor.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <hr />
                                <div className='flex text-[15px] my-2'>
                                    <div className='font-bold mr-4'>
                                        Tag Line :
                                    </div>
                                    <div>
                                        {content.tagline || "NA"}
                                    </div>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col pl-[60px] ml-[60px] border-l-2 pb-1 space-y-4'>
                        <div>
                            <div className='font-bold text-[17px]'>
                                Status
                            </div>
                            <div className='text-blue-600 text-[15px]'>
                                {content.status}
                            </div>
                        </div>
                        <div>
                            <div className='font-bold text-[17px]'>
                                Original Language
                            </div>
                            <div className='text-blue-600 text-[15px]'>
                                {content.original_language}
                            </div>
                        </div>
                        {mediaType === 'tv' && (
                            <>
                                <div>
                                    <div className='font-bold text-[17px]'>
                                        Total Seasons
                                    </div>
                                    <div className='text-blue-600 text-[15px]'>
                                        {content.number_of_seasons}
                                    </div>
                                </div>
                                <div>
                                    <div className='font-bold text-[17px]'>
                                        Total Episodes
                                    </div>
                                    <div className='text-blue-600 text-[15px]'>
                                        {content.number_of_episodes}
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <div className='font-bold text-[17px]'>
                                Release Date
                            </div>
                            <div className='text-blue-600 text-[15px]'>
                                {content.release_date || content.first_air_date}
                            </div>
                        </div>
                        <div>
                            <div className='font-bold text-[17px]'>
                                Runtime
                            </div>
                            <div className='text-blue-600 text-[15px]'>
                                {(content.episode_run_time || content.runtime) != "" ? (content.episode_run_time || content.runtime) + ' min' : "NA min"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='relative  w-[75%] mt-10'>
                    <div className='flex items-center mb-10'>
                        <div className="bottom-0 left-0 p-2 border-l-4 border-yellow_default flex items-center">
                            <span className="ml-2 mr-1 font-bold text-[23px]">Reviews</span>
                            <ArrowForwardIosIcon sx={{ fontSize: "26px" }} className="arrow" />
                        </div>
                    </div>
                    {reviews.map(review => (
                        <div className='mb-5 ' key={review._id}>
                            <div className='flex'>
                                <div className={`p-6 bg-orange-500 h-[50px] w-[50px] text-center flex items-center justify-center rounded-full mr-4`}>
                                    {review.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className='font-bold text-[17px]'>
                                        {review.username}
                                    </div>
                                    <div className='text-[14px] text-gray-400 mb-3'>
                                        {`${review.day} ${review.month}, ${review.year}`}
                                    </div>
                                </div>
                            </div>
                            <div className='flex mb-3'>
                                {[...Array(10)].map((_, index) => (
                                    <Star key={index} className={index < review.rating ? "text-yellow-500" : "text-gray-400"} />
                                ))}
                            </div>
                            <div>
                                {review.comment}
                                <hr />
                            </div>
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
        </>
    );
}

export default ShowMore;