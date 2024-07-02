"use client"

import React, { useEffect, useState } from 'react';

import Header from "../component";

import { ChessShuffleHandler } from "./component"

// TODO: Note: 必須要登入Google 帳號才能授權把資料即時更新到google/firestore

// TODO: 先確定可以單機動，再考慮上網連動 (注意不要把 firestore 打爆)
// TODO: Logic: 1. 設計翻牌邏輯，第一個翻牌的人鎖定那方是哪個顏色，要注意持續翻牌不等於有顏色，
//                 但要紀錄哪一方翻到哪個顏色，並且可以操控他的顏色。還要紀錄交互操作，一人動一次。
//              2. 要紀錄棋盤的位置 + 棋子，然後寫規則
//              2.2. 要寫一下怎麼計算棋盤位置的數字
//              3. 紀錄選擇的選定，然後移動的時候判斷邏輯跟transition
//              4. 注意的是隨機的棋子最後是蓋牌，不能存在客戶端被看到 (但這之後再處理，可能要random後直接存在後端或者firestore)


function ChessSection({}){
  // TODO: 判斷可否拖曳的function

  // 
  const [shuffledChess, setShuffledChess] = useState([]);
  const [chessPosition, setChessPosition] = useState({});
  
  const [selectedChess, setSelectedChess] = useState({});


  console.log(chessPosition)

  useEffect(() => {
      // 第一次 load 時先random 棋子、但未來要改成存進localStorage+更新firestore 以防止使用者F5刷新
      const randomChess = ChessShuffleHandler();
      setShuffledChess(randomChess);

      // 
      let position = {}
      randomChess.map((chess, index) => (
        position[index] = chess
      ));
      setChessPosition(position)

  }, []); 

  // TODO: 每動一步 update setChessPosition

  console.log(selectedChess)
  const handleSelectChess = (position, chess) => {
    if (Object.keys(selectedChess).length === 0) {
      let selection = {
        position: position,
        chessSN: chess.sn
      }
      setSelectedChess(selection)
    } else {
        if (selectedChess.chessSN === chess.sn) {
          // 或者判斷position 不一致也可以
            setSelectedChess({});
        } else {
          // 代表點其他格子了，進到移動的判斷邏輯。
          // selectedChess
          let newPosition = { ...chessPosition };
          newPosition[position] = chessPosition[selectedChess.position];
          // delete newPosition[selectedChess.position];
          console.log(newPosition)
          setChessPosition(newPosition);
          setSelectedChess({});
        }

    }
    
  };

  const divs = shuffledChess.map((chess, index) => (
    // 這是方格, 先暫時用index 給格子編號
      <div key={index} onClick={() => handleSelectChess(index, chessPosition[index])} className="relative w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}>
        {/* 這是棋子 */}
        <div key={chessPosition[index].sn} 
             className={`absolute rounded-full w-20 h-20 drop-shadow-lg flex justify-center items-center ${selectedChess.chessSN===chessPosition[index].sn && "ring-2 ring-pink-500 ring-inset"}`} 
             style={{ backgroundColor: "#F1D6AE" }}>
          <div className="rounded-full w-[4.5rem] h-[4.5rem] border-2 flex justify-center items-center" style={{ borderColor: chessPosition[index].color }}>
              <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: chessPosition[index].color }}>{ chessPosition[index].chineseName }
              </p>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="w-full h-full grid grid-cols-8">
    {divs}
    </div>
  )

}

export default function Page({ params }) {

    return (
      <>
        <Header/>
        <div className="min-h-screen py-24 px-12 flex w-full">
            <div className="w-2/3 flex flex-col justify-center items-center">
              對手 
                {/* TODO Banqi bg another option: #9C836A*/}
                <div className="h-3/5 w-full border rounded-md p-3" style={{backgroundColor: "#96602E", borderColor: "#C18859"}}>
                    <div className="w-full h-full border-2 rounded-md" style={{borderColor: "#3C3B3B"}}>
                    <ChessSection/>
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