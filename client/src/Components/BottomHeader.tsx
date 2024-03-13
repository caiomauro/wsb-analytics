function BottomHeader(){

    return(
        <div className="w-full mt-auto mb-2">
            <div id="navbar" className="grid grid-cols-1 gap-2 sm:gap-0 sm:grid-cols-3 pt-2"> {/* Use grid-cols-3 for larger screens */}
                <div id="logo-div" className=" items-center mx-auto sm:mx-0 sm:pl-32 sm:col-span-1"> {/* Adjust padding and col-span for small screens */}
                    <p className="font-light text-sm font-italics">Made for fun, I am not responsible if you lose money :)</p>
                </div>
                <div id="title-div" className="flex items-center justify-center sm:col-span-1"> {/* Adjust col-span for small screens */}
                    <h1 className="font-light font-italics"></h1>
                </div>
                <div id="link-div" className="flex flex-col sm:flex-row justify-between items-center pl-2 pr-8 sm:pl-8 sm:col-span-1"> {/* Adjust padding and col-span for small screens */}
                    <a href="https://opensource.org/license/mit" target="_blank" className="font-sm text-sm sm:text-center font-thin">Use under MIT License</a>
                    <a href="https://huggingface.co/teknium/OpenHermes-2.5-Mistral-7B" target="_blank" className="text-sm font-thin">OpenHermes-7B</a>
                    <a href="/" target="_blank" className="text-sm font-thin">LinkedIn</a>
                </div>
            </div>
        </div>
    );

}
export default BottomHeader
