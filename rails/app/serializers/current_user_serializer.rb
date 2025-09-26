# GET http://localhost:3000/api/v1/current/user
class CurrentUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email
end
