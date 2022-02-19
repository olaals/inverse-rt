use crate::geometry::common::file_utils::*;
use crate::geometry::common::image_utils::*;
use crate::geometry::common::vec::*;
use crate::geometry::common::view_geo::*;
use rayon::prelude::*;

#[derive(Debug)]
struct PathStruct {
    img_path: String,
    K_path: String,
    T_wc_path: String,
    T_cl_path: String,
}

impl PathStruct {
    fn new(img_path: &str, K_path: &str, T_wc_path: &str, T_cl_path: &str) -> PathStruct {
        PathStruct {
            img_path: String::from(img_path),
            K_path: String::from(K_path),
            T_wc_path: String::from(T_wc_path),
            T_cl_path: String::from(T_cl_path),
        }
    }
}

fn combine_paths_to_struct(
    paths_vec: &Vec<String>,
    K_paths_vec: &Vec<String>,
    T_wc_paths_vec: &Vec<String>,
    T_cl_paths_vec: &Vec<String>,
) -> Vec<PathStruct> {
    let mut path_struct_vec: Vec<PathStruct> = Vec::new();
    for i in 0..paths_vec.len() {
        path_struct_vec.push(PathStruct::new(
            paths_vec.get(i).unwrap().as_str(),
            K_paths_vec.get(i).unwrap().as_str(),
            T_wc_paths_vec.get(i).unwrap().as_str(),
            T_cl_paths_vec.get(i).unwrap().as_str(),
        ));
    }
    return path_struct_vec;
}

fn transf_to_plane_normal_and_transl(transf: &SE3) -> (UnitVec3, Vec3) {
    let (rot, transl) = transf.decompose();
    let plane_normal = rot.get_x_vec();
    return (plane_normal, transl);
}

fn project_pixel(img_coord: &ImgCoord, K: &CameraMatrix, T_wc: &SE3, T_cl: &SE3) -> Point3 {
    let (rx, t_cl) = transf_to_plane_normal_and_transl(T_cl);
    let s = K.transform_img_coord(img_coord);
    let u4 = t_cl.dot(&s);
    let denom = s.dot_unit(&rx);
    let z = u4 / denom;
    let point = Point3::from_vec(&s.scale(z));
    let point_W = T_wc.transform_point(&point);
    return point_W;
}

fn load_and_project(path_struct: &PathStruct) -> Vec<Point3> {
    let img_coords = load_and_filter_image(path_struct.img_path.as_str(), 60);
    let T_wc = SE3::from_npy(path_struct.T_wc_path.as_str());
    let T_wl = SE3::from_npy(path_struct.T_cl_path.as_str());
    let K = CameraMatrix::from_npy(path_struct.K_path.as_str());
    let mut ret_vec: Vec<Point3> = Vec::new();
    for img_coord in img_coords {
        let point = project_pixel(&img_coord, &K, &T_wc, &T_wl);
        ret_vec.push(point);
    }
    return ret_vec;
}

pub fn project_from_dir(project_name: &str) -> Vec<Vec<Point3>> {
    let img_paths = get_files_from_project(project_name, "scan.png");
    let T_cl_paths = get_files_from_project(project_name, "T_cl.npy");
    let T_wc_paths = get_files_from_project(project_name, "T_wc.npy");
    let K_paths = get_files_from_project(project_name, "K.npy");
    let path_vec = combine_paths_to_struct(&img_paths, &K_paths, &T_wc_paths, &T_cl_paths);
    let ret_vec = path_vec
        .par_iter()
        .map(|path_struct| load_and_project(path_struct))
        .collect();
    return ret_vec;
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
