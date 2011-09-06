class AddEnpassantabletoMoves < ActiveRecord::Migration
  def change
    add_column :moves, :enpassantable, :boolean
  end
end
