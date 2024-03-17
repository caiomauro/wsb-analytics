import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import BottomHeader from '../Components/BottomHeader';

function DataPage() {

    return (
        <div className="flex flex-col w-full h-screen items-center custom-background-img-mobile sm:custom-background-img-desktop">
            <Navbar />
            <div className="flex flex-col h-max w-full items-center overflow-y-auto gap-2 pt-8">
                <h2>Data Grid</h2>
                <embed src="https://github.com/caiomauro/wsb-analytics/blob/main/client/src/Pages/jsonl.pdf" type="application/pdf" width="100%" height="500px" />
                <iframe src="jsonl.pdf" title="PDF Viewer" width="100%" height="500px" />
            </div>
            <BottomHeader />
        </div>
    );
}

export default DataPage;
