from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import mysql.connector

host = 'localhost'
port = 3306
user = 'root'
password = 'humaninterface'
database_name = 'childfren_drawing_analysis'

updating = False

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    data = {
        'status': 'OK'
    }
    return jsonify(data)

@app.route('/questionnaires', methods=['GET', 'POST'])
def get_questionnaire():
    if request.method == 'GET':
        questionnaires = [
          {
            'id': 0,
            'descriptionRight': '好き',
            'descriptionLeft': '嫌い',
          },
          {
            'id': 1,
            'descriptionRight': '快',
            'descriptionLeft': '不快',
          },
          {
            'id': 2,
            'descriptionRight': '面白い',
            'descriptionLeft': '退屈な',
          },
          {
            'id':3,
            'descriptionRight': '豊である',
            'descriptionLeft': '豊でない',
          },
          {
            'id': 4,
            'descriptionRight': 'ポジティブである',
            'descriptionLeft': 'ポジティブでない',
          },
          {
            'id': 5,
            'descriptionRight': '明るい',
            'descriptionLeft': '暗い',
          },
          {
            'id': 6,
            'descriptionRight': '弱々しい',
            'descriptionLeft': '力強い',
          },
          {
            'id': 7,
            'descriptionRight': '平凡な',
            'descriptionLeft': '独創的な',
          },
          {
            'id': 8,
            'descriptionRight': '感情的な',
            'descriptionLeft': '理性的な',
          },
        ]
        response = {'questionnaires': questionnaires}
        return jsonify(response)

@app.route('/answers', methods=['GET', 'POST'])
def save():
    if request.method == 'POST':
        conn = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database_name,
        )
        cur = conn.cursor()
        request_json = request.json
        image_id = request_json['imageId']
        statement = '''
            UPDATE images SET answered = 1 WHERE id = {image_id};
        '''.format(
                image_id=image_id
            )
        cur.execute(statement)
        conn.commit()
        answers = request_json['answers']
        for answer in answers:
            questionnaire_id = answer['questionnaireId']
            value = answer['value']
            statement = '''
                INSERT INTO answers (image_id, questionnaire_id, value)
                    VALUES ({image_id}, {questionnaire_id}, {value})
                        ON DUPLICATE KEY UPDATE value = {value};
            '''.format(
                    image_id=image_id,
                    questionnaire_id=questionnaire_id,
                    value=value
                )
            cur.execute(statement)
            conn.commit()
        response = {'message': 'OK'}
        conn.close()
        return jsonify(response)

@app.route('/image', methods=['GET'])
def get_image():
    if request.method == 'GET':
        conn = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database_name,
        )
        cur = conn.cursor()
        statement = '''
            SELECT id FROM images WHERE answered != 1 ORDER BY RAND();
        '''
        cur.execute(statement)
        rows = cur.fetchall()
        image_id = rows[0][0]
        image = {
            'id': image_id,
            'src': 'http://localhost:5000/static/images/{}.jpg'.format(image_id)
        }
        return jsonify({'image': image})

if __name__ == "__main__":
    app.run(debug=True)
