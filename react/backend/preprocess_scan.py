import numpy as np
import os
import PIL
import matplotlib.pyplot as plt
from scipy.signal import convolve2d
from scipy import misc



def preprocess_scan(img, threshold=20):
    assert(len(img.shape) == 2)
    assert(type(img[0,0]) == np.uint8)

    img = img>threshold


    right = np.array([[ 0, 0,  1]])
    left = np.array([[ 1, 0,  0]])
    left_filt = convolve2d(img, left, boundary='symm', mode='same')
    right_filt = convolve2d(img, right, boundary='symm', mode='same')

    
    filtered = np.where((img & left_filt & right_filt), 1, 0)
    filtered = np.where(filtered, 255, 0).astype(np.uint8)
    return filtered

    
def preprocess_scans(project_dir, pc_dir_name):
    """
    preprocess scans by loading scan.png in each scan directory,
    then use preprocess_scan to create new images which are saved in a new directory pc_dir_name in pcs directory
    """
    parent_scan_dirs = os.path.join(project_dir, 'scans')
    scan_dirs = [os.path.join(parent_scan_dirs,scan_dir) for scan_dir in os.listdir(parent_scan_dirs)]
    scan_dirs.sort()
    for scan_dir in scan_dirs:
        img_path = os.path.join(scan_dir, "scan.png")
        img = load_image(img_path)
        pc_dir = os.path.join(scan_dir, "pcs", pc_dir_name)
        if not os.path.exists(pc_dir):
            os.mkdir(pc_dir)
        img_pc = preprocess_scan(img)
        img_pc_path = os.path.join(pc_dir, "scan.png")
        # save image using pil
        img_pc = PIL.Image.fromarray(img_pc)
        img_pc.save(img_pc_path)







if __name__ == '__main__':
    img_path = os.path.join("./scan-projects/corner01/scans/scan00/scan.png")
    # load image using PIL to numpy
    img = np.array(PIL.Image.open(img_path).convert('L'))
    preprocess_scan(img)


