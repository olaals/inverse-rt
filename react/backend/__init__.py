print("__init__.py")
import flask
app = flask.Flask(__name__)

from backend import api_project_settings