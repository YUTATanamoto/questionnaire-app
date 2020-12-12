import re
import os
import json
import glob
from tqdm import tqdm
import firebase_admin
from firebase_admin import db
from firebase_admin import credentials

theme = 'face'
image_dir = "/Users/yutatanamoto/tanamoto/research/art/children-drawing-analysis/children-drawing/{}".format(theme)
image_ext = ".jpg"
image_path_list = glob.glob(image_dir+'/*'+image_ext)

images = {}
image_id = 0
for image_path in tqdm(image_path_list):
    image_name = os.path.splitext(os.path.basename(image_path))[0]
    year, _, grade, class_, theme_id, student_number = re.split("_|-", image_name)
    images[image_id] = {
        "name": image_name,
        "year": int(year),
        "grade": int(grade),
        "class": int(class_),
        "theme_id": int(theme_id),
        "theme": theme,
        "student_number": int(student_number),
        "answered_at": None,
    }
    image_id += 1

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://children-drawing-annotation-default-rtdb.firebaseio.com'
})
ref = db.reference('images')
ref.set(images)

