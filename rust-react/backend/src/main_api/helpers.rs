use std::fs;

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
