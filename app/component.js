import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'


export function Header({gameId, extendChatRoomRef}) {

    const extendRoom = () => {
        extendChatRoomRef.current = true;
      };

      const handleClickOutside = (event) => {
        if (extendChatRoomRef.current && !extendChatRoomRef.current.contains(event.target)) {
            // do nothing
        } else {
            extendChatRoomRef.current = false;
        }
        };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
        document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 h-12 md:h-12 lg:h-16" style={{backgroundColor: "#B59376",}}>
            {gameId && gameId !== "single" && 
                <div className="absolute top-0 right-0">
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