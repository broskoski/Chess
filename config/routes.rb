Chess::Application.routes.draw do
  resources :moves
  match '/trigger' => 'moves#trigger', :via => 'get'
  resources :games
  
  root :to => 'games#index'
end
