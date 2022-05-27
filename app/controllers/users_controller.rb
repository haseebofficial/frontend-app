class UsersController < ApplicationController
  before_filter :authenticate_user!

  def index
    @users = User.all if current_user.is_admin?
  end

  def show
    @user = User.find(params[:id])
    authorize_action_for(@user)
  end

  def update
    @user = User.find(params[:id])
    authorize_action_for(@user)
    if @user.update_attributes(params[:user].permit!)
      redirect_to users_path, :notice => "User updated."
    else
      redirect_to users_path, :alert => "Unable to update user."
    end
  end
    
  def destroy
    user = User.find(params[:id])
    authorize_action_for(user)
    unless user == current_user
      user.destroy
      redirect_to users_path, :notice => "User deleted."
    else
      redirect_to users_path, :notice => "Can't delete yourself."
    end
  end
end