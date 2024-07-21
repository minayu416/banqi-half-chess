"use client"

import React, { useEffect, useState, useMemo, useRef } from 'react';

import { useRouter } from "next/navigation";

import { auth, db, createOrJoinGame, updateSide, updateSequence, updatePosition, fetchLatestPosition, writeSendMessage, fetchNewMessages } from '../firebase'

import { doc, onSnapshot } from "firebase/firestore"

import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

import { chessStyle, ChessShuffleHandler } from "./component"

import { HeaderBase, GameHeader } from "../component";
import { ChessRules } from './rules';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faXmark, faHouse } from '@fortawesome/free-solid-svg-icons'

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
    {props.chess == '.' ? (
      <div>{null}</div>
  ) : ( 
    <div 
    ref={setNodeRef}
    // ref={props.currentUser === props.sequence ? setNodeRef : null}
    key={props.children.sn} 
    className={`absolute rounded-full w-14 h-14 lg:w-20 lg:h-20 drop-shadow-lg flex justify-center items-center`} 
    style={{ backgroundColor: "#F1D6AE", ...style }}
    {...listeners} {...attributes}>
    {!props.children.turned?
    // 蓋牌
    <div className="rounded-full w-[2.5rem] h-[2.5rem] lg:w-[4.5rem] lg:h-[4.5rem] flex justify-center items-center">
      {/* <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: props.children.color }}>{ props.children.chineseName }
      </p> */}
    </div>
    :
      <div className="transition-transform ease-in-out duration-500 rounded-full w-[2.5rem] h-[2.5rem] lg:w-[4.5rem] lg:h-[4.5rem] border-2 flex justify-center items-center" style={{ borderColor: props.children.color, transform: 'rotateY(180deg)' }}>
        <p className="text-3xl lg:text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: props.children.color, transform: 'rotateY(180deg)' }}>{ props.children.chineseName }
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

  const style = {
    background: isOver ? 'rgba(255, 255, 255, 0.3)' : undefined,
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

function Board({gameId, currentUser, opponent, side, setSide, sequence, changeSequence, setEventInfo }) {
  const [shuffledChess, setShuffledChess] = useState([]);
  const showUserSide = gameId === "single" ? currentUser.displayName : currentUser.uid
  const showOpponentSide = gameId === "single" ? opponent.displayName : opponent.uid
  // const [eventInfo, setEventInfo] = useState('<>');

  useEffect(() => {
      // 第一次 load 時先random 棋子、但未來要改成存進localStorage+更新firestore 以防止使用者F5刷新
      const randomChess = ChessShuffleHandler();
      setShuffledChess(randomChess);

      if (gameId !== "single"){
        const unsubscribe = fetchLatestPosition(gameId, (latestData) => {
          setShuffledChess(latestData.position)
          setEventInfo(latestData.eventMessage)
        });
  
        return () => unsubscribe();
      }

   }, [gameId]); 

  const rules = useMemo(() => new ChessRules(), []);

  function emitChange(activeData, overData){
    const updatedChess = [...shuffledChess];
    const msg = overData.chess === '.' ? `Moved [${String(chessStyle[activeData.chess.sn[0]].word) ?? ''}] ${String(activeData.chess.chineseName) ?? ''} to empty place` : `[${String(chessStyle[activeData.chess.sn[0]].word) ?? ''}] ${String(activeData.chess.chineseName) ?? ''} -> [${String(chessStyle[overData.chess.sn[0]].word) ?? ''}] ${String(overData.chess.chineseName) ?? ''}`
    updatedChess[activeData.position] = '.';
    updatedChess[overData.position] = activeData.chess;
    setShuffledChess(updatedChess);
    changeSequence(currentUser.uid);
    setEventInfo(msg);
    if (gameId !== "single") {
      updatePosition(gameId, updatedChess, msg);
    }
  }

  function handleDragEnd(event) {
    let activeEvent = event.active;
    let overEvent = event.over;

    if (!activeEvent?.data?.current || !overEvent?.data?.current) {
      return;
    }

    let activeData = activeEvent.data.current;
    let overData = overEvent.data.current;

    if (gameId !== "single"){
      if (currentUser.uid !== sequence){
        setEventInfo("This is not your turn");
        return;
      }
    }

    if (!activeData.chess.turned){
      const updatedChess = [...shuffledChess];
      const turnedChess = {...activeData.chess}
      turnedChess.turned = true;
      updatedChess[activeData.position] = turnedChess;
      const msg = `Turned on [${String(chessStyle[activeData.chess.sn[0]].word) ?? ''}] ${String(activeData.chess.chineseName) ?? ''}`
      setShuffledChess(updatedChess);
      changeSequence(currentUser.uid);
      // setEventInfo(`Turned on [${String(chessStyle[activeData.chess.sn[0]].word) ?? ''}] ${String(activeData.chess.chineseName) ?? ''}`);
      setEventInfo(msg);

      if (gameId !== "single") {
        updatePosition(gameId, updatedChess, msg);
      }

      if (side === null){
        let newSide = {
          [showUserSide]: activeData.chess.sn[0],
          [showOpponentSide]: activeData.chess.sn[0] === "b" ? "r" : "b"
        }

        setSide(newSide)
        setEventInfo('先攻方選定顏色');

        if (gameId !== "single"){
          updateSide(gameId, newSide)
        }
        changeSequence(currentUser.uid);

        return;
      }
      return;

    }

    if(activeData.chess.sn[0] !== side[sequence]){
      setEventInfo('You took incorrect side chess.');
      return;
    }

    if (overData.chess !== '.'){
      if (!overData.chess.turned){
        setEventInfo('the chess hasn\'t be turned');
        return;
      }
    }

    if(rules.isMoveSamePlace(activeData, overData)){
      setEventInfo('<>');
      return;
    }

    if (rules.isMoveToEmptyPlace(overData)) {
        // moving to another empty place
        if (Math.abs(overData.position - activeData.position) === 1 || Math.abs(overData.position - activeData.position) === 8){
          emitChange(activeData, overData)
          return;
      } else {
        setEventInfo('Can not jump over 1 step');
        return;
      }
    }

    // 同個棋子不能吃
    if (rules.isSameSide(activeData, overData)) {
      setEventInfo('You can not eat same color chess');
      return;
    }

    if (rules.isCannon(activeData)){
        // x axis: abs(over.position - current.position) === 2
        if (Math.abs(overData.position - activeData.position) === 2){
          let a = activeData.position
          let b = overData.position
          if (a > b) {
            [a, b] = [b, a];
          }
          if (shuffledChess[b-1] !== ".") {
          emitChange(activeData, overData)
          return;
          }
          return;
        }
        if (Math.abs(overData.position - activeData.position) <= 7){
          let a = activeData.position
          let b = overData.position
          if (a > b) {
            [a, b] = [b, a];
          }
          const resultArray = [];
          for (let i = a +1 ; i < b; i++) {
            resultArray.push(i);
          }

          let empty = 0
          for (let i = 0; i < resultArray.length; i++) {

            if (shuffledChess[resultArray[i]] !== '.'){
              empty++
            }
          }

          if (empty === 1){
            emitChange(activeData, overData)
            return;
          }
          return;
        }
        // y axis: abs(over.position - current.position) === (16 or 24)
        if (Math.abs(overData.position - activeData.position) === 16){
          emitChange(activeData, overData)
          return;
        }
        if (Math.abs(overData.position - activeData.position) === 24){
          let a = activeData.position
          let b = overData.position
          if (a > b) {
            [a, b] = [b, a];
            const mid = a + (b - a) / 2;
            const indexes =  [mid - 4, mid + 4];
            let empty = 0
            for (let i = 0; i < indexes.length; i++) {
              if (shuffledChess[indexes[i]] !== '.'){
                empty++
              }
            }
            // 確保中間只有一個棋子
            if (empty === 1){
              emitChange(activeData, overData)
              return;
            }
            return;
          }
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
      <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-full grid grid-cols-8">
        {shuffledChess.map((chess, index) => {
          return (
          // 這是方格, 先暫時用index 給格子編號
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

function GameSection({setEventInfo, eventInfo, gameId}){
    const [side, setSide] = useState(null);
    const [sequence, setSequence] = useState(null);

    const [currentUser, setCurrentUser] = useState({});
    const [opponent, setOpponent] = useState({})

    const showUserSide = gameId === "single" ? currentUser.displayName : currentUser.uid
    const showOpponentSide = gameId === "single" ? opponent.displayName : opponent.uid

    useEffect(() => {
      if (gameId==="single"){
        // TODO: single 就存在localStorage
        const me = {"uid": "@single22336", "displayName": "Me"}
        const opponentSide = {"uid": "@single18732", "displayName": "Oppo."} 
        setCurrentUser(me)
        setOpponent(opponentSide)
        setSequence(me.displayName);
      } else {
      // currentUser or opponent -> {"uid": "", "displayName": ""}
      setCurrentUser(auth.currentUser)

      const fetchGameData = async () => {
        const { gameCreator, gameOpponent, gameSequence } = await createOrJoinGame(gameId, auth.currentUser);
        if (auth.currentUser.uid === gameCreator.uid){
          setOpponent(gameOpponent)
        } else {
          setOpponent(gameCreator)
        }
  
        setSequence(gameSequence);
      
      }
      fetchGameData();

      const docRef = doc(db, "games", gameId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.opponent){
            if (auth.currentUser.uid === data.creator.uid){
              setOpponent(docSnap.data().opponent);
            } else {
              setOpponent(docSnap.data().creator);
            }
            
          } 
          if (data.side){
            setSide(data.side)
          }
          setSequence(data.sequence)
        }
      });

      return () => unsubscribe();

      }
   }, [gameId]); 

  function changeSequence(){
    if (gameId !== "single"){
      if (currentUser.uid === sequence){
        setSequence(opponent.uid)
        updateSequence(gameId, opponent.uid)
      } else {
        setSequence(currentUser.uid)
        updateSequence(gameId, currentUser.uid)
      }

    } else {
      if (currentUser.displayName === sequence){
        setSequence(opponent.displayName)
      } else {
        setSequence(currentUser.displayName)
      }
    }

  }
 
  return (

    <div className="w-full lg:w-2/3 flex flex-row-reverse lg:flex-col justify-center items-center">

    <div className={`ml-2.5 lg:m-auto w-[10%] h-4/6 lg:w-2/4 lg:h-auto border border flex flex-col lg:flex-row justify-center items-center`} style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
      <div className='mt-2 pl-0 py-0 lg:pl-3 lg:py-2 lg:mt-0 w-10 h-10 lg:w-14 lg:h-14'>
      {opponent.photoURL ? 
        <img src={opponent.photoURL} className="rounded-xl" /> :
        <div className="w-full h-full border rounded-xl" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376", color: "#96602E"}}></div>
      }  
      </div>
      <div className='p-2 lg:p-5 font-bold' style={{ color: "#96602E" }}>{opponent.displayName}</div>
      <div className='py-2 m-auto'>
        {side && side[showOpponentSide] &&
      <div className={`rounded-full p-1 flex justify-center items-center`} style={{ backgroundColor: "#F1D6AE", borderColor: "#B59376" }}>
        <div className="rounded-full px-1 border-2 flex justify-center items-center" style={{ borderColor: chessStyle[side[showOpponentSide]].color }}>
          <p className="text-3xl lxgw-wenkai-tc-regular select-none" style={{ color: chessStyle[side[showOpponentSide]].color }}>{ chessStyle[side[showOpponentSide]].king }
          </p>
        </div>
      </div>
      }
        </div>
      <div>
        { gameId === "single" ? <>
      { currentUser.displayName !== sequence && <FontAwesomeIcon icon={faFlag} size="xl" className="p-4" style={{color: "#FFD43B"}} /> }
      </>:
        <>{ currentUser.uid !== sequence && <FontAwesomeIcon icon={faFlag} size="xl" className="p-4" style={{color: "#FFD43B"}} /> }</>
      }
        </div>
      </div>
 
      {/* Banqi bg another option: #9C836A*/}
        <div className="h-5/6 lg:h-3/5 w-full">
        <p className='text-center mb-1 lg:hidden text-md font-bold' style={{color: "#96602E"}}>{eventInfo}</p>
          <div className='w-full h-full border rounded-md p-3' style={{backgroundColor: "#96602E", borderColor: "#C18859"}}>
            <div className="w-full h-full border-2 rounded-md" style={{borderColor: "#3C3B3B"}}>
              {opponent.uid &&
                <Board gameId={gameId} currentUser={currentUser} opponent={opponent} side={side} setSide={setSide} sequence={sequence} changeSequence={changeSequence} setEventInfo={setEventInfo} />
              }
              </div>
          </div>
        </div>
      <div className={`mr-2.5 lg:m-auto w-[10%] h-4/6 lg:w-2/4 lg:h-auto border flex flex-col lg:flex-row justify-center items-center`} style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
      <div className='mt-2 pl-0 py-0 lg:pl-3 lg:py-2 lg:mt-0 w-10 h-10 lg:w-14 lg:h-14'>
        {currentUser.photoURL ? 
        <img src={currentUser.photoURL} className="rounded-xl" /> :
        <div className="w-full h-full border rounded-xl" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376", color: "#96602E"}}></div>
      }
      
      </div>
      <div className='p-2 lg:p-5 font-bold' style={{ color: "#96602E" }}>{currentUser.displayName}</div>
      <div className='p-1 m-auto'>
      {side && side[showUserSide] &&
      <div className={`rounded-full p-1 flex justify-center items-center`} style={{ backgroundColor: "#F1D6AE", borderColor: "#B59376" }}>
        <div className="rounded-full px-1 border-2 flex justify-center items-center" style={{ borderColor: chessStyle[side[showUserSide]].color }}>
          <p className="text-3xl lxgw-wenkai-tc-regular select-none" style={{ color: chessStyle[side[showUserSide]].color }}>{ chessStyle[side[showUserSide]].king }
          </p>
        </div>
        </div>
      }
        </div>
        <div>
        { gameId === "single" ? <>
      { currentUser.displayName === sequence && <FontAwesomeIcon icon={faFlag} size="xl" className="p-4" style={{color: "#FFD43B"}} /> }
      </>:
        <>{ currentUser.uid === sequence && <FontAwesomeIcon icon={faFlag} size="xl" className="p-4" style={{color: "#FFD43B"}} /> }</>
      }
          </div>
      
        </div>
      </div>
  )

}

function ChatMessage(props) {
  const { userId, displayName, text, photoURL, createdAt } = props.message;
  // console.log(auth.currentUser.uid)
  const messageAlgn = userId === auth.currentUser.uid ? 'flex-row-reverse' : '';

  let MessageTime = {}
  if (createdAt == null){
    MessageTime.time = ''
  } else {
    const date = new Date(createdAt.seconds * 1000)
    MessageTime.time = ('0' + (date.getMonth()+1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) +  " " + ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2)
  }

  return (<>
      <div className={`flex mb-1 ${messageAlgn}`}>
        <div className={`h-10 w-10 ${auth.currentUser.uid===userId ? "ml-2" : "mr-2"}`}>
        {photoURL ? 
          <img src={photoURL} className="rounded-full" /> :
          <div className="w-full h-full border rounded-xl" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376", color: "#96602E"}}></div>
        }  
        </div>
        <div className="py-1">
        {/* <p class="text-xs font-voll">{displayName}</p> */}
        <div className='border rounded-md mb-1' style={{backgroundColor: "#FFF3E8", borderColor: "#B59376", color: "#96602E"}}>
          <p className={`text-md bg-color-03 rounded-md py-0.5 px-2 font-voll text-center`}>{text}</p>
        </div>
        <p className="text-xs font-roboto">{MessageTime.time}</p>
        </div>
    </div>
  </>)
}

function ChatRoom({gameId}){
  const dummy = useRef();

  const [formValue, setFormValue] = useState('');
  const { uid, displayName, photoURL } = auth.currentUser;
  const [messages, setMessages] = useState([])

  useEffect(() => {

    if (gameId !== "single"){
      const unsubscribe = fetchNewMessages(gameId, (latestData) => {
        setMessages(latestData)
      });

      return () => unsubscribe();
    }

 }, [gameId]); 

 const sendMessage = async (e) => {
  e.preventDefault();
  await writeSendMessage(gameId, uid, displayName, photoURL, formValue) 
  setFormValue('');
  dummy.current.scrollIntoView({ behavior: 'smooth' });
} 

 return (

  <div className='flex flex-col h-full w-full lg:h-3/4 lg:w-4/5 relative border rounded-md' style={{backgroundColor: "#FFFBF8", borderColor: "#B59376"}}>
  <div className="h-5/6 p-4 overflow-y-scroll">
  
  <span ref={dummy}></span>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  </div>
    <form onSubmit={sendMessage} className='flex w-full border-t absolute inset-x-0 bottom-0 rounded-b-md' style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type message..." className="ml-4 my-3 py-2 px-3 w-2/3 placeholder:text-gray-600 rounded-md text-black text-sm" />
      <button type="submit" disabled={!formValue} className="m-auto px-3 py-2 rounded-lg text-xs font-bold border" style={{backgroundColor: "#FFFBF8", borderColor: "#B59376", color: "#96602E"}}>SEND</button>
    </form>
  </div>
 )
}

function Sidebar({gameId, extendChatRoomRef}){
  return (
    <>
    <div ref={extendChatRoomRef} className='absolute h-full w-1/3 p-3 inset-y-0 right-0 lg:hidden border transition-transform ease-in-out duration-300' style={{backgroundColor: "#B59376", borderColor: "#96602E", zIndex: 3}}>
      <ChatRoom gameId={gameId}/>
      </div>
    </>
  )
}



function Instructions({setShowInstructions}){

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <>
    <div className='absolute w-full h-full' style={{backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 4}}></div>
    <div className='absolute h-3/5 w-3/5 lg:h-2/6 xl:w-2/5 2xl:w-2/5 top-[10%] left-[25%] rounded-md border-4 p-4' style={{backgroundColor: "#F1D6AE", borderColor: "#B59376", zIndex: 5}}>
    <div className='absolute top-0 right-0 p-1 cursor-pointer' onClick={() => closeInstructions()}><FontAwesomeIcon icon={faXmark} size="2xl" style={{color: "#B59376"}}/></div>
    <p className="font-bold" style={{ color: "#96602E" }}>翻開的棋才能移動，只能攻擊翻開的棋。</p>
      <p className="font-bold" style={{ color: "#96602E" }}>每個棋只能移動相鄰一格，砲/炮移動一格，但需要跳棋攻擊，與欲攻擊的棋中間必須只能存在一顆棋。</p>
      <p className="font-bold" style={{ color: "#96602E" }}>剋制關係：將-{`>`}士-{`>`}象-{`>`}車-{`>`}馬-{`>`}炮-{`>`}兵-{`>`}將</p>
      <p className="font-bold" style={{ color: "#96602E" }}>兵只能吃卒或將，卒只能吃兵或帥</p>
      <p className="font-bold" style={{ color: "#96602E" }}>將不能吃兵、帥不能吃卒</p>
      </div>

    </>
  )
}

function IsNotLoginMessage(){
  const router = useRouter();

  const backHome = () => {
    router.push(`/`);
  };

  return (
    <>
    <div className='absolute h-3/5 w-3/5 lg:h-2/6 xl:w-2/5 2xl:w-2/5 top-[15%] lg:top-[10%] left-[25%] rounded-md border-4 p-4' style={{backgroundColor: "#F1D6AE", borderColor: "#B59376", zIndex: 5}}>
    <p className="text-md md:text-xl font-bold" style={{ color: "#96602E" }}>您尚未登入，請由首頁登入，並加入遊戲</p>
      <p className="text-md md:text-xl font-bold" style={{ color: "#96602E" }}>You haven't login, please login from home page.</p>
      <div className='flex justify-center'>
          <div className='p-3 lg:p-5 cursor-pointer' onClick={() => backHome()}>
              <FontAwesomeIcon icon={faHouse} size="xl" style={{color: "#B59376"}}/>
          </div>
        </div>
      </div>

    </>
  )
}

export default function Page({ params }) {

  const [eventInfo, setEventInfo] = useState('<>');

  const extendChatRoomRef = useRef(null);
  const menuRef = useRef(null);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [isGettingAuth, setIsGettingAuth] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleClickOutside = (event) => {
    if (extendChatRoomRef.current && !extendChatRoomRef.current.contains(event.target)) {
      if (menuRef.current && !menuRef.current.contains(event.target)){
      setShowChatRoom(false);
      }
    } 
    };

  useEffect(() => {
    auth.authStateReady().then(() => {
      if (auth.currentUser) {
        setIsGettingAuth(true);
      }
    });

      document.addEventListener('click', handleClickOutside);
      return () => {
      document.removeEventListener('click', handleClickOutside);
      };
  }, []);

  return (
      <>
      <HeaderBase>
        <GameHeader gameId={params.game} setShowChatRoom={setShowChatRoom} setShowInstructions={setShowInstructions} menuRef={menuRef}/>
        </HeaderBase>
        {showInstructions && <Instructions setShowInstructions={setShowInstructions}/>}
        {params.game !== "single" && showChatRoom && <Sidebar gameId={params.game} extendChatRoomRef={extendChatRoomRef}/>}
        <div className="min-h-screen py-6 px-4 lg:py-24 lg:px-12 flex w-full">
        { (params.game !== "single" && isGettingAuth) ?
          <GameSection setEventInfo={setEventInfo} eventInfo={eventInfo} gameId={params.game}/>
          : <>
            <IsNotLoginMessage/>
          </>
        }
        { params.game === "single" &&
          <GameSection setEventInfo={setEventInfo} eventInfo={eventInfo} gameId={params.game}/>
        }
          { params.game === "single" ? 
          <>
            <div className="hidden lg:flex w-1/3 flex-col justify-center items-center">
            <div className='mb-2 text-md font-bold' style={{color: "#96602E"}}>{eventInfo}</div>
            </div>
          </>
          :<>
          {isGettingAuth &&
            <div className="hidden lg:flex flex-col w-1/3 justify-center items-center">
            <div className='mb-2 text-md font-bold' style={{color: "#96602E"}}>{eventInfo}</div>
              <ChatRoom gameId={params.game}/>
              </div>
            }
          </>
          }
        </div>
      </>
      )
}