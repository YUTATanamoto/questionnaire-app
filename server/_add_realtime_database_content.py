import re
import os
import json
import glob
import shutil
from tqdm import tqdm
import firebase_admin
from firebase_admin import db
from firebase_admin import credentials

theme = "face"
image_dir = "/Users/yutatanamoto/tanamoto/research/art/children-drawing-analysis/children-drawing"
cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://children-drawing-annotation-default-rtdb.firebaseio.com'
})
image_ref = db.reference('images')
images = image_ref.order_by_child('submitted_at').start_at(16).limit_to_first(10).get()
additional_images = {}
for image_id, image_content in images.items():
    new_key = "re_{}".format(image_id)
    additional_images[new_key] = image_content
    additional_images[new_key]["submitted_at"] = None
    image_path = "./images/{}.jpg".format(image_id)
    target_image_path = os.path.join("./images", "{}.jpg".format(new_key))
    shutil.copy(image_path, target_image_path)
image_ref.update(additional_images)