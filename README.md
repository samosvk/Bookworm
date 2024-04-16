# Bookworm

A tool allowing users to make and use on creating interactive lessons.

### Development:

###### Django:

Make sure that python 3.10 and pipenv are installed. To activate environment, run:

```bash
pipenv install
pipenv shell
```

In order to make an instance of database, run:

```bash
python3 manage.py makemigrations api
python3 manage.py migrate
```

Finally, to run the server:

```bash
python3 manage.py runserver
```

and open the url in a browser.

###### React.js:

Make sure npm is installed. Then, to compile the javascript, run:

```bash
cd frontend
npm install
npm run dev
```

### Usage:

You can add an admin user with

```bash
python manage.py createsuperuser
```

and you can then log in to this user in the application. Admins are able to create and edit books while normal users can only view books. Normal users can be created through using the registration page on the website.
