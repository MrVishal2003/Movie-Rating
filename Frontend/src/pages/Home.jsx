import Footer from "../components/Footer";
import SlickSlider from "../components/SlickSlider";
import Slider from "../components/Slider";
import Videos from "../components/videos";

function Home() {
    return (
        <>
            <div>
                <Slider />
                <SlickSlider title='Now Playing' />
                <SlickSlider title='Top Rated' />
                <Videos title='Upcoming' />
                <Footer />
            </div>
        </>
    );
}

export default Home;
