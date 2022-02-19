use glob::glob;
use std::fs;
use std::fs::File;
use std::path::Path;

pub fn get_files_from_project(project: &str, filename: &str) -> Vec<String> {
    let res = glob(format!("scan-projects/{}/scans/scan*/{}", project, filename).as_str());
    match res {
        Ok(paths) => {
            let mut ret_vec: Vec<String> = Vec::new();
            for path in paths {
                let path_string = String::from(path.unwrap().to_str().unwrap());
                ret_vec.push(path_string);
            }
            return ret_vec;
        }
        Err(e) => {
            panic!("Error: Could not load files from project{:?}", e);
        }
    }
}

pub fn list_files_in_dir(dir: &str) -> Vec<String> {
    let mut files: Vec<String> = Vec::new();
    for entry in fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        let file_name = String::from(path.file_name().unwrap().to_str().unwrap());
        files.push(file_name);
    }
    files.sort();
    files
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn load_files() {
        let files = get_files_from_project("corner01", "T_wc.npy");
        println!("{:?}", files);
        assert_eq!(files.len(), 50);
    }
    #[test]
    fn list_files_in_dir_test() {
        let files = list_files_in_dir("scan-projects");
        println!("{:?}", files);
        assert_eq!(files.len(), 3);
        assert_eq!(files[0], "corner01");
    }

    #[test]
    fn list_img_paths() {
        let files = get_files_from_project("corner01", "scan.png");
        println!("{:?}", files);
        assert_eq!(files.len(), 50);
        assert_eq!(files[0], "scan-projects/corner01/scans/scan00/scan.png");
    }
}
