import flask
from flask import Flask, request, jsonify, send_from_directory
import os
from backend import app
import numpy as np

@app.route('/get-project-pointcloud-options', methods=['GET'])
def get_project_pointcloud_options():
    project_name = request.args.get('project')
    print("project_name: ", project_name)
    return jsonify({"project_name": project_name})
