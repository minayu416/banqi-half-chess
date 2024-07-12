"use client"

import React, { useEffect, useState, useMemo } from 'react';

import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';

import { chessStyle, ChessShuffleHandler } from "./component"

import { Header } from "../component";
import { ChessRules } from './rules';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'

// TODO: Note: 必須要登入Google 帳號才能授權把資料即時更新到google/firestore

// TODO: 先確定可以單機動，再考慮上網連動 (注意不要把 firestore 打爆)
// TODO: Logic: 1. (要特別亮目前是誰的side) 設計翻牌邏輯，第一個翻牌的人鎖定那方是哪個顏色，要注意持續翻牌不等於有顏色，
//                 但要紀錄哪一方翻到哪個顏色，並且可以操控他的顏色。還要紀錄交互操作，一人動一次。 
//              2. 要紀錄棋盤的位置 + 棋子，然後寫規則
//              2.2. 要寫一下怎麼計算棋盤位置的數字
//              3. 紀錄選擇的選定，然後移動的時候判斷邏輯跟transition
//              4. 注意的是隨機的棋子最後是蓋牌，不能存在客戶端被看到 (但這之後再處理，可能要random後直接存在後端或者firestore)

// TODO:
// 1. 重構一下儲存跟傳遞的Params
// 4. 判斷可否移動的背景顏色可能需要重構程式碼(包含空位也可以選)

