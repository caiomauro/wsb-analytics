import { useState, useEffect } from "react";
import BottomHeader from "../Components/BottomHeader";
import Navbar from "../Components/Navbar";
import { Navigate } from "react-router-dom";


function HomePage(){
    const [data, setData] = useState([]);

    const fetchData = (count: number) => {
        fetch(`http://127.0.0.1:8000/api/stock-sentiments/?count=${count}`)  // Use backticks for template literals
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.stock_sentiments);
                setData(data.stock_sentiments);
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            });
    };

    useEffect(() => {
        // Get the text element after component is mounted
        const textElement: HTMLHeadingElement | null = document.getElementById("text") as HTMLHeadingElement;

        // Array of words to transform
        const words: string[] = [
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Think| Better",
            "Thin| Better",
            "Thi| Better",
            "Th| Better",
            "T| Better",
            "| Better",
            "| Better",
            "B| Better",
            "Bu| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Buy| Better",
            "Bu| Better",
            "B| Better",
            "| Better",
            "| Better",
            "L| Better",
            "Li| Better",
            "Liv| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Live| Better",
            "Liv| Better",
            "Li| Better",
            "L| Better",
            "| Better",
            "| Better",
            "T| Better",
            "Th| Better",
            "Thi| Better",
            "Thin| Better",
        ];
        

        // Function to animate text
        function animateText(index: number): void {
            // Update text content
            if (textElement) {
                textElement.textContent = words[index];
            }

            // Increment index
            index++;

            if (index >= words.length) {
                // Reset index to 0
                index = 0;
            }
            // Schedule next animation
            setTimeout(() => {
                animateText(index);
            }, 100);

        }

        // Start animation
        animateText(0);
    }, []);

    return(
        <div className="flex flex-col w-full h-screen custom-background-img-mobile sm:custom-background-img-desktop">
            <Navbar />
            <div id="home-container" className="flex flex-col items-center pt-36">
            <div id="animation-container" className="flex flex-row justify-center mx-10 ">
                <div className="flex flex-col items-center w-3/6">
                    <h1 className="text-2xl pb-2">Welcome to the future of trading </h1> <h1 id="text" className="text-7xl pb-32 text-blue-500">Live Better</h1>
                    <div id="button-container">
                        <a className="bg-blue-800 hover:bg-blue-500 active:bg-blue-500 text-2xl text-white p-3 rounded-2xl drop-shadow-2xl" href="/analytics">See the data</a>
                    </div>
                </div>
                <div id="text-container" className="w-5/6 sm:w-2/6">
                    <h1 className="font-bold italic text-2xl">Analysis.</h1>
                    <h1 className="font-light text-justify pb-3 text-xl indent-12">For <span className="text-blue-500 text-9xl">big</span> ballas</h1>
                    <h1 className="font-bold italic text-2xl text-blue-500">Visualization.</h1>
                    <h1 className="font-light text-justify text-xl indent-12">Elevate your trading strategy with WSB Analytics, where intuitive graphs provide effortless data interpretation. Our cutting-edge tools harness the power of a state-of-the-art Language Model (LLM), finely tuned for unparalleled accuracy. Dive into detailed visual representations that streamline your analysis, allowing you to grasp complex market trends with ease. With WSB Analytics, stay ahead of the curve and make informed investment decisions backed by robust data and advanced technology.</h1>
                </div>
            </div>
            </div>
            <BottomHeader />
        </div>
    )
}

export default HomePage