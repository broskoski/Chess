module GamesHelper
  def pieceformat(piece)
    case piece
    when 'pawn'
      'p'
    when 'rook'
      'R'
    when 'knight'
      'N'
    when 'bishop'
      'B'
    when 'queen'
      'Q'
    when 'king'
      'K'
    end   
  end
end