// 可能要在這一層render 不同的棋子
function Draggable(props) {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable_${props.position}`,
    data: {
      sn: props.chess.sn,
      position: props.position,
      chess: props.chess
    },
  });

  const style = {
    color: props.chess.sn[0] == '0' ? 'black' : 'red',
    touchAction: 'none',
  };

  if (transform) {
    style['transform'] = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    style['zIndex'] = 10;
  }

  return (  
    <>
    {/* TODO: 這邊要修一下 */}
    {props.chess == '.' ? (
      <div>{null}</div>
  ) : ( 
    <div 
    ref={setNodeRef}
    // ref={props.currentUser === props.sequence ? setNodeRef : null}
    key={props.children.sn} 
    className={`absolute rounded-full w-20 h-20 drop-shadow-lg flex justify-center items-center`} 
    style={{ backgroundColor: "#F1D6AE", ...style }}
    {...listeners} {...attributes}>
    {!props.children.turned?
    // 蓋牌
    <div className="rounded-full w-[4.5rem] h-[4.5rem] flex justify-center items-center">
      {/* <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: props.children.color }}>{ props.children.chineseName }
      </p> */}
    </div>
    :
      <div className="transition-transform ease-in-out duration-500 rounded-full w-[4.5rem] h-[4.5rem] border-2 flex justify-center items-center" style={{ borderColor: props.children.color, transform: 'rotateY(180deg)' }}>
        <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: props.children.color, transform: 'rotateY(180deg)' }}>{ props.children.chineseName }
        </p>
      </div>
      }
  </div>
  )}  
</>
  );
}

function DroppableCell(props) {

  const { active, isOver, setNodeRef } = useDroppable({
    id: `droppable_${props.position}`,
    data: {
      sn: props.chess.sn,
      position: props.position,
      chess: props.chess
    },
  });

  // TODO: 需要更改邏輯。
  const sameSide = active && active.data.current?.sn[0] == (props.chess !== '.' && props.chess.sn[0]);

  // TODO: 判斷移動空位時也可以是green
  const style = {
    background: isOver ? (sameSide ? 'red' : 'green') : undefined,
  };

  return (
    <div key={props.position} 
    ref={setNodeRef}
    // ref={props.currentUser === props.sequence ? setNodeRef : null}
    className="relative w-full h-full border flex justify-center items-center" 
    style={{ borderColor: "#3C3B3B", ...style  }}>
      {props.children}
    </div>
  )

}

function Board({currentUser, opponent, side, setSide, sequence, changeSequence, setEventInfo}) {
  const [shuffledChess, setShuffledChess] = useState([]);

  // const [eventInfo, setEventInfo] = useState('<>');

  useEffect(() => {
      // 第一次 load 時先random 棋子、但未來要改成存進localStorage+更新firestore 以防止使用者F5刷新
      const randomChess = ChessShuffleHandler();
      setShuffledChess(randomChess);
   }, []); 

  const rules = useMemo(() => new ChessRules(), []);

  function emitChange(activeData, overData){
    const updatedChess = [...shuffledChess];
    updatedChess[activeData.position] = '.';
    updatedChess[overData.position] = activeData.chess;
    setShuffledChess(updatedChess);
    changeSequence(currentUser);
    setEventInfo(`[${String(chessStyle[activeData.chess.sn[0]].word) ?? ''}] ${String(activeData.chess.chineseName) ?? ''} -> [${String(chessStyle[overData.chess.sn[0]].word) ?? ''}] ${String(overData.chess.chineseName) ?? ''}`);
  }

  function handleDragEnd(event) {
    let activeEvent = event.active;
    let overEvent = event.over;

    if (!activeEvent?.data?.current || !overEvent?.data?.current) {
      return;
    }

    let activeData = activeEvent.data.current;
    let overData = overEvent.data.current;

    if (!activeData.chess.turned){
      const updatedChess = [...shuffledChess];
      const turnedChess = {...activeData.chess}
      turnedChess.turned = true;
      updatedChess[activeData.position] = turnedChess;
      setShuffledChess(updatedChess);
      changeSequence(currentUser);
      setEventInfo(`Turned on [${String(chessStyle[activeData.chess.sn[0]].word) ?? ''}] ${String(activeData.chess.chineseName) ?? ''}`);

      if (side[currentUser] === null){
        let newSide = {...side}
        newSide[currentUser] = activeData.chess.sn[0];
        const opponentSide = activeData.chess.sn[0] === "b" ? "r" : "b"
        newSide[opponent] = opponentSide;
        setSide(newSide)
        changeSequence(currentUser);
        setEventInfo('先攻方選定顏色');
        // TODO: 存在雲端資料庫
        return;
      }
      return;

    }
    console.log(overData)

    if (!rules.isTurned(overData)){
      setEventInfo('the chess hasn\' be turned');
      return;
    }

    // TODO: 你拿的不是自己的棋子 - 到時候單人模式跟雙人模式的邏輯要分開
    if(activeData.chess.sn[0] !== side[sequence]){
      setEventInfo('You took incorrect side chess.');
      return;
    }

    if(rules.isMoveSamePlace(activeData, overData)){
      setEventInfo('<>');
      return;
    }

    // 暫時寫的判斷移動到空位
    if (rules.isMoveToEmptyPlace(activeData, overData)) {
      // moving to another empty place
      emitChange(activeData, overData)
      setEventInfo('Moved chess to empty place');
      return;
    }

    // 同個棋子不能吃
    if (rules.isSameSide(activeData, overData)) {
      setEventInfo('You can not eat same color chess');
      return;
    }

    // TODO: 可以隔很多格跳嗎？
    if (rules.isCannon(activeData)){
        // x axis: abs(over.position - current.position) === 2
        // y axis: abs(over.position - current.position) === (16 or 24)
        // 要判斷中間只能有一個格子
        // && (Math.abs(overChess.position - currentChess.position) === 2 || Math.abs(overChess.position - currentChess.position) === 16)
        if ((Math.abs(overData.position - activeData.position) === 2 || Math.abs(overData.position - activeData.position) === 16)){
          emitChange(activeData, overData)
          return;
        }
        return;
    }

    // Except cannon, other chess can not move over 1 step.
    if (rules.isOverStep(activeData, overData)){
      setEventInfo('Chess can not move over 1 step');
      return;
    }
    if (rules.isSolderCanCommit(activeData, overData)){
      emitChange(activeData, overData)
      return;
    }
    if (rules.isKingCanCommit(activeData, overData)){
      setEventInfo('King can not eat solder');
      return;
    }
    if (rules.canCommit(activeData, overData)){
      emitChange(activeData, overData)
      return;
    }

    if (rules.canNotCommit(activeData, overData)){
      setEventInfo(`[${String(chessStyle[activeData.chess.sn[0]].word) ?? ''}] ${String(activeData.chess.chineseName) ?? ''} can not eat [${String(chessStyle[overData.chess.sn[0]].word) ?? ''}] ${String(overData.chess.chineseName) ?? ''}`);
      return;
    }

  }
    return (
      <>
      {/* TODO: {eventInfo} */}
      <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full grid grid-cols-8">
        {shuffledChess.map((chess, index) => {
          return (
          // 這是方格, 先暫時用index 給格子編號
          // TODO: 邏輯要優化
            <DroppableCell key={index} position={index} chess={chess} currentUser={currentUser} sequence={sequence}>
              {/* <div key={index} className="relative w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}> */}
              {/* 棋子 */}
              {chess == '.' ? (
                  <div>{null}</div>
              ) : (
                <Draggable position={index} chess={chess} currentUser={currentUser} sequence={sequence}>
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
      </>
    )
}

function GameSection({setEventInfo}){
    // TODO: 紀錄誰是哪個顏色、應該只需要用第一次
    const [side, setSide] = useState({});
    // TODO: 紀錄順序, TODO: 不能寫死，先攻是Game creator
    // TODO: 動完每一步都要更新sequence 同步到資料庫
    const [sequence, setSequence] = useState(null);

    // TODO: 判斷當前使用者是誰、只存在客戶端做為辨別
    const [currentUser, setCurrentUser] = useState("");
    const [opponent, setOpponent] = useState("")
  
    useEffect(() => {
      // 模擬線上串流、使用者加入的情況
      // TODO: 跟網路資料庫串流、記得確認固定使用者、確認刷新時不會跑掉
      // TODO: 先加入先翻
      const me = "@mina22336"
      const creator = me
      const opponentSide = "@robot18732"
      setCurrentUser(me)
      setOpponent(opponentSide)
      setSequence(creator);
      
      let newSide = {
        [me]: null,
        [opponentSide]: null
      }
      setSide(newSide);
   }, []); 

  function changeSequence(){
      if (currentUser === sequence){
        setSequence(opponent)
        // TODO: 存 Firestore
      } else {
        setSequence(currentUser)
      }
  }
 
  return (

    <div className="w-2/3 flex flex-col justify-center items-center">

    <div className={`m-auto w-2/4 border border flex justify-center items-center`} style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
      <div className='p-5'>照片</div>
      <div className='p-5'>{opponent}</div>
      <div className='py-2 m-auto'>
        {side[opponent] &&
      <div className={`rounded-full p-1 flex justify-center items-center`} style={{ backgroundColor: "#F1D6AE", borderColor: "#B59376" }}>
        <div className="rounded-full px-1 border-2 flex justify-center items-center" style={{ borderColor: chessStyle[side[opponent]].color }}>
          <p className="text-3xl lxgw-wenkai-tc-regular select-none" style={{ color: chessStyle[side[opponent]].color }}>{ chessStyle[side[opponent]].king }
          </p>
        </div>
      </div>
      }
        </div>
      <div>{ currentUser !== sequence && <FontAwesomeIcon icon={faFlag} size="xl" className="p-4" style={{color: "#FFD43B"}} /> }</div>
      </div>
      {/* TODO Banqi bg another option: #9C836A*/}
        <div className="h-3/5 w-full border rounded-md p-3" style={{backgroundColor: "#96602E", borderColor: "#C18859"}}>
            <div className="w-full h-full border-2 rounded-md" style={{borderColor: "#3C3B3B"}}>
              <Board currentUser={currentUser} opponent={opponent} side={side} setSide={setSide} sequence={sequence} changeSequence={changeSequence} setEventInfo={setEventInfo}/>
            </div>
        </div>
      <div className={`m-auto w-2/4 border flex justify-center items-center`} style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
      <div className='p-5'>照片</div>
      <div className='p-5'>{currentUser}</div>
      <div className='p-1 m-auto'>
      {side[currentUser] &&
      <div className={`rounded-full p-1 flex justify-center items-center`} style={{ backgroundColor: "#F1D6AE", borderColor: "#B59376" }}>
        <div className="rounded-full px-1 border-2 flex justify-center items-center" style={{ borderColor: chessStyle[side[currentUser]].color }}>
          <p className="text-3xl lxgw-wenkai-tc-regular select-none" style={{ color: chessStyle[side[currentUser]].color }}>{ chessStyle[side[currentUser]].king }
          </p>
        </div>
        </div>
      }
        </div>
        <div>{ currentUser === sequence && <FontAwesomeIcon icon={faFlag} size="xl" className="p-4" style={{color: "#FFD43B"}} /> }</div>
      
        </div>
      </div>
  )

}

function ChatRoom({eventInfo}){
 return (
  <div className="w-1/3 flex flex-col justify-center items-center">
    {eventInfo}
  {/* TODO implement chat room, refer Fancy chat room */}
  <div className="h-2/3 w-4/5 border rounded-md" style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
  </div>
  {/* TODO chat message + button */}
  </div>
 )
}

export default function Page({ params }) {

  const [eventInfo, setEventInfo] = useState('<>');

    return (
      <>
        <Header/>
        <div className="min-h-screen py-24 px-12 flex w-full">
          <GameSection setEventInfo={setEventInfo}/>
          <ChatRoom eventInfo={eventInfo}/>
        </div>
      </>
      )
}