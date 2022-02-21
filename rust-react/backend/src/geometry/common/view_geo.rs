extern crate nalgebra as na;
use crate::geometry::common::vec::*;
use ndarray::{array, Array2};
use ndarray_npy::{read_npy, ReadNpyError, ReadNpyExt};
use std::fs::File;
use std::path::Path;
pub struct ImgCoord {
    x: u32,
    y: u32,
}

impl PartialEq for ImgCoord {
    fn eq(&self, other: &ImgCoord) -> bool {
        self.x == other.x && self.y == other.y
    }
}

impl ImgCoord {
    pub fn new(x: u32, y: u32) -> ImgCoord {
        ImgCoord { x, y }
    }
}

pub struct CameraMatrix {
    K: na::Matrix3<f64>,
    inv_K: na::Matrix3<f64>,
}

impl CameraMatrix {
    pub fn new(K: na::Matrix3<f64>) -> CameraMatrix {
        CameraMatrix {
            K,
            inv_K: K.try_inverse().unwrap(),
        }
    }
    pub fn from_values(fx: f64, fy: f64, cx: f64, cy: f64) -> CameraMatrix {
        let K = na::Matrix3::new(fx, 0.0, cx, 0.0, fy, cy, 0.0, 0.0, 1.0);
        CameraMatrix::new(K)
    }
    pub fn K(&self) -> &na::Matrix3<f64> {
        &self.K
    }
    pub fn inv_K(&self) -> &na::Matrix3<f64> {
        &self.inv_K
    }
    pub fn from_npy(path: &str) -> CameraMatrix {
        let reader = File::open(path).unwrap();
        let res = Array2::<f64>::read_npy(reader);
        match res {
            Ok(arr) => {
                let mat = na::Matrix3::new(
                    arr[(0, 0)],
                    arr[(0, 1)],
                    arr[(0, 2)],
                    arr[(1, 0)],
                    arr[(1, 1)],
                    arr[(1, 2)],
                    arr[(2, 0)],
                    arr[(2, 1)],
                    arr[(2, 2)],
                );
                return CameraMatrix::new(mat);
            }
            Err(e) => {
                panic!("Could not load cam mat from npy: {}", e);
            }
        }
    }
    pub fn transform_img_coord(&self, img_coord: &ImgCoord) -> Vec3 {
        let homg_img_coord = na::Vector3::new(img_coord.x as f64, img_coord.y as f64, 1.0);
        let homg_img_coord_transformed = self.inv_K * homg_img_coord;
        Vec3::new(
            homg_img_coord_transformed[(0, 0)],
            homg_img_coord_transformed[(1, 0)],
            homg_img_coord_transformed[(2, 0)],
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
}
