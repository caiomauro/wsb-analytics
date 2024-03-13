import { useEffect } from 'react';
import { useNavbar } from '../Context/NavbarContext';

function Navbar() {
    const { activePage, setActivePage } = useNavbar();

    useEffect(() => {
        setActivePage(window.location.pathname);
    }, []);

    const handleSetActivePage = (page: string) => {
        setActivePage(page);
    };

    return (
        <div className="w-full">
            <div id="navbar" className="grid grid-cols-1 gap-2 sm:gap-0 sm:grid-cols-3 pt-2 pb-2">
                <div id="logo-div" className="flex flex-col justify-start items-start mx-auto sm:mx-0 sm:pl-32 sm:col-span-1">
                    <div className="flex flex-col justify-start items-center">
                        <img alt="logo" src="/logo.png" className="h-14 w-auto" />
                        <p>Powered by <span className="text-green-500 font-bold text-md">AI</span></p>
                    </div>
                </div>
                <div id="title-div" className="flex items-center justify-center sm:col-span-1">
                    <h1 className="font-italics text-3xl">WSB ANALYTICS.</h1>
                </div>
                <div id="link-div" className="flex flex-col xl:flex-row items-center justify-between pl-2 pr-2 sm:pl-8 sm:pr-24 sm:col-span-1">
                    <a href="/" className={`${activePage === "/" ? "font-bold" : "font-thin"}`} onClick={() => handleSetActivePage("/")}>Home</a>
                    <a href="/analytics" className={`${activePage === "/analytics" ? "font-bold":"font-thin"}`} onClick={() => handleSetActivePage("/analytics")}>Analytics</a>
                    <a href="/data" className={`font-thin ${activePage === "/data" && "font-bold"}`} onClick={() => handleSetActivePage("/data")}>Data</a>
                    <a href="/how-it-works" className={`font-thin ${activePage === "/how-it-works" && "font-bold"}`} onClick={() => handleSetActivePage("/how-it-works")}>How it works</a>
                    <a href="/github" className={`font-thin ${activePage === "/github" && "font-bold"}`} onClick={() => handleSetActivePage("/github")}>Github</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
