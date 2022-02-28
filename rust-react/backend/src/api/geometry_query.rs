use crate::appstate::AppState;
use actix_web::{get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder, Result};
use serde::{Deserialize, Serialize};

use crate::geometry::common::vec::*;
use crate::geometry::constraint_vec::*;
use crate::geometry::GeometryHandler;

#[derive(Deserialize)]
struct PointcloudRequest {
    project: String,
}

#[derive(Serialize)]
struct PointcloudRes {
    pointclouds: Vec<Vec<[f64; 3]>>,
}

fn build_pointcloud_res(constr_vec: &Vec<Vec<Point3>>) -> PointcloudRes {
    let mut pointclouds = Vec::new();
    for vec in constr_vec {
        let mut points = Vec::new();
        for point in vec {
            points.push(point.as_array());
        }
        pointclouds.push(points);
    }
    PointcloudRes {
        pointclouds: pointclouds,
    }
}

#[get("/get-pointcloud")]
async fn build_and_get_pc(
    req: web::Query<PointcloudRequest>,
    appstate: web::Data<AppState>,
) -> Result<impl Responder> {
    let mut geo_handler = appstate.geo_handler.lock().unwrap();
    geo_handler.build_from_project(&req.project);
    let res = build_pointcloud_res(&geo_handler.raw_scans);
    Ok(web::Json(res))
}

#[derive(Deserialize)]
struct VectorRequest {
    index: usize,
}

#[derive(Serialize)]
struct VectorRes {
    vector: [f64; 3],
}

#[get("/get-vec-towards-laser-origin")]
async fn vec_towards_laser_origin(
    req: web::Query<VectorRequest>,
    appstate: web::Data<AppState>,
) -> Result<impl Responder> {
    let mut geo_handler = appstate.geo_handler.lock().unwrap();
    let vec_towards = geo_handler.get_vec_towards_orig(req.index);
    match vec_towards {
        Some(vec) => {
            let res = VectorRes {
                vector: vec.as_array(),
            };
            Ok(web::Json(res))
        }
        None => Err(actix_web::error::ErrorInternalServerError(
            "No vector found".to_string(),
        )),
    }
}

#[derive(Serialize)]
struct EstNormalsRes {
    normals: Vec<[f64; 3]>,
    same_pts: Vec<[f64; 3]>,
    other_pts: Vec<[f64; 3]>,
    other_idx: Vec<usize>,
    same_idx: Vec<usize>,
}

#[get("/get-estimated-normals")]
async fn get_estimated_normals(
    req: web::Query<VectorRequest>,
    appstate: web::Data<AppState>,
) -> Result<impl Responder> {
    let geo_handler = appstate.geo_handler.lock().unwrap();
    let pt_constr = geo_handler.get_pt_constr_from_index(req.index);
    let mut normals_vec: Vec<[f64; 3]> = Vec::new();
    let mut same_pts: Vec<[f64; 3]> = Vec::new();
    let mut other_pts: Vec<[f64; 3]> = Vec::new();
    let mut other_idx: Vec<usize> = Vec::new();
    let mut same_idx: Vec<usize> = Vec::new();
    match pt_constr {
        Some(pt_constr) => {
            //let res = create_est_normals_res(&pt_constr.normals);
            for normal_vec in &pt_constr.normals {
                let same_scan_idx = normal_vec.same_scan_idx;
                let other_scan_idx = normal_vec.other_scan_idx;
                let same_pt = geo_handler
                    .get_pt_constr_from_index(same_scan_idx)
                    .unwrap()
                    .pt
                    .as_array();
                let other_pt = geo_handler
                    .get_pt_constr_from_index(other_scan_idx)
                    .unwrap()
                    .pt
                    .as_array();
                normals_vec.push(normal_vec.vec.as_array());
                same_pts.push(same_pt);
                other_pts.push(other_pt);
                same_idx.push(same_scan_idx);
                other_idx.push(other_scan_idx);
            }
            let res = EstNormalsRes {
                normals: normals_vec,
                same_pts: same_pts,
                other_pts: other_pts,
                other_idx: other_idx,
                same_idx: same_idx,
            };

            Ok(web::Json(res))
        }
        None => Err(actix_web::error::ErrorInternalServerError(
            "No point constraint found".to_string(),
        )),
    }
}

#[derive(Deserialize)]
struct PointReq {
    index: usize,
}

#[derive(Serialize)]
struct PointRes {
    point: [f64; 3],
    from_scan: usize,
}

#[get("/get-point")]
async fn get_point(
    req: web::Query<PointReq>,
    appstate: web::Data<AppState>,
) -> Result<impl Responder> {
    let geo_handler = appstate.geo_handler.lock().unwrap();
    let pt_constr = geo_handler.get_pt_constr_from_index(req.index);
    match pt_constr {
        Some(pt_constr) => {
            let res = PointRes {
                point: pt_constr.pt.as_array(),
                from_scan: pt_constr.from_scan,
            };
            Ok(web::Json(res))
        }
        None => Err(actix_web::error::ErrorInternalServerError(
            "No point constraint found".to_string(),
        )),
    }
}

#[derive(Deserialize)]
struct VectorFromToReq {
    from_index: usize,
    to_index: usize,
}

#[derive(Serialize)]
struct VectorFromToRes {
    vector: [f64; 3],
}

#[get("/get-vector-from-to")]
async fn get_vector_from_to(
    req: web::Query<VectorFromToReq>,
    appstate: web::Data<AppState>,
) -> Result<impl Responder> {
    let geo_handler = appstate.geo_handler.lock().unwrap();
    let from_pt_constr = geo_handler.get_pt_constr_from_index(req.from_index);
    let to_pt_constr = geo_handler.get_pt_constr_from_index(req.to_index);
    match (from_pt_constr, to_pt_constr) {
        (Some(from_pt_constr), Some(to_pt_constr)) => {
            let pt_from = &from_pt_constr.pt;
            let pt_to = &to_pt_constr.pt;
            let vec = pt_to.subtract(pt_from);
            let res = VectorFromToRes {
                vector: vec.as_array(),
            };

            Ok(web::Json(res))
        }
        _ => Err(actix_web::error::ErrorInternalServerError(
            "No point constraint found".to_string(),
        )),
    }
}
