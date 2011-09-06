class GamesController < ApplicationController
  respond_to :html, :json, :js
  
  def index
    @game = Game.last
    @board = ActiveSupport::JSON.decode(@game.board)
    @jsonboard = @game.board
    render :layout => "chessboard"
  end

  def show
    @game = Game.find(params[:id])
  end

  def new
    @game = Game.new
  end

  def edit
    @game = Game.find(params[:id])
  end

  def create
    @game = Game.new(params[:game])
  end

  def update
    @game = Game.find(params[:id])
    @game.update_attributes(params[:game])
    render :nothing => true
  end

  def destroy
    @game = Game.find(params[:id])
    @game.destroy
  end
end
