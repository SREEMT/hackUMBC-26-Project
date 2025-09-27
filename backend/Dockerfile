FROM ruby:3.4.5

# system dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs curl git

# install yarn (optional if frontend builds outside)
RUN corepack enable

WORKDIR /app

# gems first for caching
COPY backend/Gemfile backend/Gemfile.lock ./
RUN gem install bundler -v 2.4.20
RUN bundle config set --local without 'development test' || true
RUN bundle install

# copy app
COPY backend/ ./

# expose
EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
