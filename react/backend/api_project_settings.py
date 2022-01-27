import flask
from flask import Flask, request, jsonify, send_from_directory
import os
from backend import app, project_scans
import numpy as np


# standard flask app
print("running project settings")


# get request from localhost 3000 with /hello
@app.route('/', methods=['GET'])
def hello():
    # return json response
    return jsonify({'message': 'Hello World!'})

@app.route('/get-project-names', methods=['GET'])
def get_project_names():
    print("get project names")
    print(os.listdir("."))
    project_names = os.listdir("./backend/scan-projects")
    project_names.sort()
    return jsonify({"project_names": project_names})

@app.route('/get-mesh', methods=['GET'])
def get_mesh():
    project_name = request.args.get('project')
    path = os.path.join("./scan-projects", project_name)
    filename = "object.obj"
    return send_from_directory(path, filename, as_attachment=True)

@app.route('/recalculate-pointcloud', methods=['GET'])
def recalculate_pointcloud():
    project_dir = os.path.join('./backend','scan-projects', request.args.get('project'))
    #project_dir = request.args.get('project')
    points = project_scans(project_dir)
    print(points)
    
    print("recalculate pointcloud")
    project = request.args.get('project')
    return jsonify({"message": "recalculating pointcloud"})


@app.route('/get-cam-laser-poses', methods=['GET'])
def get_cam_laser_poses():
    response = {}
    response["camera_poses"] = []
    response["laser_poses"] = []
    project_name = request.args.get('project')
    project_scan_dir = os.path.join("./backend/scan-projects", project_name, "scans")
    scan_dirs = [os.path.join(project_scan_dir, scan_dir) for scan_dir in os.listdir(project_scan_dir)]
    scan_dirs.sort()

    for scan_dir in scan_dirs:
        camera_pose = np.load(os.path.join(scan_dir, "T_wc.npy"))
        laser_pose = np.load(os.path.join(scan_dir, "T_wl.npy"))

        response["camera_poses"].append(camera_pose.tolist())
        response["laser_poses"].append(laser_pose.tolist())


    return jsonify(response)







if __name__ == "__main__":
    print("hie")


