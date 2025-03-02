import { Facebook, Google, Twitter, YouTube } from '@mui/icons-material';


export default function Footer() {
    return (
        <div className=" mt-[100px] text-center">
            <div className="text-[50px] font-bold mb-[25px]">
                MovieSaga
            </div>
            <p className="text-[18px] mb-[80px]">“ Welcome to MovieSaga, your spot for movies and TV shows! Love films? Hate them?<br />
                Share your thoughts and see what others think. Get ratings, find new favorites, and trending. <br />
                It&apos;s easy and fun. Join us and let&apos;s talk movies! ”</p>
            <div className='mb-[80px]'>
                <Facebook className='mr-4' style={{ fontSize: "40px" }} />
                <Google className='mr-4' style={{ fontSize: "40px" }} />
                <Twitter className='mr-4' style={{ fontSize: "40px" }} />
                <YouTube className='mr-4' style={{ fontSize: "40px" }} />
            </div>
            <div className='pb-4'>
                <p>© Movie Saga. All rights reserved.</p>
            </div>
        </div>
    )
}
