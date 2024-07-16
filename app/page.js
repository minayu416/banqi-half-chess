"use client"

import { useRouter } from "next/navigation";

import { auth, signInWithGoogle, SignOut } from "./firebase";

import { useAuthState } from 'react-firebase-hooks/auth';

import { Header, generateRandomCode } from "./component";
import { useState } from "react";


function LoginInfo({user}){

  return (
    <>
    <div className="flex py-1 px-2 border rounded-md mb-4" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
      <div className="h-10 w-10 mr-2" >
      <img src={user.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} className="rounded-full" />
      </div>
      <div className="py-2">
        <p>
        {user.displayName}
        </p>
      </div>
      <div className="m-auto">
        <SignOut/>
      </div>
    </div>
    </>
  )
}

export default function Home() {

  const router = useRouter();

  const [user] = useAuthState(auth);

  const [multiPlayerMode, setMultiPlayerMode] = useState(false)
  const [isJoinGame, setIsJoinGame] = useState(false)

  const [formValue, setFormValue] = useState('');

  const fontStyle = {
    color: "#96602E"
  }

  const fontLockStyle = {
    color: user ? "#96602E" : "#A19F9F"
  }
  
  const newGame = () => {
    if (user){
    const randomCode = generateRandomCode();
    router.push(`/${randomCode}/`);
    }
  };

  const joinGame = (event) => {
    event.preventDefault();
    if (user){
      router.push(`/${formValue}/`);
    }
  };

  const inVokeJoinGame = () => {
    setIsJoinGame(true);
  };

  const back = () => {
    if (isJoinGame){
      setIsJoinGame(false)
      setMultiPlayerMode(true)
    } else {
    setMultiPlayerMode(false)
    }
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
      <div className="w-2/6 border rounded-md p-8 drop-shadow-md" style={{backgroundColor: "#9C836A", borderColor: "#B59376"}}>
      <p className="text-4xl font-bold text-center mb-6" style={{color: "#FFF3E8"}}>暗棋 Banqi Chess</p>
      { multiPlayerMode &&
      <p className={`${user ? "mb-4" : "mb-8"} text-center italic text-sm`} style={{color: "#FFF3E8"}}>注意：遊玩遊戲須先登入Google帳號。</p>
      }
        <div className="flex flex-col justify-center items-center">
        { multiPlayerMode ?
        <>
        { user ? 
        <>
          <LoginInfo user={user} />
        </>
        :
        <button onClick={signInWithGoogle} className="w-2/5 rounded-lg py-1 mb-3 shadow-md hover:translate-x-0.5 hover:translate-y-0.5" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>登入</p>
        </button>
        }

        {isJoinGame ? <>
          <form onSubmit={joinGame} className='rounded-lg flex flex-col justify-center items-center'>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter game code." className="p-2 my-3 placeholder:text-gray-400 text-sm border rounded-lg font-bold" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376", color: "#96602E"}} />

          <button type="submit" disabled={!formValue} className={`w-full rounded-lg py-1 mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
            <p className="text-xl font-bold text-center" style={fontLockStyle}>加入</p>
          </button>

          </form>
          <button onClick={() => back()} className="w-2/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>返回</p>
        </button>
        </> :
        <>
        <button onClick={() => newGame()} className={`w-2/5 rounded-lg py-1 mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontLockStyle}>新遊戲</p>
        </button>
        <button onClick={() => inVokeJoinGame()} className={`w-2/5 rounded-lg py-1 mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontLockStyle}>加入遊戲</p>
        </button>
        <button onClick={() => back()} className="w-2/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>返回</p>
        </button>
        </>
        }
        </>
        : 
        <>
        <button onClick={() => newSingleGame()} className="w-2/5 rounded-lg py-1 mb-3 shadow-md hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>單人模式</p>
        </button>
        <button onClick={() => multiGame()} className="w-2/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
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
