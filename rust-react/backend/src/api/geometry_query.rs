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
