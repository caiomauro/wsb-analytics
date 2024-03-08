function Navbar(){

    return(
        <div className="w-screen border-b-2 border-white/10">
            <div id="navbar" className="grid grid-cols-1 gap-2 sm:gap-0 sm:grid-cols-3 pt-2 pb-2"> {/* Use grid-cols-3 for larger screens */}
                <div id="logo-div" className=" items-center mx-auto sm:mx-0 sm:pl-32 sm:col-span-1"> {/* Adjust padding and col-span for small screens */}
                    <img alt="logo" src="/logo.png" className="h-14 w-auto" />
                </div>
                <div id="title-div" className="flex items-center justify-center sm:col-span-1"> {/* Adjust col-span for small screens */}
                    <h1 className="font-bold font-italics text-2xl">WSB ANALYTICS.</h1>
                </div>
                <div id="link-div" className="flex flex-col sm:flex-row items-center justify-between pl-2 pr-2 sm:pl-8 sm:pr-24 sm:col-span-1"> {/* Adjust padding and col-span for small screens */}
                    <a href="/" >Home</a>
                    <h1 className="font-thin">Analytics</h1>
                    <h1 className="font-thin">Data</h1>
                    <h1 className="font-thin">How it works</h1>
                    <h1 className="font-thin">Github</h1>
                </div>
            </div>
        </div>
    );

}
export default Navbar
