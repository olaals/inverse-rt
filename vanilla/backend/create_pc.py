import numpy as np
import os
from PIL import Image
from numba import njit

#@njit
def project_pixel(pix, t_cl, rx, K_inv, T_wc):
    s = K_inv@pix
    u4 = np.dot(t_cl, rx)
    bot = np.dot(s, rx)
    x = u4/bot*s
    x = np.append(x, 1.0)
    x = x.astype(np.float32)
    x = T_wc@x
    x = x/x[-1]
    x = x[:3]
    return x


#@njit
def project_pixel_matmul(pix, t_cl, rx, K_inv, T_wc, u4):
    s = np.dot(K_inv, pix)
    bot = np.dot(s.T, rx)
    x = np.divide(s, bot)*u4
    x = np.append(x, np.ones((1,x.shape[1]), dtype=np.float32), axis=0)
    x = np.dot(T_wc, x)
    x = np.divide(x, x[-1,:])
    x = x[:3,:]
    return x

def load_image(filename):
    # load image grayscale pil
    img = Image.open(filename).convert('L')
    img = np.array(img)
    return img

def project_scans(project_dir):
    parent_scan_dirs = os.path.join(project_dir, 'scans')
    scan_dirs = [os.path.join(parent_scan_dirs,scan_dir) for scan_dir in os.listdir(parent_scan_dirs)]
    scan_dirs.sort()
    points = []
    for scan_dir in scan_dirs:
        img_path = os.path.join(scan_dir, "scan.png")
        img = load_image(img_path)

        T_cl = np.load(os.path.join(scan_dir, "T_cl.npy")).astype(np.float32)
        T_wc = np.load(os.path.join(scan_dir, "T_wc.npy")).astype(np.float32)
        K = np.load(os.path.join(scan_dir, "K.npy")).astype(np.float32)
        K_inv = np.linalg.inv(K).astype(np.float32)
        transl = T_cl[:3,-1]
        rot = T_cl[:3,:3]

        plane_normal = rot[:3,0]


        # loop through pixels in img
        for i in range(img.shape[0]):
            for j in range(img.shape[1]):
                if img[i,j] <= 20:
                    continue
                pix = np.array([j,i,1], dtype=np.float32)
                x = project_pixel(pix, transl, plane_normal, K_inv, T_wc)
                points.append(x.tolist())
    return points


def project_scans_matmul(project_dir):
    parent_scan_dirs = os.path.join(project_dir, 'scans')
    scan_dirs = [os.path.join(parent_scan_dirs,scan_dir) for scan_dir in os.listdir(parent_scan_dirs)]
    scan_dirs.sort()
    points = []
    for scan_dir in scan_dirs:
        img_path = os.path.join(scan_dir, "scan.png")
        img = load_image(img_path)

        T_cl = np.load(os.path.join(scan_dir, "T_cl.npy")).astype(np.float32)
        T_wc = np.load(os.path.join(scan_dir, "T_wc.npy")).astype(np.float32)
        K = np.load(os.path.join(scan_dir, "K.npy")).astype(np.float32)
        K_inv = np.linalg.inv(K).astype(np.float32)
        transl = T_cl[:3,-1]
        rot = T_cl[:3,:3]

        plane_normal = rot[:3,0]

        # image to pixel coordinates if value over 20
        pix = np.array([[j,i,1] for i in range(img.shape[0]) for j in range(img.shape[1]) if img[i,j]>=20], dtype=np.float32)
        pix = pix.T

        u4 = np.dot(transl, plane_normal).astype(np.float32)
        


        x = project_pixel_matmul(pix, transl, plane_normal, K_inv, T_wc, u4)
        # pixel to world coordinates
        points.extend(x.T.tolist())



    return points

if __name__ == '__main__':
    proj_dir = "scan-projects/corner01"
    import time

    start = time.time()
    points = project_scans(proj_dir)
    end = time.time()
    print(end - start)

    start = time.time()
    points2 = project_scans_matmul(proj_dir)
    end = time.time()
    print(end - start)

    print(np.shape(points))
    print(np.shape(points2))
    print(points[:5])
    print(points2[:5])