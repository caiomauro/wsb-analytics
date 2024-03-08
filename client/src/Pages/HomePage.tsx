import { useState } from "react";
import Navbar from "../Components/Navbar";

function HomePage(){
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetch('http://127.0.0.1:8000/api/stock-sentiments/')  // Replace '/stock-sentiments/' with your actual endpoint URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response);
                return response.json();
            })
            .then(data => {
                setData(data.stock_sentiments);
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            });
    };

    return(
        <div className="w-full h-screen custom-background-img-mobile sm:custom-background-img-desktop">
            <Navbar />
            <div id="home-container" className="flex flex-col items-center pt-10">
                <div id="button-container" className="pb-10">
                    <button className="bg-white hover:bg-white/80 active:bg-white text-black font-bold italic p-2 rounded-md shadow-lg" onClick={fetchData}><p className=" rounded-lg shadow-lg">See the data</p></button>
                </div>
                <div id="text-container" className="w-5/6 sm:w-2/6">
                    <h1 className="font-bold italic">Analysis.</h1>
                    <h1 className="font-light text-justify">...Enhance your trading edge with WSB Analytics, your premier destination for comprehensive insights into the WSB subreddit. Gain a competitive advantage by accessing data on promising stocks poised for significant gains. Instantly detect red flags for investments trending downwards, empowering informed decision-making for your portfolio.</h1>
                    <h1 className="font-bold italic">Visualization.</h1>
                    <h1 className="font-light text-justify">...Elevate your trading strategy with WSB Analytics, where intuitive graphs provide effortless data interpretation. Our cutting-edge tools harness the power of a state-of-the-art Language Model (LLM), finely tuned for unparalleled accuracy. Dive into detailed visual representations that streamline your analysis, allowing you to grasp complex market trends with ease. With WSB Analytics, stay ahead of the curve and make informed investment decisions backed by robust data and advanced technology.</h1>
                </div>
                <div>{data}</div>
            </div>
        </div>
    )
}

export default HomePage