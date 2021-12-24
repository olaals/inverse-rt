from flask import Flask, request, jsonify, render_template, send_from_directory
import random
from PIL import Image
import numpy as np

# create flask app
app = Flask(__name__, static_folder='frontend/dist/assets', template_folder='frontend/dist')
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

