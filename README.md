# Bookworm
A tool allowing users to make and use on creating interactive lessons.

### Development:
###### Django:
Make sure that python 3.11 and pipenv are installed. To activate environment, run: 
```bash
pipenv install
pipenv shell
```
In order to make an instance of database, run:
```bash
python3 manage.py makemigrations api
python3 manage.py migrate
```
and to populate with an example book run:
```bash
python3 populate.py
```
Finally, to run the server: 
```bash
python3 manage.py runserver
```
and open the url in a browser.
###### JS:
Make sure npm is installed. Then, to compile the javascript, run: 
```bash
cd frontend
npm install
npm run dev
```
