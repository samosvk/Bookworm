# Bookworm
A tool allowing users to make and use on creating interactive lessons.

### Development:
###### Django:
Make sure that python 3.11 and pipenv are installed, and run pipenv install. If installation succeeds, run pipenv shell to run the virtual environment.

###### JS:
Make sure npm is installed and cd into frontent folder. From there, run npm install. After that execute npm run dev to compile the javascript code.

###### Visual Studio Code: 
Make sure you are in your home directory 
git clone https://github.com/samosvk/Bookworm.git 
cd into the new Bookworm directory
Have 2 terminals open in VS Code (on terminal 1 : cd into the frontend directory, then run npm install) (on terminal 2: stay in the Bookworm parent 
directory and run pipenv install)
On terminal 1: npm run & On terminal 2: Run pipenv shell 
On terminal 1: npm run dev
On terminal 2: Run python manage.py makemigrations, python manage.py migrate, python populate.py 
On terminal 2: python manage.py runserver 
On terminal 2: Copy the link and input in browser (Starting development server at http://127.0.0.1:8000/)
Feel free to hard refresh the browser to see any changes you make as you create edits to the code
