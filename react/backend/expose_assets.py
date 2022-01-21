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