import React from 'react';
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHouse } from '@fortawesome/free-solid-svg-icons'


export function HomeHeader(){
    return (
        <div className="fixed inset-x-0 top-0 h-12 md:h-12 lg:h-16" style={{backgroundColor: "#B59376",}}>
        </div>
    );
}

export function Header({gameId, setShowChatRoom, menuRef}) {

    const router = useRouter();

    const extendRoom = () => {
        setShowChatRoom(true);
      };

      const backHome = () => {
        router.push(`/`);
      };

    return (
        <div className="fixed inset-x-0 top-0 h-12 md:h-12 lg:h-16" style={{backgroundColor: "#B59376",}}>
            <div className='absolute top-0 left-0'>
            <div className='p-3 lg:p-5 cursor-pointer' onClick={() => backHome()}>
                <FontAwesomeIcon icon={faHouse} size="xl" style={{color: "#F1D6AE", borderColor: "#3C3B3B"}}/>
            </div>
            </div>
            {gameId && gameId !== "single" && 
                <div ref={menuRef} className="absolute top-0 right-0">
                    <div className='p-3' onClick={() => extendRoom()}>
                    <FontAwesomeIcon icon={faComment} size="xl" style={{color: "#F1D6AE", borderColor: "#3C3B3B"}}/>
                    </div>
                </div>
            }
        </div>
    );
  }


export function generateRandomCode() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let randomCode = '';
for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
}
return randomCode;
}