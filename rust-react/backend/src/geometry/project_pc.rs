use crate::geometry::common::file_utils::*;
use crate::geometry::common::image_utils::*;
use crate::geometry::common::vec::*;
use crate::geometry::common::view_geo::*;
use itertools::izip;
use rayon::prelude::*;

struct ProjectionParams {
    img_coords: Vec<ImgCoord>,
    K: CameraMatrix,
    T_wc: SE3,
    T_cl: SE3,
}

fn fill_projection_params_vec<'a>(
    img_paths_vec: &'a Vec<String>,
    K_paths_vec: &'a Vec<String>,
    T_wc_paths_vec: &'a Vec<String>,
    T_cl_paths_vec: &'a Vec<String>,
) -> Vec<ProjectionParams> {
    let mut ret_vec: Vec<ProjectionParams> = Vec::new();
    for (img_path, K_path, T_wc_path, T_cl_path) in
        izip!(img_paths_vec, K_paths_vec, T_wc_paths_vec, T_cl_paths_vec)
    {
        let img_coords = load_and_filter_image(img_path, 70);
        let K = CameraMatrix::from_npy(K_path);
        let T_wc = SE3::from_npy(T_wc_path);
        let T_cl = SE3::from_npy(T_cl_path);
        let proj_params = ProjectionParams {
            img_coords: img_coords,
            K: K,
            T_wc: T_wc,
            T_cl: T_cl,
        };
        ret_vec.push(proj_params);
    }
    return ret_vec;
}

fn transf_to_plane_normal_and_transl(transf: &SE3) -> (UnitVec3, Vec3) {
    let (rot, transl) = transf.decompose();
    let plane_normal = rot.get_x_vec();
    return (plane_normal, transl);
}

fn project_pixel(img_coord: &ImgCoord, K: &CameraMatrix, T_wc: &SE3, T_cl: &SE3) -> Point3 {
    let (rx, t_cl) = transf_to_plane_normal_and_transl(T_cl);
    let s = K.transform_img_coord(img_coord);
    let u4 = t_cl.dot_unit(&rx);
    let denom = s.dot_unit(&rx);
    let z = u4 / denom;
    let point = Point3::from_vec(&s.scale(z));
    let point_W = T_wc.transform_point(&point);
    return point_W;
}

fn load_and_project(project_params: &ProjectionParams) -> Vec<Point3> {
    let mut ret_vec: Vec<Point3> = Vec::new();
    for img_coord in &project_params.img_coords {
        let point = project_pixel(
            img_coord,
            &project_params.K,
            &project_params.T_wc,
            &project_params.T_cl,
        );
        ret_vec.push(point);
    }
    return ret_vec;
}

fn calculate_vec_towards_origin(
    world_points: &Vec<Vec<Point3>>,
    params_vec: &Vec<ProjectionParams>,
) -> Vec<Vec<UnitVec3>> {
    let mut ret_vec: Vec<Vec<UnitVec3>> = Vec::new();
    for (idx, scan_vec) in world_points.iter().enumerate() {
        let mut ret_scan_vec: Vec<UnitVec3> = Vec::new();
        for point in scan_vec.iter() {
            let T_wc = &params_vec[idx].T_wc;
            let T_cl = &params_vec[idx].T_cl;
            let T_wl = T_wc.transform_SE3(&T_cl);
            let (_, laser_origin) = T_wl.decompose();
            let vec_from_point_to_origin = &Point3::from_vec(&laser_origin) - point;
            let as_unit_vec = UnitVec3::new_from(&vec_from_point_to_origin);
            ret_scan_vec.push(as_unit_vec);
        }
        ret_vec.push(ret_scan_vec);
    }
    return ret_vec;
}

pub fn project_from_dir(project_name: &str) -> (Vec<Vec<Point3>>, Vec<Vec<UnitVec3>>) {
    let img_paths = get_files_from_project(project_name, "scan.png");
    let T_cl_paths = get_files_from_project(project_name, "T_cl.npy");
    let T_wc_paths = get_files_from_project(project_name, "T_wc.npy");
    let K_paths = get_files_from_project(project_name, "K.npy");
    let project_params_vec =
        fill_projection_params_vec(&img_paths, &K_paths, &T_wc_paths, &T_cl_paths);
    let ret_vec = project_params_vec
        .par_iter()
        .map(|project_params| load_and_project(&project_params))
        .collect();

    let vec_towards_laser_origin = calculate_vec_towards_origin(&ret_vec, &project_params_vec);
    return (ret_vec, vec_towards_laser_origin);
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
    #[test]
    fn project_from_dir_test() {
        let project_name = "corner01";
        let (ret_vec, _) = project_from_dir(project_name);
        println!("{:?}", ret_vec);
        assert_eq!(ret_vec.len(), 50);
    }
    //#[test]
    fn test_unit_vectors() {
        let project_name = "corner01";
        let (_, vec_towards_origin) = project_from_dir(project_name);
        println!("{:?}", vec_towards_origin);
        assert_eq!(vec_towards_origin.len(), 2);
    }
    #[test]
    fn test_project_pixel() {
        let K = CameraMatrix::from_values(600.0, 600.0, 400.0, 500.0);
        let img_coord = ImgCoord::new(34, 12);
        let rot_wc = SO3::new_angle_axis(std::f64::consts::PI / 8.0, &UnitVec3::new(1.0, 0.0, 0.0));
        let t_wc = Vec3::new(3.0, 4.0, 1.0);
        let T_wc = SE3::new_from_rot_vec(rot_wc, t_wc);
        let rot_cl =
            SO3::new_angle_axis(std::f64::consts::PI / 20.0, &UnitVec3::new(0.0, 1.0, 0.0));
        let t_cl = Vec3::new(0.2, 0.0, 0.1);
        let T_cl = SE3::new_from_rot_vec(rot_cl, t_cl);

        let (rx, t_cl) = transf_to_plane_normal_and_transl(&T_cl);
        println!("rx {:?}", rx);
        println!("t_cl{:?}", t_cl);
        let s = K.transform_img_coord(&img_coord);
        println!("s: {:?}", s);
        let u4 = t_cl.dot_unit(&rx);
        println!("u4: {}", u4);
        let denom = s.dot_unit(&rx);
        println!("denom: {}", denom);
        let z = u4 / denom;
        let point = Point3::from_vec(&s.scale(z));
        println!("point_C: {:?}", point);
        let point_W = T_wc.transform_point(&point);
        println!("point_W: {:?}", point_W);
        assert_eq!(point_W.x(), 3.0);
    }
}
