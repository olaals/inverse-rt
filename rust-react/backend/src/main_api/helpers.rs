use glob::glob;
use ndarray::{array, Array2};
use ndarray_npy::{ReadNpyError, ReadNpyExt, WriteNpyError, WriteNpyExt};
use std::fs;
use std::fs::File;

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

pub fn get_poses(project_name: &str, npy_file: &str) -> PoseVec {
    println!("Get camera poses for project: {}", project_name);
    let mut return_vec: PoseVec = Vec::new();
    let scan_dirs = format!("scan-projects/{}/scans", project_name);

    let mut T_wc_paths = glob(format!("{}/scan*/{}", scan_dirs, npy_file).as_str())
        .expect("Failed to read glob pattern");

    for path in T_wc_paths {
        let path = path.unwrap();
        let reader = File::open(path).unwrap();
        let arr = Array2::<f64>::read_npy(reader).unwrap();
        let (rows, cols) = arr.dim();
        println!("rows: {}, cols: {}", rows, cols);
        let mut pose_vec: Vec<Vec<f64>> = Vec::new();
        for i in 0..rows {
            let mut row: Vec<f64> = Vec::new();
            for j in 0..cols {
                row.push(arr[[i, j]]);
            }
            pose_vec.push(row);
        }
        return_vec.push(pose_vec);
    }

    return return_vec;
}
