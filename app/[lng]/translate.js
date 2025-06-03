import { i18nChessMapping } from "@/app/[lng]/components/game";

export const seoMetadata = {
  en: {
    lang: "en",
    title: "Banqi Chinese Chess",
    description:
      "A Banqi Chinese Chess online service includes single and online mode, developed by Mina.",
    url: "https://banqi-half-chess.vercel.app/en",
    author: "Ming-Jung YU",
    author2: "@Mina Influence",
    authorURL: "https://www.minayu.site/en/",
  },
  "zh-TW": {
    lang: "zh-TW",
    title: "象棋暗棋 Banqi Chinese Chess",
    description: "包含單人模式及線上連線模式的暗棋網站。",
    url: "https://banqi-half-chess.vercel.app/tw",
    author: "Ming-Jung YU",
    author2: "月水瓶 @Mina 的人生實驗室",
    authorURL: "https://www.minayu.site",
  },
};

export const homeTranslate = {
  en: {
    single: "Single Mode",
    online: "Online Mode",
    notice: "Notice: please login google account before start online game.",
    login: "Login",
    newGame: "New Game",
    joinGame: "Join Game",
    back: "Back",
    chooseSingleMode: "Choose Mode",
    playWithCom: "Play vs Computer",
    playInOnePerson: "Two Players (Same Device)",
    computer: "Single - vs Computer",
    person: "Single - Two Players",
    gameCode: "Game Code",
    gameRoomNotice: "Please copy the code for your opponent to join the game.",
    copy: "Copy Code",
    copied: "Copied",
  },
  "zh-TW": {
    single: "單機模式",
    online: "連線模式",
    notice: "注意：遊玩遊戲須先登入Google帳號",
    login: "登入",
    newGame: "新遊戲",
    joinGame: "加入遊戲",
    back: "返回",
    chooseSingleMode: "選擇模式",
    playWithCom: "對戰電腦",
    playInOnePerson: "雙人對戰（同裝置）",
    computer: "單人 - 對戰電腦",
    person: "單人 - 雙人對戰",
    gameCode: "遊戲房碼",
    gameRoomNotice: "請複製此遊戲碼讓另外一個玩家可以加入同一局遊戲。",
    copy: "複製",
    copied: "已經複製",
  },
};

const gameEventMessage = {
  en: {
    turnOn: "Turned on",
    Moved: "Moved",
    toEmptyPlace: "to empty place",
    setColor: "The color decided by the first attacker.",
    incorrectSide: "You took incorrect side chess.",
    isNotYourTurn: "This is not your turn!",
    isNotTurned: "the chess hasn't be turned!",
    cantJumpOverStep: "Can not jump over 1 step!",
    cantEactSameColor: "You can not eat same color chess.",
    cantMoveOverStep: "Chess can not move over 1 step.",
    kingCantEatSolder: "King can not eat solder.",
    canNotCommit: "can not eat",
    noAvailableMoves: "No available moves.",
  },
  "zh-TW": {
    turnOn: "翻開",
    Moved: "移動",
    toEmptyPlace: "到空位",
    setColor: "先攻方選定顏色！",
    incorrectSide: "你拿錯陣營的棋子了！",
    isNotYourTurn: "還沒輪到你下棋。",
    isNotTurned: "這個棋子還沒被翻開！",
    cantJumpOverStep: "不能跳超過一格棋盤。",
    cantEatSameColor: "你不能吃同一陣營的棋子。",
    cantMoveOverStep: "棋子不能移動超過一格。",
    kingCantEatSolder: "將不能吃兵、帥不能吃卒。",
    canNotCommit: "不能吃",
    noAvailableMoves: "無可下棋的選擇",
  },
};

export const gameBoardMessage = {
  en: {
    meName: "Me",
    opponentName: "Oppo.",
    chatButton: "SEND",
  },
  "zh-TW": {
    meName: "我方",
    opponentName: "對手",
    chatButton: "送出",
  },
};

export const instruction = {
  en: {
    rule1:
      "Only the turned chess can be moved, and only the turned chess can be attacked.",
    rule2:
      "Each chess can only move one adjacent square, and the cannon (砲/炮) can move one square, but it needs jumping to attack (allow only 1 chess between cannon and the chess you want to attack).",
    rule3:
      "Restraint relationship: King (將/帥) -> Advisor (士/仕) -> Elephant (象/相) -> Chariot (車/俥) -> Horse (馬/傌) -> Cannon (砲/炮) -> Soldier (兵/卒) -> King (將/帥).",
    rule4: "Solders (兵/卒) only can eat Solders (兵/卒) and King (將/帥). ",
    rule5: "King (將/帥) can not eat Solder (兵/卒). ",
  },
  "zh-TW": {
    rule1: "翻開的棋才能移動，只能攻擊翻開的棋。",
    rule2:
      "每個棋只能移動相鄰一格，砲/炮移動一格，但需要跳棋攻擊，與欲攻擊的棋中間必須只能存在一顆棋。",
    rule3: "剋制關係：將->士->象->車->馬->炮->兵->將。",
    rule4: "兵只能吃卒或將，卒只能吃兵或帥。",
    rule5: "將不能吃兵、帥不能吃卒。",
  },
};

export const gameEventTranslator = (lang, message, move) => {
  if (message === "turnOn") {
    const { currentChess, overChess } = move;
    return `${gameEventMessage[lang]["turnOn"]} ${currentChess.position} [${
      String(i18nChessMapping[lang][currentChess.chess.sn[0]]) ?? ""
    }] ${
      String(
        i18nChessMapping[lang].chess[currentChess.chess.sn[0]][
          currentChess.chess.type
        ]
      ) ?? ""
    }`;
  }
  if (message === "canNotCommit") {
    const { currentChess, overChess } = move;
    return `[${
      String(i18nChessMapping[lang][currentChess.chess.sn[0]]) ?? ""
    }] ${
      String(
        i18nChessMapping[lang].chess[currentChess.chess.sn[0]][
          currentChess.chess.type
        ]
      ) ?? ""
    } ${gameEventMessage[lang]["canNotCommit"]} [${
      String(i18nChessMapping[lang][overChess.chess.sn[0]]) ?? ""
    }] ${
      String(
        i18nChessMapping[lang].chess[overChess.chess.sn[0]][
          overChess.chess.type
        ]
      ) ?? ""
    }`;
  }
  if (message === "toEmptyPlace") {
    const { currentChess, overChess } = move;
    return `${gameEventMessage[lang]["Moved"]} ${currentChess.position} [${
      String(i18nChessMapping[lang][currentChess.chess.sn[0]]) ?? ""
    }] ${
      String(
        i18nChessMapping[lang].chess[currentChess.chess.sn[0]][
          currentChess.chess.type
        ]
      ) ?? ""
    } ${overChess.position} ${gameEventMessage[lang]["toEmptyPlace"]}`;
  }
  if (message === "commitChess") {
    const { currentChess, overChess } = move;
    return `${currentChess.position} [${
      String(i18nChessMapping[lang][currentChess.chess.sn[0]]) ?? ""
    }] ${
      String(
        i18nChessMapping[lang].chess[currentChess.chess.sn[0]][
          currentChess.chess.type
        ]
      ) ?? ""
    } -> ${overChess.position} [${
      String(i18nChessMapping[lang][overChess.chess.sn[0]]) ?? ""
    }] ${
      String(
        i18nChessMapping[lang].chess[overChess.chess.sn[0]][
          overChess.chess.type
        ]
      ) ?? ""
    }`;
  }
  return gameEventMessage[lang][message];
};
