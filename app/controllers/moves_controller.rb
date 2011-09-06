class MovesController < ApplicationController
  respond_to :html, :json, :js
  
  def index
    @moves = Move.all
  end

  def new
    @move = Move.new
  end

  def create
    @move = Move.new(params[:move])
    @move.ip = request.remote_ip
    @move.save
    if params[:move][:checkmates] == "true"
      @game = Game.new
      @game.save
    end
    render :nothing => true
  end
  
  def trigger
    Pusher['chess_channel'].trigger!(params[:event], {:data => params[:data]})
    render :nothing => true
  end
  
end
