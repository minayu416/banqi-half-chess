"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";

import { useRouter } from "next/navigation";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

import {
  i18nChessMapping,
  chessStyle,
  ChessShuffleHandler,
  Instructions,
} from "@/app/[lng]/components/game";

import { HeaderBase, GameHeader } from "@/app/component";
import { ChessRules } from "@/app/[lng]/components/rules";
import {
  gameEventTranslator,
  gameBoardMessage,
  homeTranslate,
} from "@/app/[lng]/translate";
import { easyComputer } from "@/app/[lng]/components/computer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faXmark, faHouse } from "@fortawesome/free-solid-svg-icons";

// 可能要在這一層render 不同的棋子
function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable_${props.position}`,
    data: {
      sn: props.chess.sn,
      position: props.position,
      chess: props.chess,
    },
  });

  const style = {
    color: props.chess.sn[0] == "0" ? "black" : "red",
    touchAction: "none",
  };

  if (transform) {
    style["transform"] = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    style["zIndex"] = 10;
  }

  return (
    <>
      {props.chess == "." ? (
        <div>{null}</div>
      ) : (
        <div
          ref={setNodeRef}
          // ref={props.currentUser === props.sequence ? setNodeRef : null}
          key={props.children.sn}
          className={`absolute rounded-full w-14 h-14 lg:w-20 lg:h-20 drop-shadow-lg flex justify-center items-center`}
          style={{ backgroundColor: "#F1D6AE", ...style }}
          {...listeners}
          {...attributes}
        >
          {!props.children.turned ? (
            // 蓋牌
            <div className="rounded-full w-[2.5rem] h-[2.5rem] lg:w-[4.5rem] lg:h-[4.5rem] flex justify-center items-center">
              {/* <p className="text-5xl lxgw-wenkai-tc-regular select-none" style={{ color: props.children.color }}>{ props.children.chineseName }
      </p> */}
            </div>
          ) : (
            <div
              className="transition-transform ease-in-out duration-500 rounded-full w-[2.5rem] h-[2.5rem] lg:w-[4.5rem] lg:h-[4.5rem] border-2 flex justify-center items-center"
              style={{
                borderColor: props.children.color,
                transform: "rotateY(180deg)",
              }}
            >
              <p
                className="text-3xl lg:text-5xl lxgw-wenkai-tc-regular select-none"
                style={{
                  color: props.children.color,
                  transform: "rotateY(180deg)",
                }}
              >
                {props.children.chineseName}
              </p>
            </div>
          )}
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
      chess: props.chess,
    },
  });

  const style = {
    background: isOver ? "rgba(255, 255, 255, 0.3)" : undefined,
  };

  return (
    <div
      key={props.position}
      ref={setNodeRef}
      // ref={props.currentUser === props.sequence ? setNodeRef : null}
      className="relative w-full h-full border flex justify-center items-center"
      style={{ borderColor: "#3C3B3B", ...style }}
    >
      {props.children}
    </div>
  );
}

function Board({
  lng,
  singleMode,
  currentUser,
  opponent,
  side,
  setSide,
  sequence,
  changeSequence,
  setEventInfo,
}) {
  const [shuffledChess, setShuffledChess] = useState([]);
  const showUserSide = currentUser.displayName;
  const showOpponentSide = opponent.displayName;

  useEffect(() => {
    // 第一次 load 時先random 棋子、但未來要改成存進localStorage+更新firestore 以防止使用者F5刷新
    const randomChess = ChessShuffleHandler();
    setShuffledChess(randomChess);
  }, []);

  useEffect(() => {
    if (singleMode === "computer" && sequence === opponent.displayName) {
      const timer = setTimeout(() => {
        const { message, move } = easyComputer(
          shuffledChess,
          side[opponent.displayName],
          rules
        );
        const translatedMessage = gameEventTranslator(lng, message, move);
        if (move) {
          emitChange(translatedMessage, move);
        } else {
          setEventInfo(translatedMessage);
        }
      }, 1000); // 模擬思考時間
      return () => clearTimeout(timer);
    }
  }, [shuffledChess, sequence]);

  const rules = useMemo(() => new ChessRules(), []);

  function emitChange(translatedMessage, move) {
    const { currentChess, overChess } = move;
    const updatedChess = [...shuffledChess];
    if (!currentChess.chess.turned) {
      const turnedChess = { ...currentChess.chess };
      turnedChess.turned = true;
      updatedChess[currentChess.position] = turnedChess;
    } else {
      updatedChess[currentChess.position] = ".";
      updatedChess[overChess.position] = currentChess.chess;
      updatedChess[overChess.position].position = overChess.position;
    }
    setShuffledChess(updatedChess);
    changeSequence(currentUser.uid);
    setEventInfo(translatedMessage);
  }

  function handleDragEnd(event) {
    let activeEvent = event.active;
    let overEvent = event.over;

    if (!activeEvent?.data?.current || !overEvent?.data?.current) {
      return;
    }

    let activeData = activeEvent.data.current;
    let overData = overEvent.data.current;

    if (singleMode === "computer" && currentUser.displayName !== sequence) {
      const translatedMessage = gameEventTranslator(lng, "isNotYourTurn", null);
      setEventInfo(translatedMessage);
      return;
    }

    if (activeData.chess.turned && activeData.chess.sn[0] !== side[sequence]) {
      const translatedMessage = gameEventTranslator(lng, "incorrectSide", null);
      setEventInfo(translatedMessage);
      return;
    }

    const { message, move } = rules.isLegelMove(activeData, overData);
    const translatedMessage = gameEventTranslator(lng, message, move);
    if (move) {
      emitChange(translatedMessage, move);
    } else if (message) {
      setEventInfo(translatedMessage);
    }
    if (side === null) {
      let newSide = {
        [showUserSide]: activeData.chess.sn[0],
        [showOpponentSide]: activeData.chess.sn[0] === "b" ? "r" : "b",
      };

      setSide(newSide);
      const translatedMessage = gameEventTranslator(lng, "setColor", null);
      setEventInfo(translatedMessage);
    }
  }
  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="w-full h-full grid grid-cols-8">
          {shuffledChess.map((chess, index) => {
            return (
              // 這是方格, 先暫時用index 給格子編號
              <DroppableCell
                key={index}
                position={index}
                chess={chess}
                currentUser={currentUser}
                sequence={sequence}
              >
                {/* <div key={index} className="relative w-full h-full border flex justify-center items-center" style={{ borderColor: "#3C3B3B" }}> */}
                {/* 棋子 */}
                {chess == "." ? (
                  <div>{null}</div>
                ) : (
                  <Draggable
                    position={index}
                    chess={chess}
                    currentUser={currentUser}
                    sequence={sequence}
                  >
                    {chess}
                  </Draggable>
                )}
                {/* </div> */}
              </DroppableCell>
            );
          })}
        </div>
      </DndContext>
    </>
  );
}

function GameSection({ singleMode, setEventInfo, eventInfo, params }) {
  const [side, setSide] = useState(null);
  const [sequence, setSequence] = useState(null);

  const [currentUser, setCurrentUser] = useState({});
  const [opponent, setOpponent] = useState({});

  const lng = params.lng;

  const showUserSide = currentUser.displayName;
  const showOpponentSide = opponent.displayName;

  useEffect(() => {
    const me = {
      uid: "@single22336",
      displayName: gameBoardMessage[lng].meName,
    };
    const opponentSide = {
      uid: "@single18732",
      displayName: gameBoardMessage[lng].opponentName,
    };
    setCurrentUser(me);
    setOpponent(opponentSide);
    setSequence(me.displayName);
  }, []);
  // TODO: 可以重構
  function changeSequence() {
    // if (gameId !== "single") {
    //   if (currentUser.uid === sequence) {
    //     setSequence(opponent.uid);
    //     updateSequence(gameId, opponent.uid);
    //   } else {
    //     setSequence(currentUser.uid);
    //     updateSequence(gameId, currentUser.uid);
    //   }
    // } else {
    if (currentUser.displayName === sequence) {
      setSequence(opponent.displayName);
    } else {
      setSequence(currentUser.displayName);
    }
    // }
  }

  return (
    <div className="w-full lg:w-2/3 flex flex-row-reverse lg:flex-col justify-center items-center">
      <div
        className={`ml-2.5 lg:m-auto w-[10%] h-4/6 lg:w-2/4 lg:h-auto border border flex flex-col lg:flex-row justify-center items-center`}
        style={{ backgroundColor: "#FFFBF8", borderColor: "#B59376" }}
      >
        <div className="mt-2 pl-0 py-0 lg:pl-3 lg:py-2 lg:mt-0 w-10 h-10 lg:w-14 lg:h-14">
          {opponent.photoURL ? (
            <img src={opponent.photoURL} className="rounded-xl" />
          ) : (
            <div
              className="w-full h-full border rounded-xl"
              style={{
                backgroundColor: "#FFF3E8",
                borderColor: "#B59376",
                color: "#96602E",
              }}
            ></div>
          )}
        </div>
        <div className="p-2 lg:p-5 font-bold" style={{ color: "#96602E" }}>
          {opponent.displayName}
        </div>
        <div className="py-2 m-auto">
          {side && side[showOpponentSide] && (
            <div
              className={`rounded-full p-1 flex justify-center items-center`}
              style={{ backgroundColor: "#F1D6AE", borderColor: "#B59376" }}
            >
              <div
                className="rounded-full px-1 border-2 flex justify-center items-center"
                style={{
                  borderColor: chessStyle[side[showOpponentSide]].color,
                }}
              >
                <p
                  className="text-3xl lxgw-wenkai-tc-regular select-none"
                  style={{ color: chessStyle[side[showOpponentSide]].color }}
                >
                  {chessStyle[side[showOpponentSide]].king}
                </p>
              </div>
            </div>
          )}
        </div>
        <div>
          {currentUser.displayName !== sequence && (
            <FontAwesomeIcon
              icon={faFlag}
              size="xl"
              className="p-4"
              style={{ color: "#FFD43B" }}
            />
          )}
        </div>
      </div>

      {/* Banqi bg another option: #9C836A*/}
      <div className="h-5/6 lg:h-3/5 w-full">
        <p
          className="text-center mb-1 lg:hidden text-md font-bold"
          style={{ color: "#96602E" }}
        >
          {eventInfo}
        </p>
        <div
          className="w-full h-full border rounded-md p-3"
          style={{ backgroundColor: "#96602E", borderColor: "#C18859" }}
        >
          <div
            className="w-full h-full border-2 rounded-md"
            style={{ borderColor: "#3C3B3B" }}
          >
            <Board
              lng={lng}
              singleMode={singleMode}
              currentUser={currentUser}
              opponent={opponent}
              side={side}
              setSide={setSide}
              sequence={sequence}
              changeSequence={changeSequence}
              setEventInfo={setEventInfo}
            />
          </div>
        </div>
      </div>
      <div
        className={`mr-2.5 lg:m-auto w-[10%] h-4/6 lg:w-2/4 lg:h-auto border flex flex-col lg:flex-row justify-center items-center`}
        style={{ backgroundColor: "#FFFBF8", borderColor: "#B59376" }}
      >
        <div className="mt-2 pl-0 py-0 lg:pl-3 lg:py-2 lg:mt-0 w-10 h-10 lg:w-14 lg:h-14">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} className="rounded-xl" />
          ) : (
            <div
              className="w-full h-full border rounded-xl"
              style={{
                backgroundColor: "#FFF3E8",
                borderColor: "#B59376",
                color: "#96602E",
              }}
            ></div>
          )}
        </div>
        <div className="p-2 lg:p-5 font-bold" style={{ color: "#96602E" }}>
          {currentUser.displayName}
        </div>
        <div className="p-1 m-auto">
          {side && side[showUserSide] && (
            <div
              className={`rounded-full p-1 flex justify-center items-center`}
              style={{ backgroundColor: "#F1D6AE", borderColor: "#B59376" }}
            >
              <div
                className="rounded-full px-1 border-2 flex justify-center items-center"
                style={{ borderColor: chessStyle[side[showUserSide]].color }}
              >
                <p
                  className="text-3xl lxgw-wenkai-tc-regular select-none"
                  style={{ color: chessStyle[side[showUserSide]].color }}
                >
                  {chessStyle[side[showUserSide]].king}
                </p>
              </div>
            </div>
          )}
        </div>
        <div>
          {currentUser.displayName === sequence && (
            <FontAwesomeIcon
              icon={faFlag}
              size="xl"
              className="p-4"
              style={{ color: "#FFD43B" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }) {
  const router = useRouter();

  const [eventInfo, setEventInfo] = useState("<>");

  const extendChatRoomRef = useRef(null);
  const menuRef = useRef(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [singleMode, setSingleMode] = useState(null);
  const fontStyle = {
    color: "#96602E",
  };
  const handleClickOutside = (event) => {
    if (
      extendChatRoomRef.current &&
      !extendChatRoomRef.current.contains(event.target)
    ) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowChatRoom(false);
      }
    }
  };

  const backHomePage = () => {
    router.push(`/${params.lng}`);
  };

  useEffect(() => {
    if (!["zh-TW", "en"].includes(params.lng)) {
      router.push(`/`);
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {["zh-TW", "en"].includes(params.lng) ? (
        <>
          <HeaderBase>
            <GameHeader
              lng={params.lng}
              gameId={params.game}
              setShowChatRoom={null}
              setShowInstructions={setShowInstructions}
              menuRef={menuRef}
            />
          </HeaderBase>
          {showInstructions && (
            <Instructions
              lng={params.lng}
              setShowInstructions={setShowInstructions}
            />
          )}

          <div className="min-h-screen py-6 px-4 lg:py-24 lg:px-12 flex w-full">
            <GameSection
              singleMode={singleMode}
              setEventInfo={setEventInfo}
              eventInfo={eventInfo}
              params={params}
            />

            <div className="hidden lg:flex w-1/3 flex-col justify-center items-center">
              <div
                className="mb-2 text-md font-bold"
                style={{ color: "#96602E" }}
              >
                {eventInfo}
              </div>
            </div>
          </div>

          {!singleMode && (
            <>
              <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
                <div
                  className="w-5/6 md:w-3/6 lg:w-2/6 border rounded-md py-6 px-2 lg:px-8 lg:py-8 drop-shadow-md"
                  style={{ backgroundColor: "#9C836A", borderColor: "#B59376" }}
                >
                  <p
                    className="text-2xl md:text-3xl font-bold text-center mb-4 lg:mb-6"
                    style={{ color: "#FFF3E8" }}
                  >
                    {homeTranslate[params.lng].chooseSingleMode}
                  </p>
                  <div className="flex flex-col justify-center items-center">
                    <button
                      onClick={() => setSingleMode("computer")}
                      className="w-4/5 rounded-lg py-1 mb-3 shadow-md hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                      style={{
                        backgroundColor: "#FFF3E8",
                        borderColor: "#B59376",
                      }}
                    >
                      <p
                        className="text-xl font-bold text-center"
                        style={fontStyle}
                      >
                        {homeTranslate[params.lng].playWithCom}
                      </p>
                    </button>
                    <button
                      onClick={() => setSingleMode("person")}
                      className="w-4/5 rounded-lg py-1 mb-3 shadow-md hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                      style={{
                        backgroundColor: "#FFF3E8",
                        borderColor: "#B59376",
                      }}
                    >
                      <p
                        className="text-xl font-bold text-center"
                        style={fontStyle}
                      >
                        {homeTranslate[params.lng].playInOnePerson}
                      </p>
                    </button>
                    <button
                      onClick={() => backHomePage()}
                      className="w-4/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                      style={{
                        backgroundColor: "#FFF3E8",
                        borderColor: "#B59376",
                      }}
                    >
                      <p
                        className="text-xl font-bold text-center"
                        style={fontStyle}
                      >
                        {homeTranslate[params.lng].back}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
