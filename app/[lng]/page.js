"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useTranslation } from '../i18n/client'

import { auth, signInWithGoogle, SignOut } from "../firebase";

import { useAuthState } from 'react-firebase-hooks/auth';

import { HeaderBase, HomeHeader, generateUniqueRandomGameCode } from "../component";



function LoginInfo({user}){

  return (
    <>
    <div className="flex py-1 px-2 border rounded-md mb-2 lg:mb-4" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
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



export default function Home({ params: { lng } }) {
  const { t } = useTranslation(lng)

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

  useEffect(() => {
    if (!['tw', 'en'].includes(lng)){
      router.push(`/`);
    }
  }, []);
  
  const newGame = async () => {
    if (user) {
      try {
        const randomCode = await generateUniqueRandomGameCode();

        if (randomCode) {
          router.push(`/${lng}/${randomCode}/`); 
        } else {
          console.error("Failed to generate a unique game ID");
        }
      } catch (error) {
        console.error("Error creating new game:", error);
      } finally {
      }
    }
  };

  const joinGame = (event) => {
    event.preventDefault();
    if (user){
      router.push(`/${lng}/${formValue}/`);
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
    router.push(`/${lng}/single/`);
  };

  return (
    <main className="">
      <HeaderBase>
        <HomeHeader lng={lng} />
      </HeaderBase>
      <div className="mt-16 lg:mt-32 flex justify-center items-center">
      <div className="w-5/6 md:w-3/6 lg:w-2/6 border rounded-md py-6 px-2 lg:px-8 lg:py-8 drop-shadow-md" style={{backgroundColor: "#9C836A", borderColor: "#B59376"}}>
      <p className="text-2xl md:text-3xl font-bold text-center mb-2 lg:mb-2" style={{color: "#FFF3E8"}}>暗棋</p>
      <p className="text-2xl md:text-3xl font-bold text-center mb-4 lg:mb-6" style={{color: "#FFF3E8"}}>Banqi Chinese Chess</p>
      { multiPlayerMode &&
      <p className={`${user ? "mb-3 lg:mb-4" : "mb-3 lg:mb-8"} text-center italic text-sm`} style={{color: "#FFF3E8"}}>{t('home.notice')}</p>
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
          <p className="text-xl font-bold text-center" style={fontStyle}>{t('home.login')}</p>
        </button>
        }

        {isJoinGame ? <>
          <form onSubmit={joinGame} className='rounded-lg flex flex-col justify-center items-center'>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter game code." className="p-2 mb-2 lg:my-3 placeholder:text-gray-400 text-sm border rounded-lg font-bold" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376", color: "#96602E"}} />

          <button type="submit" disabled={!formValue} className={`w-full rounded-lg py-1 mb-2 lg:mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
            <p className="text-xl font-bold text-center" style={fontLockStyle}>加入</p>
          </button>

          </form>
          <button onClick={() => back()} className="w-2/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>{t('home.back')}</p>
        </button>
        </> :
        <>
        <button onClick={() => newGame()} className={`w-2/5 rounded-lg py-1 mb-2 lg:mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontLockStyle}>{t('home.newGame')}</p>
        </button>
        <button onClick={() => inVokeJoinGame()} className={`w-2/5 rounded-lg py-1 mb-2 lg:mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontLockStyle}>{t('home.joinGame')}</p>
        </button>
        <button onClick={() => back()} className="w-2/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>{t('home.back')}</p>
        </button>
        </>
        }
        </>
        : 
        <>
        <button onClick={() => newSingleGame()} className="w-2/5 rounded-lg py-1 mb-3 shadow-md hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>{t('home.single')}</p>
        </button>
        <button onClick={() => multiGame()} className="w-2/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>{t('home.online')}</p>
        </button>
        </>
}
        </div>
      </div>
      </div>


    </main>
  );
}
