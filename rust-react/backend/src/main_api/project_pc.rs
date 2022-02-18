use glob::glob;
use lodepng::Bitmap;
use na::{SimdValue, UnitQuaternion};
use rgb::*;
use std::ops::*;
use std::path::Path;
#[macro_use]
use std::io::Read;
extern crate nalgebra as na;
use ndarray::{array, Array2};
use ndarray_npy::{ReadNpyError, ReadNpyExt, WriteNpyError, WriteNpyExt};
use rayon::prelude::*;
use std::fs::File;

fn load_image(path: &str) -> Bitmap<RGB<u8>> {
    println!("Loading image: {}", path);
    match lodepng::decode24_file(path) {
        Ok(image) => {
            println!("Loaded image: {}", path);
            return image;
        }
        Err(error) => {
            println!("Error loading image: {}", path);
            println!("{}", error);
            panic!("Could not load image: {}", path);
        }
    }
}

struct ImgCoord {
    x: u32,
    y: u32,
}

impl PartialEq for ImgCoord {
    fn eq(&self, other: &ImgCoord) -> bool {
        self.x == other.x && self.y == other.y
    }
}

impl ImgCoord {
    fn new(x: u32, y: u32) -> ImgCoord {
        ImgCoord { x, y }
    }
}

fn img_coords_to_image(img_coords: &Vec<ImgCoord>, width: usize, height: usize) {
    let mut image_vec: Vec<RGB8> = vec![RGB::new(0, 0, 0); (width * height) as usize];
    for y in 0..height {
        for x in 0..width {
            if img_coords.contains(&ImgCoord::new(x as u32, y as u32)) {
                image_vec[(y * width + x) as usize] = RGB::new(255, 255, 255);
            }
        }
    }
    lodepng::encode24_file("out.png", &image_vec, width, height).unwrap();
}

fn filter_image(image: &Bitmap<RGB<u8>>, threshold: u8) -> Vec<ImgCoord> {
    let buffer = &image.buffer;
    let mut img_coord_vec: Vec<ImgCoord> = Vec::new();
    for y in 0..image.height {
        for x in 1..(image.width - 1) {
            let prev_red = buffer[y * image.width + x - 1].r;
            let red = buffer[y * image.width + x].r;
            let next_red = buffer[y * image.width + x + 1].r;
            if prev_red > threshold && red > threshold && next_red > threshold {
                img_coord_vec.push(ImgCoord::new(x as u32, y as u32));
            }
        }
    }
    return img_coord_vec;
}

fn load_numpy_transf(path: &str) -> na::IsometryMatrix3<f64> {
    let reader = File::open(path).unwrap();
    let arr = Array2::<f64>::read_npy(reader).unwrap();
    let arr_mat3: na::Matrix3<f64> = na::Matrix3::new(
        arr[[0, 0]],
        arr[[0, 1]],
        arr[[0, 2]],
        arr[[1, 0]],
        arr[[1, 1]],
        arr[[1, 2]],
        arr[[2, 0]],
        arr[[2, 1]],
        arr[[2, 2]],
    );
    let rot = na::Rotation3::from_matrix(&arr_mat3);
    let axis_angle = rot.axis_angle().unwrap();
    let axis = axis_angle.0.into_inner();
    let angle = axis_angle.1;
    let axis_angle_vec = angle * axis;

    let iso_matrix = na::IsometryMatrix3::new(
        na::Vector3::new(arr[[0, 3]], arr[[1, 3]], arr[[2, 3]]),
        axis_angle_vec,
    );

    return iso_matrix;
}

fn load_numpy_cam_mat(path: &str) -> na::Matrix3<f64> {
    let reader = File::open(path).unwrap();
    let arr = Array2::<f64>::read_npy(reader).unwrap();
    let arr_mat3: na::Matrix3<f64> = na::Matrix3::new(
        arr[[0, 0]],
        arr[[0, 1]],
        arr[[0, 2]],
        arr[[1, 0]],
        arr[[1, 1]],
        arr[[1, 2]],
        arr[[2, 0]],
        arr[[2, 1]],
        arr[[2, 2]],
    );
    return arr_mat3;
}

