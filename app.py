from flask import Flask, render_template, redirect, url_for, request, flash

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Replace with a secure key in production

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/create-quiz')
def create_quiz():
    return render_template('create_quiz.html')

@app.route('/login')
def login():
    return "<h1>Login page placeholder</h1>"

@app.route('/viewquiz')
def viewquiz():
    return "<h1>Quiz list placeholder</h1>"

if __name__ == '__main__':
    app.run(debug=True)
