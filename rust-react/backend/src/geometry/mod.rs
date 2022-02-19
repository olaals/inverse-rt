use actix_web::App;
use kdtree::KdTree;
use std::sync::{Mutex, MutexGuard};
mod geometry;
use geometry::*;

pub struct AppState {
    pub geo_handler: Mutex<GeometryHandler>,
}

impl AppState {
    pub fn new() -> AppState {
        AppState {
            geo_handler: Mutex::new(GeometryHandler::new()),
        }
    }
}
