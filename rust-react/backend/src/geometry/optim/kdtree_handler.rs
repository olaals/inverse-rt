use crate::geometry::common::vec::*;
use kdtree::distance::squared_euclidean;
use kdtree::KdTree;

pub struct PtKdTree {
    kdtree: KdTree<f64, usize, [f64; 3]>,
}

impl PtKdTree {
    pub fn new() -> PtKdTree {
        PtKdTree {
            kdtree: KdTree::new(3),
        }
    }

    pub fn build(&mut self, all_scans: &Vec<Vec<Point3>>) {
        for (i, scan) in all_scans.iter().enumerate() {
            for (j, point) in scan.iter().enumerate() {
                let pt3 = point.as_array();
                self.kdtree.add(pt3, i * scan.len() + j).unwrap();
            }
        }
    }

    pub fn build_single_scan(&mut self, scan: &Vec<Point3>, start_idx: usize) {
        for (i, point) in scan.iter().enumerate() {
            let pt3 = point.as_array();
            self.kdtree.add(pt3, i + start_idx).unwrap();
        }
    }

    pub fn within_idx(&self, point: &Point3, distance: f64) -> Vec<usize> {
        let pt_arr = point.as_array();
        let res = self
            .kdtree
            .within(&pt_arr, distance, &squared_euclidean)
            .expect("Error in kdtree::within");
        let idx_vec = res.iter().map(|(_, &idx)| idx).collect();
        return idx_vec;
    }

    pub fn nearest_k(&self, point: &Point3, num_points: usize) -> Vec<usize> {
        let pt_arr = point.as_array();
        let res = self
            .kdtree
            .nearest(&pt_arr, num_points, &squared_euclidean)
            .expect("Error in kdtree::nearest");
        let idx_vec = res.iter().map(|(_, &idx)| idx).collect();
        return idx_vec;
    }

    pub fn nearest_k_within(&self, point: &Point3, distance: f64, num_points: usize) -> Vec<usize> {
        let pt_arr = point.as_array();
        let mut ret_vec: Vec<usize> = Vec::new();
        let res = self
            .kdtree
            .nearest(&pt_arr, num_points, &squared_euclidean)
            .expect("Error in kdtree::nearest");
        for (dist, &idx) in res.iter() {
            if *dist > distance {
                ret_vec.push(idx);
            }
        }
        return ret_vec;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn build_kdtree() {}
}
