
export class ChessRules {
    isMoveSamePlace = (currentChess, overChess) => currentChess.position === overChess.position; 
    isSameSide = (currentChess, overChess) => overChess.chess !== "." && (currentChess.chess.sn[0] == overChess.chess.sn[0])
    isMoveToEmptyPlace = (overChess) => overChess.chess === "."
    isCannon = (currentChess) => currentChess.chess.type === "cannon"
    // isTurned = (overChess) =>  overChess.chess.turned
    isOverStep = (currentChess, overChess) => Math.abs(overChess.position - currentChess.position) !== 1 && Math.abs(overChess.position - currentChess.position) !== 8
    isSolderCanCommit = (currentChess, overChess) => currentChess.chess.type === "soldier" && (overChess.chess.weight === 1 || overChess.chess.weight === 9)
    isKingCanCommit = (currentChess, overChess) => currentChess.chess.type === "king" && overChess.chess.weight === 1
    canCommit = (currentChess, overChess) => currentChess.chess.weight >= overChess.chess.weight
    canNotCommit = (currentChess, overChess) => currentChess.chess.weight < overChess.chess.weight
  }