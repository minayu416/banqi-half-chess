"use client"

import React, { useEffect, useState } from 'react';

import Header from "../component";

import { ChessShuffleHandler } from "./component"


export default function Page({ params }) {

    const [shuffledChess, setShuffledChess] = useState([]);

    useEffect(() => {
        const randomChess = ChessShuffleHandler();
        setShuffledChess(randomChess);
    }, []); 

    const divs = shuffledChess.map((chess, index) => (
        <div key={chess.sn} className="w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}>
          <div className="rounded-full w-20 h-20 drop-shadow-lg flex justify-center items-center" style={{ backgroundColor: "#F1D6AE" }}>
            {/* TODO: 根據棋子的顏色上border */}
            <div className="rounded-full w-[4.5rem] h-[4.5rem] border-2 flex justify-center items-center" style={{ borderColor: chess.color }}>
                <p className="text-5xl lxgw-wenkai-tc-regular" style={{ color: chess.color }}>{chess.chineseName}
                </p>
            </div>
          </div>
        </div>
      ));

    return (
      <>
        <Header/>
        <div className="min-h-screen py-24 px-12 flex w-full">
            <div className="w-2/3 flex flex-col justify-center items-center">

              對手
                {/* TODO Banqi bg another option: #9C836A*/}
                <div className="h-3/5 w-full border rounded-md p-3" style={{backgroundColor: "#96602E", borderColor: "#C18859"}}>
                    <div className="w-full h-full border-2 rounded-md" style={{borderColor: "#3C3B3B"}}>
                        <div className="w-full h-full grid grid-cols-8">
                            {divs}
                        </div>
                    </div>
                </div>
                我
                </div>
            <div className="w-1/3 flex flex-col justify-center items-center">
                {/* TODO implement chat room, refer Fancy chat room */}
                <div className="h-2/3 w-4/5 border rounded-md" style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
                </div>
                {/* TODO chat message + button */}
                </div>
        </div>
      </>
      )
}