"use client"

import { useRouter } from "next/navigation";

import {Header, generateRandomCode} from "./component";
import { useState } from "react";

export default function Home() {

  const router = useRouter();

  const [multiPlayerMode, setMultiPlayerMode] = useState(false)

  const fontStyle = {
    color: "#96602E"
  }
  
  const newGame = () => {
    const randomCode = generateRandomCode();
    router.push(`/${randomCode}/`);
  };

  const multiGame = () => {
    setMultiPlayerMode(true)
  };

  const newSingleGame = () => {
    router.push(`/single/`);
  };


  return (
    <main className="">
      <Header/>
      <div className="mt-32 flex justify-center items-center">
      <div className="w-2/6 h-72 border rounded-md p-8 drop-shadow-md" style={{backgroundColor: "#9C836A", borderColor: "#B59376"}}>
      <p className="text-4xl font-bold text-center mb-6" style={{color: "#FFF3E8"}}>暗棋 Banqi Chess</p>
      { multiPlayerMode &&
      <p className="mb-8 text-center italic text-sm" style={{color: "#FFF3E8"}}>注意：遊玩遊戲須先登入Google帳號。</p>
      }
        <div className="flex flex-col justify-center items-center">
        { multiPlayerMode ?
        <>
        <div className="w-2/5 rounded-lg py-1 mb-3 shadow-md" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>登入</p>
        </div>
        {/* TODO: 要先登入才給按 */}
        <button onClick={() => newGame()} className="w-2/5 rounded-lg py-1 shadow-md" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>新遊戲</p>
        </button>
        </>
        : 
        <>
        <button onClick={() => newSingleGame()} className="w-2/5 rounded-lg py-1 mb-3 shadow-md" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>單人模式</p>
        </button>
        <button onClick={() => multiGame()} className="w-2/5 rounded-lg py-1 shadow-md" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>雙人模式</p>
        </button>
        </>
}
        </div>
      </div>
      </div>


    </main>
  );
}
