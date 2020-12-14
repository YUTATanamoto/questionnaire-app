import re
import os
import json
import glob
import shutil
from tqdm import tqdm
import firebase_admin
from firebase_admin import db
from firebase_admin import credentials

image_root_dir = "/Users/yutatanamoto/tanamoto/research/art/children-drawing-analysis/children-drawing"
public_dir = "./images"
image_ext = ".jpg"

images = {}
image_id = 0
image_dirs = glob.glob(image_root_dir+"/*")
for image_dir in image_dirs:
    image_path_list = glob.glob(image_dir+'/*'+image_ext)
    theme = os.path.basename(image_dir)
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
        target_image_path = os.path.join(public_dir, "{}.jpg".format(image_id))
        shutil.copy(image_path, target_image_path)
        image_id += 1

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://children-drawing-annotation-default-rtdb.firebaseio.com'
})
ref = db.reference('images')
ref.set(images)

