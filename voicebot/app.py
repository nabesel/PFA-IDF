from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from preprocessvoice import get_response

app= Flask(__name__)
CORS(app)
@app.get("/")

@app.post("/predict")
def predict():
    file = request.files['audio']
    loc='C:/Users/Lenovo/Documents/GitHub/darija interpreter/' + file.filename
    file.save(loc)
    text=[loc]
    response=get_response(text)
    try:
        message={"predict": response[0],"lang":response[1],"text": response[2]}
    except:
        message={"predict": response[0],"lang": "fr","text": ""}
    print(message)
    return jsonify(message)
if __name__== "__main__":
    app.run(debug=True)