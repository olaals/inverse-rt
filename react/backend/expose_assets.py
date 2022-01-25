import flask
from flask import Flask, request, jsonify, send_from_directory
import os
from backend import app
import numpy as np


@app.route('/laser.obj', methods=['GET'])
def get_laser_obj():
    asset_dir = 'assets'
    filename  = "laser.obj"
    return send_from_directory(asset_dir, filename, as_attachment=True)

@app.route('/camera.obj', methods=['GET'])
def get_camera_obj():
    asset_dir = 'assets'
    filename  = "camera.obj"
    return send_from_directory(asset_dir, filename, as_attachment=True)

@app.route('/get_scan_image', methods=["GET"])
def get_scan_image():
    print("get scan image")
    project_name = request.args.get('project')
    print("project_name: ", project_name)
    scan_id = request.args.get('id')
    print("scan_id: ", scan_id)
    filename = "scan.png"
    return send_from_directory(os.path.join("./scan-projects", project_name, "scans", "scan"+scan_id), filename, as_attachment=True)