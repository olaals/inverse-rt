from flask import Flask, request, jsonify, render_template, send_from_directory
import random
from PIL import Image
import numpy as np
import os
from backend.project_manager import ProjectManager
from backend.create_pc import project_scans


# create flask app
app = Flask(__name__, static_folder='frontend/dist/assets', template_folder='frontend/dist')
project_manager = ProjectManager("backend/scan-projects")
print("started flask app")

# create standard route
@app.route('/')
def index():
    return render_template('index.html')

# create json respone at /api/v1/get_data
@app.route('/get_data', methods=['GET'])
def get_data():
    response = {}
    response["points"] = [[random.randint(0,10),random.randint(0,10),random.randint(0,10)] for x in range(0,1000)]

    # return json response
    return jsonify(response)

@app.route('/get_projects', methods=['GET'])
def get_projects():
    path = "backend/scan-projects"
    projects = os.listdir(path)
    projects.sort()
    response = {"projects": projects}
    return jsonify(response)

@app.route('/set_project', methods=['POST'])
def select_project():
    project_name = request.json["project"]
    project_manager.set_project(project_name)
    return jsonify({"status": "ok"})

@app.route('/get_pointcloud', methods=['GET'])
def get_pointcloud():
    # get project argued in request from GET
    project_name = request.args.get("project")
    print("project:", project_name)
    project_dir = os.path.join("backend/scan-projects", project_name)
    pointcloud = project_scans(project_dir)
    response = {"pointcloud": pointcloud}
    return jsonify(response)

    


@app.route('/get_mesh', methods=['GET'])
def get_mesh():
    # get mesh name argument from GET request
    project_name = request.args.get('project')
    path = os.path.join("backend/scan-projects", project_name, "object.obj")
    return send_from_directory('./', path, as_attachment=True)



@app.route('/post_data', methods=['Post'])
def post_data():
    data = request.form
    json = request.get_json()
    print("json")
    print(json)
    print("data")
    print(data)
    return jsonify({"success": True})

# route to download static file with send_from_directory
@app.route('/get_file', methods=['GET'])
def send_static_file():
    return send_from_directory('.', "backend/test.txt", as_attachment=True)

@app.route('/get_obj', methods=['GET'])
def serve_obj():
    return send_from_directory('.', "backend/object.obj", as_attachment=True)

@app.route('/post_file', methods=['POST'])
def post_file():
    file = request.files['file']
    img = Image.open(file)
    np_img = np.array(img)
    print(np_img)
    print(file)
    return jsonify({"success": True})

    # return json response


# run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)

