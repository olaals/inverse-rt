use glob::glob;
use std::fs;

type PoseVec = Vec<Vec<Vec<f64>>>;

pub fn list_files_in_dir(dir: &str) -> Vec<String> {
    let mut files: Vec<String> = Vec::new();
    for entry in fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
        files.push(file_name);
    }
    files.sort();
    files
}

pub fn get_camera_pos(project_name: &str) -> PoseVec {
    let mut return_vec: PoseVec = Vec::new();

    let mut T_wc_paths = glob(format!("{}/scan*/T_wc.npy", scan_dirs).as_str())
        .expect("Failed to read glob pattern");

    for path in T_wc_paths {
        let reader = File::open(path).unwrap();
        let arr = Array2::<f64>::read_npy(reader).unwrap();
        let path = path.unwrap();
    }

    return return_vec;
}
