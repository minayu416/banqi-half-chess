"use client"

import React, { useEffect, useState } from 'react';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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

// 可能要在這一層render 不同的棋子
const Piece = ({chess}) => {
  console.log(chess)
    return (
      <div key={chess.sn} 
      className={`absolute rounded-full w-20 h-20 drop-shadow-lg flex justify-center items-center`} 
      style={{ backgroundColor: "#F1D6AE" }}>
   <div className="rounded-full w-[4.5rem] h-[4.5rem] border-2 flex justify-center items-center" style={{ borderColor: chess.color }}>
       <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: chess.color }}>{ chess.chineseName }
       </p>
   </div>
 </div>
    )
  
}

const BoardSquare = ({ pos, children, game }) => {

  // TODO: 判斷可否拖曳的function

  // TODO: 每動一步 update setChessPosition

  // 這一層去判斷可不可以drop -> 帶入位置、以及 game rule 跟 move func 去判斷
  // const [{ isOver, canDrop }, drop] = useDrop(
  //   () => ({
  //     accept: ItemTypes.KNIGHT,
  //     canDrop: () => game.canMoveKnight(x, y),
  //     drop: () => game.moveKnight(x, y),
  //     collect: (monitor) => ({
  //       isOver: !!monitor.isOver(),
  //       canDrop: !!monitor.canDrop(),
  //     }),
  //   }),
  //   [game],
  // )

  return (
    // ref={drop}
    <div className="relative w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}>
      {/* child 應該就是 chess */}
      {children}
      {/* {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
      {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
      {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />} */}
    </div>
  )
}

function Board() {
  // 在這一層會設定棋子的初始 x, y 軸 (從 game 傳進來)、然後帶入後面的chess 判斷、結合這兩個變數
  const [shuffledChess, setShuffledChess] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
      // 第一次 load 時先random 棋子、但未來要改成存進localStorage+更新firestore 以防止使用者F5刷新
      const randomChess = ChessShuffleHandler();
      setShuffledChess(randomChess);
      setIsLoading(false);
   }, []); 

  const divs = Array.from({ length: 32 }, (_, index) => (
    // 這是方格, 先暫時用index 給格子編號
      <div key={index}>
        {/*  */}
        <BoardSquare pos={index}>
          {/* 這個會根據render的位置去判斷放哪個棋、先仔細研究在寫 */}
          {/* 用變動的dictionary去寫 */}
          {/* 1. 先改資料結構、在寫進來，而不要寫死isKnight */}
          <Piece chess={shuffledChess[index]} />
        </BoardSquare>
      </div>
    ));
    return (
      <div className="w-full h-full grid grid-cols-8">
        {isLoading ? <></> : divs}
      </div>
    )
}

function GameSection({}){

  return (

    <div className="w-2/3 flex flex-col justify-center items-center">
    <div className="m-auto w-1/3 border flex" style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
      <div className='p-5'>照片</div>
      <div className='p-5'>對手</div>
      </div>
      {/* TODO Banqi bg another option: #9C836A*/}
        <div className="h-3/5 w-full border rounded-md p-3" style={{backgroundColor: "#96602E", borderColor: "#C18859"}}>
            <div className="w-full h-full border-2 rounded-md" style={{borderColor: "#3C3B3B"}}>
              <Board/>
            </div>
        </div>
      <div className="m-auto w-1/3 border flex" style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
      <div className='p-5'>照片</div>
      <div className='p-5'>我</div>
        </div>
      </div>
  )

}

function ChatRoom({}){
 return (
  <div className="w-1/3 flex flex-col justify-center items-center">
  {/* TODO implement chat room, refer Fancy chat room */}
  <div className="h-2/3 w-4/5 border rounded-md" style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
  </div>
  {/* TODO chat message + button */}
  </div>
 )
}

export default function Page({ params }) {

    return (
      <>
      <DndProvider backend={HTML5Backend}>
        <Header/>
        <div className="min-h-screen py-24 px-12 flex w-full">
          <GameSection/>
          <ChatRoom/>
        </div>
      </DndProvider>
      </>
      )
}