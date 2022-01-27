import flask
from flask import Flask, request, jsonify, send_from_directory
import os
from backend import app
import numpy as np
from backend.file_utils import get_scan_dirs

@app.route('/get-project-pointcloud-options', methods=['GET'])
def get_project_pointcloud_options():
    project_name = request.args.get('project')
    scan_dirs = get_scan_dirs(project_name)
    scan_dir1 = scan_dirs[0]
    pcs = os.listdir(os.path.join(scan_dir1, "pcs"))
    return jsonify({"pointcloud_options": pcs})


@app.route('/get-pointcloud', methods=['GET'])
def get_pointcloud():
    response = {}
    response["pointclouds"] = []
    project_name = request.args.get('project')
    pointcloud_name = request.args.get('pointcloud')
    print("project_name: ", project_name)
    print("pointcloud name: ", pointcloud_name)

    filename = "points_W.npy"
    project_scan_dir = os.path.join("./backend/scan-projects", project_name, "scans")
    scan_dirs = get_scan_dirs(project_name)


    for scan_dir in scan_dirs:
        points = np.load(os.path.join(scan_dir, "pcs", pointcloud_name, filename))

        response["pointclouds"].append(points.tolist())


    return jsonify(response)