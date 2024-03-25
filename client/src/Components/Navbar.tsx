import { useEffect, useState } from 'react';
import { useNavbar } from '../Context/NavbarContext';

function Navbar() {
    const { activePage, setActivePage } = useNavbar();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [renderMobile, setRenderMobile] = useState(false);

    useEffect(() => {
        function handleResize(){
            setRenderMobile(window.innerWidth < 1283);
        }
        
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        setActivePage(window.location.pathname);
    }, []);

    const handleSetActivePage = (page: string) => {
        setActivePage(page);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="w-full">
            <div id="navbar" className="grid grid-cols-2 gap-2 sm:gap-0 sm:grid-cols-3 pt-8 sm:pt-4 pb-2">
                <div id="logo-div" className="flex flex-col justify-start items-start mx-auto sm:mx-0 sm:pl-32 sm:col-span-1">
                    <div className="flex flex-col justify-start items-center">
                        <a href="/" className="font-italics text-xl sm:text-2xl sm:font-semibold rounded-md p-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">WSB Analytics</a>
                    </div>
                </div>
                <div id="title-div" className="flex items-center justify-center sm:col-span-1">
                    <p className="text-sm font-light">Powered by <span className="text-green-500 font-bold text-md">AI</span></p>
                </div>
                {renderMobile ? (
                <div className="flex flex-row w-screen sm:w-full pl-2 pt-2">
                    <div className="flex justify-start">
                        <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
                        <span className="animate-pulse">
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="white">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18l6-6-6-6"></path>      
                            </svg>
                        </span>
                        </button>
                    </div>
                    <div id="link-div" className={`flex flex-row w-full justify-between items-center p-2 pr-4 sm:col-span-1 ${isMenuOpen ? '' : 'hidden'}`}>
                        <a href="/" className={`${activePage === "/" ? "font-bold" : "font-normal"}`} onClick={() => handleSetActivePage("/")}>Home</a>
                        <a href="/analytics" className={`${activePage === "/analytics/bars" ? "font-bold":"font-normal"}`} onClick={() => handleSetActivePage("/analytics")}>Analytics</a>
                        <a href="/data" className={`${activePage === "/data" ? "font-bold" :"font-normal"}`} onClick={() => handleSetActivePage("/data")}>Data</a>
                        <a href="https://github.com/caiomauro/wsb-analytics" target="_blank" className={`${activePage === "/github" ? "font-bold" : "font-normal"}`} onClick={() => handleSetActivePage("/github")} rel="noreferrer">Github</a>
                    </div>
                </div>
                ):( 
                <div id="link-div" className="flex flex-row justify-between items-center pl-2 pr-2 sm:pl-8 sm:pr-24 sm:col-span-1">
                    <a href="/" className={`${activePage === "/" ? "font-bold" : "font-normal"}`} onClick={() => handleSetActivePage("/")}>Home</a>
                    <a href="/analytics" className={`${activePage === "/analytics" ? "font-bold":"font-normal"}`} onClick={() => handleSetActivePage("/analytics")}>Analytics</a>
                    <a href="/data" className={`${activePage === "/data" ? "font-bold" :"font-normal"}`} onClick={() => handleSetActivePage("/data")}>Data</a>
                    <a href="https://github.com/caiomauro/wsb-analytics" target="_blank" className={`${activePage === "/github" ? "font-bold" : "font-normal"}`} onClick={() => handleSetActivePage("/github")} rel="noreferrer">Github</a>
                </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
