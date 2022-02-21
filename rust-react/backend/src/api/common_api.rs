use crate::appstate::AppState;
use actix_web::{get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder, Result};
use itertools::izip;
use serde::{Deserialize, Serialize};

use crate::geometry::common::file_utils::*;
use crate::geometry::common::vec::*;
use crate::geometry::constraint_vec::*;
use crate::geometry::GeometryHandler;

#[derive(Serialize)]
struct ProjectListRes {
    project_names: Vec<String>,
}

#[get("/get-project-names")]
pub async fn get_project_names() -> Result<impl Responder> {
    let project_names = list_files_in_dir("scan-projects");
    let res = ProjectListRes {
        project_names: project_names,
    };
    Ok(web::Json(res))
}

#[derive(Deserialize)]
struct ProjectRequest {
    project: String,
}

#[derive(Serialize)]
struct LaserCamRes {
    laser_poses: Vec<[[f64; 4]; 4]>,
    camera_poses: Vec<[[f64; 4]; 4]>,
}

#[get("/get-cam-laser-poses")]
async fn get_camera_laser_poses(req: web::Query<ProjectRequest>) -> Result<impl Responder> {
    let mut laser_poses: Vec<[[f64; 4]; 4]> = Vec::new();
    let mut camera_poses: Vec<[[f64; 4]; 4]> = Vec::new();
    println!("Get camera-laser poses: {}", req.project);
    let project_name = &req.project;
    let T_cl_paths = get_files_from_project(project_name, "T_cl.npy");
    let T_wc_paths = get_files_from_project(project_name, "T_wc.npy");
    for (T_wc_path, T_cl_path) in izip!(T_wc_paths.iter(), T_cl_paths.iter()) {
        let T_wc = SE3::from_npy(&T_wc_path);
        let T_cl = SE3::from_npy(&T_cl_path);
        let T_wl = T_wc.transform_SE3(&T_cl);
        laser_poses.push(T_wl.as_array());
        camera_poses.push(T_wc.as_array());
    }
    let res = LaserCamRes {
        laser_poses: laser_poses,
        camera_poses: camera_poses,
    };
    Ok(web::Json(res))
}
