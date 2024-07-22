import React from 'react';
import { useRouter } from "next/navigation";

import { checkGameIdExists } from "./firebase";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHouse, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'


export function HeaderBase({children}){
    return (
        <div className="fixed inset-x-0 top-0 h-12 md:h-12 lg:h-16" style={{backgroundColor: "#B59376",}}>
        {children}
        </div>
    );
}

export function GameHeader({lng, gameId, setShowChatRoom, setShowInstructions, menuRef}) {

    const router = useRouter();

    const extendRoom = () => {
        setShowChatRoom(true);
      };

      const backHome = () => {
        router.push(`/${lng}/`);
      };

    const showInstructions = () => {
        setShowInstructions(true);
      };

    return (
        <>
            <div className='absolute top-0 left-0 flex'>
            <div className='p-3 lg:p-5 cursor-pointer' onClick={() => backHome()}>
                <FontAwesomeIcon icon={faHouse} size="xl" style={{color: "#F1D6AE", borderColor: "#3C3B3B"}}/>
            </div>
            <div ref={menuRef} className='p-3 lg:p-5 cursor-pointer' onClick={() => showInstructions()}>
            <FontAwesomeIcon icon={faCircleQuestion} size="xl" style={{color: "#F1D6AE", borderColor: "#3C3B3B"}}/>
            </div>
            </div>
            {gameId && gameId !== "single" && 
                <div ref={menuRef} className="absolute top-0 right-0 lg:hidden">
                    <div className='p-3' onClick={() => extendRoom()}>
                    <FontAwesomeIcon icon={faComment} size="xl" style={{color: "#F1D6AE", borderColor: "#3C3B3B"}}/>
                    </div>
                </div>
            }
        </>
    );
  }


function generateRandomCode() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let randomCode = '';
for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
}
return randomCode;
}

export async function generateUniqueRandomGameCode(maxAttempts = 5) {
    let randomCode;
    let exists = true;
    let attempts = 0;

    while (exists && attempts < maxAttempts) {
      randomCode = generateRandomCode()
      try {
        exists = await checkGameIdExists(randomCode); 
      } catch (error) {
        console.error("Error in generateUniqueRandomCode:", error);
        return null; 
      }
      attempts++;
    }
  
    if (exists) {
      throw new Error("Unable to generate a unique game ID after maximum attempts");
    }
  
    return randomCode;
  }