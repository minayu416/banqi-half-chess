"use client"

import { useRouter } from "next/navigation";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { useAuthState } from 'react-firebase-hooks/auth';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { Header, generateRandomCode } from "./component";
import { useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA8_NLNJW8mZLaNfnpqO4I9i9Q08IuVnfA",
  authDomain: "banqi-half-chess.firebaseapp.com",
  projectId: "banqi-half-chess",
  storageBucket: "banqi-half-chess.appspot.com",
  messagingSenderId: "666331770434",
  appId: "1:666331770434:web:b8e1df7f15923a346e87db",
  measurementId: "G-FCBJWRHZJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);


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

function SignOut() {
  return auth.currentUser && ( <>

      <button className="mr-2 ml-6 rounded-md text-sm font-bold" onClick={() => auth.signOut()}>登出</button>

    </>
  )
}

export default function Home() {

  const router = useRouter();

  const [user] = useAuthState(auth);

  const [multiPlayerMode, setMultiPlayerMode] = useState(false)

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

  const joinGame = () => {
    if (user){
      const randomCode = generateRandomCode();
      router.push(`/${randomCode}/`);
    }
  };

  const back = () => {
    setMultiPlayerMode(false)
  };

  const multiGame = () => {
    setMultiPlayerMode(true)
  };

  const newSingleGame = () => {
    router.push(`/single/`);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      // console.log(result)
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // const user = result.user;
    }).catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // const email = error.email;
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error)
    });
  }


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

        {/* TODO: 要先登入才給按 */}
        <button onClick={() => newGame()} className={`w-2/5 rounded-lg py-1 mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontLockStyle}>新遊戲</p>
        </button>
        <button onClick={() => joinGame()} className={`w-2/5 rounded-lg py-1 mb-3 shadow-md ${user && "hover:translate-x-0.5 hover:translate-y-0.5"} ${user ? "cursor-pointer" : "cursor-default"}`} style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontLockStyle}>加入遊戲</p>
        </button>
        <button onClick={() => back()} className="w-2/5 rounded-lg py-1 shadow-md hover:translate-x-0.5 hover:translate-y-0.5" style={{backgroundColor: "#FFF3E8", borderColor: "#B59376"}}>
          <p className="text-xl font-bold text-center" style={fontStyle}>返回</p>
        </button>
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
