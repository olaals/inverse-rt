use kdtree::KdTree;
use std::sync::{Mutex, MutexGuard};
mod bvh_handler;
use bvh_handler::*;
mod kdtree_handler;
use kdtree_handler::*;

pub struct Pt3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub incompatible_index: Vec<usize>,
    pub from_scan: usize,
}

pub struct AppState {
    pub counter: Mutex<i32>,
}


