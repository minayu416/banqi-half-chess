export class ChessRules {
  isMoveSamePlace = (currentChess, overChess) =>
    currentChess.position === overChess.position;
  isSameSide = (currentChess, overChess) =>
    overChess.chess !== "." &&
    currentChess.chess.sn[0] == overChess.chess.sn[0];
  isMoveToEmptyPlace = (overChess) => overChess.chess === ".";
  isCannon = (currentChess) => currentChess.chess.type === "cannon";
  // isTurned = (overChess) =>  overChess.chess.turned
  isOverStep = (currentChess, overChess) =>
    Math.abs(overChess.position - currentChess.position) !== 1 &&
    Math.abs(overChess.position - currentChess.position) !== 8;
  isSolderCanCommit = (currentChess, overChess) =>
    currentChess.chess.type === "soldier" &&
    (overChess.chess.weight === 1 || overChess.chess.weight === 9);
  isKingCanCommit = (currentChess, overChess) =>
    currentChess.chess.type === "king" && overChess.chess.weight === 1;
  canCommit = (currentChess, overChess) =>
    currentChess.chess.weight >= overChess.chess.weight;
  canNotCommit = (currentChess, overChess) =>
    currentChess.chess.weight < overChess.chess.weight;

  isLegelMove = (currentChess, overChess, shuffledChess) => {
    const legelMove = { message: null, move: null };

    if (!currentChess.chess.turned) {
      legelMove["message"] = "turnOn";
      legelMove["move"] = { currentChess: currentChess, overChess: null };
      return legelMove;
    }

    if (overChess.chess !== ".") {
      if (!overChess.chess.turned) {
        legelMove["message"] = "isNotTurned";
        return legelMove;
      }
    }

    if (this.isMoveSamePlace(currentChess, overChess)) {
      legelMove["message"] = "<>";
      return legelMove;
    }

    if (this.isMoveToEmptyPlace(overChess)) {
      // moving to another empty place
      if (
        Math.abs(overChess.position - currentChess.position) === 1 ||
        Math.abs(overChess.position - currentChess.position) === 8
      ) {
        legelMove["move"] = {
          currentChess: currentChess,
          overChess: overChess,
        };
        legelMove["message"] = "toEmptyPlace";
        return legelMove;
      } else {
        legelMove["message"] = "cantJumpOverStep";
        return legelMove;
      }
    }

    // 同個棋子不能吃
    if (this.isSameSide(currentChess, overChess)) {
      legelMove["message"] = "cantEatSameColor";
      return legelMove;
    }

    if (this.isCannon(currentChess)) {
      // x axis: abs(over.position - current.position) === 2
      if (Math.abs(overChess.position - currentChess.position) === 2) {
        let a = currentChess.position;
        let b = overChess.position;
        if (a > b) {
          [a, b] = [b, a];
        }
        if (shuffledChess[b - 1] !== ".") {
          legelMove["message"] = "commitChess";
          legelMove["move"] = {
            currentChess: currentChess,
            overChess: overChess,
          };
          return legelMove;
        }
        return legelMove;
      }
      if (Math.abs(overChess.position - currentChess.position) <= 7) {
        let a = currentChess.position;
        let b = overChess.position;
        if (a > b) {
          [a, b] = [b, a];
        }
        const resultArray = [];
        for (let i = a + 1; i < b; i++) {
          resultArray.push(i);
        }

        let empty = 0;
        for (let i = 0; i < resultArray.length; i++) {
          if (shuffledChess[resultArray[i]] !== ".") {
            empty++;
          }
        }

        if (empty === 1) {
          legelMove["move"] = {
            currentChess: currentChess,
            overChess: overChess,
          };
          legelMove["message"] = "commitChess";
          return legelMove;
        }
        return legelMove;
      }
      // y axis: abs(over.position - current.position) === (16 or 24)
      if (Math.abs(overChess.position - currentChess.position) === 16) {
        legelMove["message"] = "commitChess";
        legelMove["move"] = {
          currentChess: currentChess,
          overChess: overChess,
        };
        return legelMove;
      }
      if (Math.abs(overChess.position - currentChess.position) === 24) {
        let a = currentChess.position;
        let b = overChess.position;
        if (a > b) {
          [a, b] = [b, a];
          const mid = a + (b - a) / 2;
          const indexes = [mid - 4, mid + 4];
          let empty = 0;
          for (let i = 0; i < indexes.length; i++) {
            if (shuffledChess[indexes[i]] !== ".") {
              empty++;
            }
          }
          // 確保中間只有一個棋子
          if (empty === 1) {
            legelMove["message"] = "commitChess";
            legelMove["move"] = {
              currentChess: currentChess,
              overChess: overChess,
            };
            return legelMove;
          }
          return legelMove;
        }
      }
      return legelMove;
    }

    // Except cannon, other chess can not move over 1 step.
    if (this.isOverStep(currentChess, overChess)) {
      legelMove["message"] = "cantMoveOverStep";
      return legelMove;
    }
    if (this.isSolderCanCommit(currentChess, overChess)) {
      legelMove["message"] = "commitChess";
      legelMove["move"] = { currentChess: currentChess, overChess: overChess };
      return legelMove;
    }
    if (this.isKingCanCommit(currentChess, overChess)) {
      legelMove["message"] = "kingCantEatSolder";
      return legelMove;
    }
    if (this.canCommit(currentChess, overChess)) {
      legelMove["message"] = "commitChess";
      legelMove["move"] = { currentChess: currentChess, overChess: overChess };
      return legelMove;
    }

    if (this.canNotCommit(currentChess, overChess)) {
      legelMove["message"] = "canNotCommit";
      legelMove["move"] = { currentChess: currentChess, overChess: overChess };
      return legelMove;
    }
  };
  // TODO: 判斷贏跟輸的函式，並在最後沒有步數可以下的時候顯示結算
  isWinOrLose = (shuffledChess) => {
    // console.log(shuffledChess);
    // TODO: 都打開了
    // TODO: 只剩下單色
    // TODO: 只剩下砲，棋又小於 4
    // TODO: 計算誰被吃
  };
}
