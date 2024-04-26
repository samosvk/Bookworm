# base image
FROM ubuntu:latest

# set a working directory (change this if needed)
WORKDIR /Bookworm-main

# install pipenv
RUN apt-get update && apt-get install -y python3-pip && pip3 install pipenv

# install dependencies using pipenv
RUN pipenv install

# make migrations
RUN pipenv shell python3 manage.py makemigrations api

# apply migrations
RUN pipenv shell python3 manage.py migrate

# change directory to frontend
WORKDIR /Bookworm-main/frontend

# install npm dependencies
RUN apt-get install -y npm && npm install

# run npm dev server
RUN npm run dev

# go back to the root directory
WORKDIR /usr/src/app

# run Django server
CMD ["pipenv", "run", "python3", "manage.py", "runserver"]