fn transf_to_plane_normal_transl(
    transf: &na::IsometryMatrix3<f64>,
) -> (na::Vector3<f64>, na::Vector3<f64>) {
    let rot = transf.rotation;
    let rot_vec_x = na::Vector3::new(rot[(0, 0)], rot[(1, 0)], rot[(2, 0)]);
    let translation = transf.translation;
    let homg = translation.to_homogeneous();
    let first_el = homg[(0, 3)];
    let second_el = homg[(1, 3)];
    let third_el = homg[(2, 3)];
    let transl_vec = na::Vector3::new(first_el, second_el, third_el);
    return (rot_vec_x, transl_vec);
}

fn project_pixel(
    img_coord: &ImgCoord,
    K_inv: &na::Matrix3<f64>,
    T_wc: &na::IsometryMatrix3<f64>,
    T_cl: &na::IsometryMatrix3<f64>,
) -> Vec<f64> {
    let (rx, t_cl) = transf_to_plane_normal_transl(T_cl);
    let img_coord_homg = na::Vector3::new(img_coord.x as f64, img_coord.y as f64, 1.0);
    let s = K_inv * img_coord_homg;
    let (rx, t_cl) = transf_to_plane_normal_transl(T_cl);
    let u4 = t_cl.dot(&rx);
    let bot = s.dot(&rx);
    let x = u4 / bot * s;
    let x_homg = na::Point3::new(x[0], x[1], x[2]);
    let x_w = T_wc.transform_point(&x_homg);
    let x_w_vec = vec![x_w[0], x_w[1], x_w[2]];
    return x_w_vec;
}

fn project_pixels(
    pixel_coords: &Vec<ImgCoord>,
    K_inv: &na::Matrix3<f64>,
    T_wc: &na::IsometryMatrix3<f64>,
    T_cl: &na::IsometryMatrix3<f64>,
) -> Vec<Vec<f64>> {
    let mut projected_pixels: Vec<Vec<f64>> = Vec::new();
    for pixel_coord in pixel_coords {
        let pt_w = project_pixel(pixel_coord, K_inv, T_wc, T_cl);
        projected_pixels.push(pt_w);
    }
    return projected_pixels;
}

#[derive(Debug)]
struct PathStruct {
    img_path: String,
    K_path: String,
    T_wc_path: String,
    T_cl_path: String,
}

fn load_matrices_and_project(path_struct: &PathStruct) -> Vec<Vec<f64>> {
    let img = load_image(&path_struct.img_path);
    let K = load_numpy_cam_mat(&path_struct.K_path);
    let K_inv = K.try_inverse().unwrap();
    let T_wc = load_numpy_transf(&path_struct.T_wc_path);
    let T_cl = load_numpy_transf(&path_struct.T_cl_path);
    let img_coords = filter_image(&img, 60);
    let projected_pixels = project_pixels(&img_coords, &K_inv, &T_wc, &T_cl);
    return projected_pixels;
}

fn calculate_vec_towards_origin(
    vec: &Vec<Vec<f64>>,
    T_wl: &na::IsometryMatrix3<f64>,
) -> Vec<Vec<f64>> {
    let ret_vec: Vec<Vec<f64>> = Vec::new();
    return ret_vec;
}

