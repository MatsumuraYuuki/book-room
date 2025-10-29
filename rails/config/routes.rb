Rails.application.routes.draw do
  get "/icon.png", to: redirect("/assets/icon.png")
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  namespace :api do
    namespace :v1 do
      resources :users, only: [:show]

      namespace :current do
        resource :user, only: [:show, :update], controller: "user"
      end
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        registrations: "api/v1/auth/registrations",
      }
    end
  end

  devise_scope :api_v1_user do
    post "api/v1/auth/guest_sign_in", to: "api/v1/auth/sessions#guest_sign_in"
  end
end
