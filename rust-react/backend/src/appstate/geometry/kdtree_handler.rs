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

    pub fn build(&mut self, all_scans: &Vec<Vec<Vec<f64>>>) {
        for (i, scan) in all_scans.iter().enumerate() {
            for (j, point) in scan.iter().enumerate() {
                let pt3 = [point[0], point[1], point[2]];
                self.kdtree.add(pt3, i * scan.len() + j).unwrap();
            }
        }
    }

    pub fn within_idx(&self, point: &Vec<f64>, distance: f64) -> Vec<usize> {
        let pt_arr = [point[0], point[1], point[2]];
        let res = self
            .kdtree
            .within(&pt_arr, distance, &squared_euclidean)
            .expect("Error in kdtree::within");
        let idx_vec = res.iter().map(|(_, &idx)| idx).collect();
        return idx_vec;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn build_kdtree() {
        let mut kdtree = PtKdTree::new();
        let mut pc: Vec<Vec<Vec<f64>>> = Vec::new();
        // fill pc with points
        for i in 0..3 {
            let mut scan: Vec<Vec<f64>> = Vec::new();
            for j in 0..3 {
                let mut point: Vec<f64> = Vec::new();
                point.push(i as f64);
                point.push(j as f64);
                point.push(0.0);
                scan.push(point);
            }
            pc.push(scan);
        }
        println!("{:?}", pc);
        kdtree.build(&pc);
        let mut res = kdtree.within_idx(&vec![0.0, 0.0, 0.0], 1.1);
        res.sort();
        assert_eq!(res, vec![0, 1, 3]);
    }
}
