use crate::geometry::GeometryHandler;
use actix_web::App;
use kdtree::KdTree;
use std::sync::{Mutex, MutexGuard};

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
