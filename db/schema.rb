# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110906062716) do

  create_table "games", :force => true do |t|
    t.string   "board",      :default => "[{\"a8\":\"rook_b_false\",\"b8\":\"knight_b_false\",\"c8\":\"bishop_b_false\",\"d8\":\"queen_b_false\",\"e8\":\"king_b_false\",\"f8\":\"bishop_b_false\",\"g8\":\"knight_b_false\",\"h8\":\"rook_b_false\"},{\"a7\":\"pawn_b_false\",\"b7\":\"pawn_b_false\",\"c7\":\"pawn_b_false\",\"d7\":\"pawn_b_false\",\"e7\":\"pawn_b_false\",\"f7\":\"pawn_b_false\",\"g7\":\"pawn_b_false\",\"h7\":\"pawn_b_false\"},{\"a6\":\"blank_e_e\",\"b6\":\"blank_e_e\",\"c6\":\"blank_e_e\",\"d6\":\"blank_e_e\",\"e6\":\"blank_e_e\",\"f6\":\"blank_e_e\",\"g6\":\"blank_e_e\",\"h6\":\"blank_e_e\"},{\"a5\":\"blank_e_e\",\"b5\":\"blank_e_e\",\"c5\":\"blank_e_e\",\"d5\":\"blank_e_e\",\"e5\":\"blank_e_e\",\"f5\":\"blank_e_e\",\"g5\":\"blank_e_e\",\"h5\":\"blank_e_e\"},{\"a4\":\"blank_e_e\",\"b4\":\"blank_e_e\",\"c4\":\"blank_e_e\",\"d4\":\"blank_e_e\",\"e4\":\"blank_e_e\",\"f4\":\"blank_e_e\",\"g4\":\"blank_e_e\",\"h4\":\"blank_e_e\"},{\"a3\":\"blank_e_e\",\"b3\":\"blank_e_e\",\"c3\":\"blank_e_e\",\"d3\":\"blank_e_e\",\"e3\":\"blank_e_e\",\"f3\":\"blank_e_e\",\"g3\":\"blank_e_e\",\"h3\":\"blank_e_e\"},{\"a2\":\"pawn_w_false\",\"b2\":\"pawn_w_false\",\"c2\":\"pawn_w_false\",\"d2\":\"pawn_w_false\",\"e2\":\"pawn_w_false\",\"f2\":\"pawn_w_false\",\"g2\":\"pawn_w_false\",\"h2\":\"pawn_w_false\"},{\"a1\":\"rook_w_false\",\"b1\":\"knight_w_false\",\"c1\":\"bishop_w_false\",\"d1\":\"queen_w_false\",\"e1\":\"king_w_false\",\"f1\":\"bishop_w_false\",\"g1\":\"knight_w_false\",\"h1\":\"rook_w_false\"}]"
    t.string   "turn",       :default => "w"
    t.string   "in_check"
    t.string   "winner"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "moves", :force => true do |t|
    t.string   "color"
    t.string   "from_square"
    t.string   "to_square"
    t.string   "notation"
    t.boolean  "puts_in_check"
    t.boolean  "checkmates"
    t.string   "ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "game_id"
    t.boolean  "enpassantable"
  end

end
