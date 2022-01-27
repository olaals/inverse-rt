print("__init__.py")
import flask
from flask_cors import CORS
from backend.create_pc import *
from backend import file_utils

app = flask.Flask(__name__)
CORS(app)

from backend import api_project_settings, expose_assets, api_pointcloud