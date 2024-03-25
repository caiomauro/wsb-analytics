import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../Components/BottomHeader";
import Navbar from "../Components/Navbar";

function HomePage() {
  const navigate = useNavigate();


  useEffect(() => {
    // Get the text element after component is mounted
    const textElement: HTMLHeadingElement | null = document.getElementById(
      "text"
    ) as HTMLHeadingElement;

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

  return (
    <div className="flex flex-col w-full h-screen items-center custom-background-img-mobile sm:custom-background-img-desktop">
      <Navbar />
      <div
        id="home-container"
        className="flex flex-col items-center pt-12 sm:pt-36 sm:w-5/6"
      >
        <div
          id="animation-container"
          className="flex flex-col items-center sm:flex-row w-full"
        >
          <div className="flex flex-col items-center pb-32 sm:pb-10 w-full">
            <div className="flex flex-col pb-8 w-full">
              <h1 className="text-center text-2xl sm:text-3xl pb-2">
                Start trading with confidence{" "}
              </h1>
              <h1
                id="text"
                className="text-3xl text-center sm:text-8xl text-blue-500"
              >
                Live Better
              </h1>
            </div>
            <div
              id="button-container"
              className="text-3xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:ring-1 hover:ring-white rounded-md shadow-lg shadow-blue-500/50 sm:mt-4"
            >
              <button
                className="text-white p-2 px-4"
                onClick={() => {
                  navigate("/analytics");
                }}
              >
                See the data{" "}
              </button>
            </div>
          </div>
          <div
            id="text-container"
            className="flex flex-col w-5/6 sm:w-4/6 justify-around sm:gap-16"
          >
            <h1 className="pb-3 text-center text-2xl sm:text-5xl font-thin">
              Supported by a robust AI model {" "}
              <span className="text-blue-500 text-3xl sm:text-5xl font-normal bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
                fine-tuned
              </span>{" "}
              on private curated data.
            </h1>
            <h1 className="pb-3 text-center text-2xl sm:text-5xl font-thin">
              Performing sentiment analysis on{" "}
              <span className="text-blue-500 text-3xl sm:text-5xl font-normal bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
                countless
              </span>{" "}
              retail trader thoughts to boost your trading strategy.
            </h1>
          </div>
        </div>
      </div>
      <BottomHeader />
    </div>
  );
}

export default HomePage;
