import flask
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import os
from backend import app


# standard flask app
print("running project settings")


# get request from localhost 3000 with /hello
@app.route('/hello', methods=['GET'])
@cross_origin()
def hello():
    # return json response
    return jsonify({'message': 'Hello World!'})

@app.route('/get-project-names', methods=['GET'])
@cross_origin()
def get_project_names():
    print(os.listdir("."))
    project_names = os.listdir("./backend/scan-projects")
    project_names.sort()
    return jsonify({"project_names": project_names})

@app.route('/get-mesh', methods=['GET'])
@cross_origin()
def get_mesh():
    project_name = request.args.get('project')
    path = os.path.join("./scan-projects", project_name)
    filename = "object.obj"
    return send_from_directory(path, filename, as_attachment=True)



