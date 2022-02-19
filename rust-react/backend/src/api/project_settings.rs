
use actix_web::{get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder, Result};
use serde::{Deserialize, Serialize};
mod helpers;
use helpers::*;
mod project_pc;
use project_pc::*;

#[get("/")]
async fn hello(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap_or("World");
    println!("{}", name);
    HttpResponse::Ok().body("Hello world!")
}

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

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    println!("{:?}", req_body);
    HttpResponse::Ok().body(req_body)
}

#[derive(Deserialize)]
struct PointcloudRequest {
    project: String,
}

#[derive(Serialize)]
struct PointcloudRes {
    pointclouds: Vec<Vec<Vec<f64>>>,
}

#[get("/get-pointcloud")]
async fn get_pc(req: web::Query<PointcloudRequest>) -> Result<impl Responder> {
    let dir = format!("scan-projects/{}", req.project);
    let points = project_pixels_from_dir(String::from(dir));
    let res = PointcloudRes {
        pointclouds: points,
    };
    Ok(web::Json(res))
}

#[derive(Deserialize)]
struct ProjectRequest {
    project: String,
}

#[get("/get-camera-poses")]
async fn get_camera_poses(req: web::Query<ProjectRequest>) -> Result<impl Responder> {
    println!("Get camera poses: {}", req.project);
    let project_name = &req.project;
    let poses = get_poses(project_name, "T_wc.npy");
    Ok(web::Json(poses))
}

#[get("/get-laser-poses")]
async fn get_laser_poses(req: web::Query<ProjectRequest>) -> Result<impl Responder> {
    println!("Get laser poses: {}", req.project);
    let project_name = &req.project;
    let poses = get_poses(project_name, "T_wl.npy");
    Ok(web::Json(poses))
}

#[derive(Serialize)]
struct LaserCamRes {
    laser_poses: Vec<Vec<Vec<f64>>>,
    camera_poses: Vec<Vec<Vec<f64>>>,
}

#[get("/get-cam-laser-poses")]
async fn get_camera_laser_poses(req: web::Query<ProjectRequest>) -> Result<impl Responder> {
    println!("Get camera-laser poses: {}", req.project);
    let project_name = &req.project;
    let camera_poses = get_poses(project_name, "T_wc.npy");
    let laser_poses = get_poses(project_name, "T_wl.npy");
    let res = LaserCamRes {
        laser_poses: laser_poses,
        camera_poses: camera_poses,
    };
    Ok(web::Json(res))
}