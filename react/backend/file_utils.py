import os


def get_scan_dirs(project_dir):
    project_scan_dir = os.path.join("./backend/scan-projects", project_dir, "scans")
    scan_dirs = [os.path.join(project_scan_dir, scan_dir) for scan_dir in os.listdir(project_scan_dir)]
    scan_dirs.sort()
    return scan_dirs



if __name__ == '__main__':
    project_dir = os.path.join('scan-projects', 'corner01')
    scan_dirs = get_scan_dirs(project_dir)
    for scan_dir in scan_dirs:
        print(scan_dir)

        pcs_dir = os.path.join(scan_dir, 'pcs')
        os.makedirs(pcs_dir, exist_ok=True)
        std_plane = os.path.join(pcs_dir, 'std-plane-projected')
        os.makedirs(std_plane, exist_ok=True)

        old_points_w = os.path.join(scan_dir, 'points_W.npy')
        new_points_w = os.path.join(std_plane, 'points_W.npy')
        os.rename(old_points_w, new_points_w)
