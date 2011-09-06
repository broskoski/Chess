class CreateMoves < ActiveRecord::Migration
  def change
    create_table :moves do |t|
      t.string :color
      t.string :from_square
      t.string :to_square
      t.string :notation
      t.boolean :puts_in_check
      t.boolean :checkmates
      t.string :ip

      t.timestamps
    end
  end
end
