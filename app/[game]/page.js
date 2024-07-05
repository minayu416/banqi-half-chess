"use client"

import React, { useEffect, useState, useMemo } from 'react';

import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';

import { ChessShuffleHandler } from "./component"

import Header from "../component";

// TODO: Note: 必須要登入Google 帳號才能授權把資料即時更新到google/firestore

// TODO: 先確定可以單機動，再考慮上網連動 (注意不要把 firestore 打爆)
// TODO: Logic: 1. 設計翻牌邏輯，第一個翻牌的人鎖定那方是哪個顏色，要注意持續翻牌不等於有顏色，
//                 但要紀錄哪一方翻到哪個顏色，並且可以操控他的顏色。還要紀錄交互操作，一人動一次。
//              2. 要紀錄棋盤的位置 + 棋子，然後寫規則
//              2.2. 要寫一下怎麼計算棋盤位置的數字
//              3. 紀錄選擇的選定，然後移動的時候判斷邏輯跟transition
//              4. 注意的是隨機的棋子最後是蓋牌，不能存在客戶端被看到 (但這之後再處理，可能要random後直接存在後端或者firestore)

// 可能要在這一層render 不同的棋子
function Draggable(props) {

  return (      
  <div key={props.children.sn} 
      className={`absolute rounded-full w-20 h-20 drop-shadow-lg flex justify-center items-center`} 
      style={{ backgroundColor: "#F1D6AE" }}>
    <div className="rounded-full w-[4.5rem] h-[4.5rem] border-2 flex justify-center items-center" style={{ borderColor: props.children.color }}>
      <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: props.children.color }}>{ props.children.chineseName }
      </p>
    </div>
  </div>
  );
}

function DroppableCell(props) {

  return (
    <div key={props.position} className="relative w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}>
      {props.children}
    </div>
  )

}

function Board() {
  // TODO: 傳game 進來
  // 在這一層會設定棋子的初始 x, y 軸 (從 game 傳進來)、然後帶入後面的chess 判斷、結合這兩個變數
  const [shuffledChess, setShuffledChess] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
      // 第一次 load 時先random 棋子、但未來要改成存進localStorage+更新firestore 以防止使用者F5刷新
      const randomChess = ChessShuffleHandler();
      setShuffledChess(randomChess);
      setIsLoading(false);
   }, []); 

   function handleDragEnd(event) {

  }

  const divs = shuffledChess.map((chess, index) => (
    // 這是方格, 先暫時用index 給格子編號
      <DroppableCell key={index} chess={chess}>
        <div key={index} className="relative w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}>
        {/* 棋子 */}
        {chess == '.' ? (
            <div>{null}</div>
        ) : (
          <Draggable key={index} chess={chess}>
          <div key={chess.sn} 
              className={`absolute rounded-full w-20 h-20 drop-shadow-lg flex justify-center items-center`} 
              style={{ backgroundColor: "#F1D6AE" }}>
            <div className="rounded-full w-[4.5rem] h-[4.5rem] border-2 flex justify-center items-center" style={{ borderColor: chess.color }}>
              <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: chess.color }}>{ chess.chineseName }
              </p>
            </div>
          </div>
          </Draggable>
        )}
        </div>
      </DroppableCell>
    ));
    return (
      <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full grid grid-cols-8">
        {shuffledChess.map((chess, index) => {
          return (
          // 這是方格, 先暫時用index 給格子編號
            <DroppableCell key={index} position={index} chess={chess}>
              {/* <div key={index} className="relative w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}> */}
              {/* 棋子 */}
              {chess == '.' ? (
                  <div>{null}</div>
              ) : (
                <Draggable position={index} name={chess}>
                  {chess}
                </Draggable>
              )}
              {/* </div> */}
            </DroppableCell>
          )
          })
        }
      </div>
      </DndContext>
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
              <Board />
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
        <Header/>
        <div className="min-h-screen py-24 px-12 flex w-full">
          <GameSection/>
          <ChatRoom/>
        </div>
      </>
      )
}