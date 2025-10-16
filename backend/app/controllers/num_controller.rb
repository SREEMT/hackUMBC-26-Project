class NumController < ApplicationController
  def index
    number = rand(1..100)
    render json: { number: number }
  end
end