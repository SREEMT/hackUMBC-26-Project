class ImageController < ApplicationController
  def show
    image_url = "#{request.base_url}/images/ruby_on_rails_test_image.png"
    render json: { image_url: image_url }
  end
end