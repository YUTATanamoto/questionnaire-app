import re
import os
import json
import glob
import shutil
from tqdm import tqdm
import firebase_admin
import matplotlib.pyplot as plt
from firebase_admin import db
from firebase_admin import credentials

target_year = 2018
target_theme = "winter-memory"
new_theme = "karuta"
cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://children-drawing-annotation-default-rtdb.firebaseio.com'
})
image_ref = db.reference('images')
images = image_ref.get()
for image_id, image_content in images.items():
    year = image_content["year"]
    theme = image_content["theme"]
    if year==target_year and theme == target_theme:
        # image_path = "./images/{}.jpg".format(image_id)
        # plt.imshow(plt.imread(image_path))
        # plt.show()
        images[image_id]["theme"] = new_theme
image_ref.update(images)