function Navbar(){

    return(
        <div className="width-screen border-2 border-white">
            <div id="navbar" className="grid grid-cols-3" >
                <div id="logo-div" className="border-2 border-white col-span-1">
                    <h1>LOGO</h1>
                </div>
                <div id="title-div" className="flex border-2 border-white col-span-1 justify-center">
                    <h1>TITLE</h1>
                </div>
                <div id="link-div" className="border-2 border-white col-span-1 flex flex-row justify-between pl-4 pr-4">
                    <h1>Home</h1>
                    <h1>Analytics</h1>
                    <h1>Data</h1>
                    <h1>How it works</h1>
                    <h1>Github</h1>
                </div>
            </div>

        </div>
    );

}
export default Navbar