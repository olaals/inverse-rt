import flask

# Create standrad template for flask
app = flask.Flask(__name__)
# create a route for the root of the site
@app.route('/')
def index():
    return flask.render_template('index.html')
# run the app
if __name__ == '__main__':
    app.run()
