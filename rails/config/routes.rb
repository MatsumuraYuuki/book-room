Rails.application.routes.draw do
  get "/icon.png", to: redirect("/assets/icon.png")

  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
    end
  end
end
