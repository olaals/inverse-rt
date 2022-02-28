use crate::geometry::common::vec::*;
use crate::geometry::optim::kdtree_handler::*;

pub struct KdTreeScanVec {
    pub kdtrees: Vec<PtKdTree>,
}

impl KdTreeScanVec {
    pub fn new() -> KdTreeScanVec {
        KdTreeScanVec {
            kdtrees: Vec::new(),
        }
    }
    pub fn build(&mut self, all_scans: &Vec<Vec<Point3>>) {
        let mut counter = 0;
        for scan in all_scans.iter() {
            let mut kdt = PtKdTree::new();
            kdt.build_single_scan(scan, counter);
            self.kdtrees.push(kdt);
            counter += scan.len();
        }
    }
    pub fn within_scan(&self, scan_idx: usize, point: &Point3, distance: f64) -> Vec<usize> {
        let kdt = &self.kdtrees[scan_idx];
        return kdt.within_idx(point, distance);
    }
    pub fn nearest_k_scan(&self, scan_idx: usize, point: &Point3, num_points: usize) -> Vec<usize> {
        let kdt = &self.kdtrees[scan_idx];
        return kdt.nearest_k(point, num_points);
    }
    pub fn nearest_k_within(
        &self,
        scan_idx: usize,
        point: &Point3,
        distance: f64,
        num_points: usize,
    ) -> Vec<usize> {
        let kdt = &self.kdtrees[scan_idx];
        return kdt.nearest_k_within(point, distance, num_points);
    }
}
