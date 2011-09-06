class MoveAndGameDefaults < ActiveRecord::Migration
  def change
    change_column :games, :turn, :string, :default => 'w'
  end
end
