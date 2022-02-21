use crate::geometry::common::file_utils::*;
use crate::geometry::common::image_utils::*;
use crate::geometry::common::vec::*;
use crate::geometry::common::view_geo::*;
use itertools::izip;

pub struct ScanParams {
    T_wc: SE3,
    T_cl: SE3,
    T_wl: SE3,
    K: CameraMatrix,
    scan_img: RawScanImage,
}
impl ScanParams {
    pub fn new(
        T_wc: SE3,
        T_cl: SE3,
        T_wl: SE3,
        K: CameraMatrix,
        scan_img: RawScanImage,
    ) -> ScanParams {
        ScanParams {
            T_wc,
            T_cl,
            T_wl,
            K,
            scan_img,
        }
    }
}

pub struct ScanParamsVec {
    vec: Vec<ScanParams>,
}
impl ScanParamsVec {
    pub fn new() -> ScanParamsVec {
        ScanParamsVec { vec: Vec::new() }
    }
    pub fn push(&mut self, scan_params: ScanParams) {
        self.vec.push(scan_params);
    }
    pub fn iter(&self) -> std::slice::Iter<ScanParams> {
        self.vec.iter()
    }
    pub fn fill_from_project(&mut self, project_name: &str) {
        let img_paths = get_files_from_project(project_name, "scan.png");
        let T_cl_paths = get_files_from_project(project_name, "T_cl.npy");
        let T_wc_paths = get_files_from_project(project_name, "T_wc.npy");
        let K_paths = get_files_from_project(project_name, "K.npy");
        for (img_path, K_path, T_wc_path, T_cl_path) in
            izip!(img_paths, K_paths, T_wc_paths, T_cl_paths)
        {
            let raw_img = load_image(&img_path);
            let K = CameraMatrix::from_npy(&K_path);
            let T_wc = SE3::from_npy(&T_wc_path);
            let T_cl = SE3::from_npy(&T_cl_path);
            let T_wl = T_wc.transform_SE3(&T_cl);
            let scan_params = ScanParams::new(T_wc, T_cl, T_wl, K, raw_img);
            self.vec.push(scan_params);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn fill_scan_params() {
        let mut scan_params_vec = ScanParamsVec::new();
        scan_params_vec.fill_from_project("corner01");
        assert_eq!(scan_params_vec.vec.len(), 50);
    }
}
