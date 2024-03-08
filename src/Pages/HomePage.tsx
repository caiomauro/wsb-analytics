import { useState } from "react";
import Navbar from "../Components/Navbar";

function HomePage(){
    const [data, useData] = useState([]);

    return(
        <div className="width-full height-full">
            <Navbar />
            <h1 className="font-bold italic">HomePage</h1>
        </div>
    )
}

export default HomePage