pub fn project_pixels_from_dir(project_dir: String) -> Vec<Vec<Vec<f64>>> {
    let mut return_vec: Vec<Vec<Vec<f64>>> = Vec::new();
    let scan_dirs = format!("{}/scans", project_dir);
    println!("scan_dirs: {}", scan_dirs);
    let mut paths = glob(format!("{}/scan*/*.png", scan_dirs.as_str()).as_str())
        .expect("Failed to read glob pattern");
    let mut T_wc_paths = glob(format!("{}/scan*/T_wc.npy", scan_dirs).as_str())
        .expect("Failed to read glob pattern");
    let mut T_cl_paths = glob(format!("{}/scan*/T_cl.npy", scan_dirs).as_str())
        .expect("Failed to read glob pattern");
    let mut K_paths =
        glob(format!("{}/scan*/K.npy", scan_dirs).as_str()).expect("Failed to read glob pattern");

    let paths_vec = paths.collect::<Vec<_>>();
    let K_paths_vec = K_paths.collect::<Vec<_>>();
    let T_wc_paths_vec = T_wc_paths.collect::<Vec<_>>();
    let T_cl_paths_vec = T_cl_paths.collect::<Vec<_>>();

    let paths_len = paths_vec.len();

    let mut path_struct_vec: Vec<PathStruct> = Vec::new();

    for i in 0..paths_len {
        let path = paths_vec
            .get(i)
            .unwrap()
            .as_ref()
            .unwrap()
            .as_os_str()
            .to_str()
            .unwrap()
            .to_string();
        let K_path = K_paths_vec
            .get(i)
            .unwrap()
            .as_ref()
            .unwrap()
            .as_os_str()
            .to_str()
            .unwrap()
            .to_string();
        let T_wc_path = T_wc_paths_vec
            .get(i)
            .unwrap()
            .as_ref()
            .unwrap()
            .as_os_str()
            .to_str()
            .unwrap()
            .to_string();
        let T_cl_path = T_cl_paths_vec
            .get(i)
            .unwrap()
            .as_ref()
            .unwrap()
            .as_os_str()
            .to_str()
            .unwrap()
            .to_string();
        let path_struct = PathStruct {
            img_path: path,
            K_path: K_path,
            T_wc_path: T_wc_path,
            T_cl_path: T_cl_path,
        };
        path_struct_vec.push(path_struct);
    }

    let ret_vec = path_struct_vec
        .par_iter()
        .map(|path_struct| load_matrices_and_project(path_struct))
        .collect::<Vec<_>>();

    return ret_vec;

    //for path in paths {
    //let path = path.unwrap();
    //let image = load_image(path.as_os_str().to_str().as_ref().unwrap());
    //let K_path = K_paths.next().unwrap().unwrap();
    //let T_cl_path = T_cl_paths.next().unwrap().unwrap();
    //let T_wc_path = T_wc_paths.next().unwrap().unwrap();
    //let K_path = K_path.as_os_str().to_str().unwrap();

    //println!("K_path: {:?}", K_path);
    //println!("T_cl_path: {:?}", T_cl_path);
    //println!("T_wc_path: {:?}", T_wc_path);

    //let K = load_numpy_cam_mat(K_path);
    //let K_inv = K.try_inverse().unwrap();
    //let T_cl = load_numpy_transf(T_cl_path.as_os_str().to_str().unwrap());
    //let T_wc = load_numpy_transf(T_wc_path.as_os_str().to_str().unwrap());
    //let img_coords = filter_image(&image, 60);
    //let projected_pixels = project_pixels(&img_coords, &K_inv, &T_wc, &T_cl);
    //return_vec.push(projected_pixels);
    //}

    //println!("{}", return_vec.len());
    //return_vec
}

fn test() {
    let mut paths = glob("scans/scan*/*.png").expect("Failed to read glob pattern");
    let mut camera_poses_paths = glob("scans/scan*/T_wc.npy").expect("Failed to read glob pattern");
    let mut camera_mat_paths = glob("scans/scan*/K.npy").expect("Failed to read glob pattern");
    let mut camera_lases_paths = glob("scans/scan*/T_cl.npy").expect("Failed to read glob pattern");

    println!("Start");
    for path in paths {
        let res_path = path.unwrap();
        let image = load_image(res_path.as_os_str().to_str().as_ref().unwrap());
        let K_path = camera_mat_paths.next().unwrap().unwrap();
        let T_cl_path = camera_lases_paths.next().unwrap().unwrap();
        let T_wc_path = camera_poses_paths.next().unwrap().unwrap();
        let K = load_numpy_cam_mat(K_path.as_path().to_str().unwrap());
        let T_cl = load_numpy_transf(T_cl_path.as_path().to_str().unwrap());
        let T_wc = load_numpy_transf(T_wc_path.as_path().to_str().unwrap());
        println!("{}", K);
        let K_inv = K.try_inverse().unwrap();
        let img_coords = filter_image(&image, 60);
        let projected = project_pixels(&img_coords, &K_inv, &T_wc, &T_cl);
        println!("{}", projected.len());
    }
    println!("End");
}
