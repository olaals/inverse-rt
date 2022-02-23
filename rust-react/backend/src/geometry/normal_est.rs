use core::num;
use rand::Rng;

use crate::geometry::common::vec::*;
use crate::geometry::constraint_vec::*;
use crate::geometry::optim::kdtree_handler::*;

pub fn estimate_normals(constr_vec: &mut ConstraintVec, kdtree: &PtKdTree) {
    let mut first_pt_constr = &constr_vec.vec[0];
    let close_points = kdtree.within_idx(&first_pt_constr.pt, 0.03);
    let mut from_same_scan: Vec<&Point3> = Vec::new();
    let mut from_other_scan: Vec<&Point3> = Vec::new();
    for close_point in close_points {
        let pt_constraint = &constr_vec.vec[close_point];
        if pt_constraint.from_scan == first_pt_constr.from_scan {
            from_same_scan.push(&pt_constraint.pt);
        } else {
            from_other_scan.push(&pt_constraint.pt);
        }
    }
    let len_same = from_same_scan.len();
    let len_other = from_other_scan.len();
    let max_normals = 10;
    let num_normals = std::cmp::min(std::cmp::min(len_same, len_other), max_normals);
    let mut rng = rand::thread_rng();
    assert!(num_normals > 0);
    for i in 0..num_normals {
        let sampled_same = from_same_scan[rng.gen_range(0..len_same)];
        let sampled_other = from_other_scan[rng.gen_range(0..len_other)];
        let first_vec = &first_pt_constr.pt - &sampled_same;
        let second_vec = &first_pt_constr.pt - &sampled_other;
        let mut cross = first_vec.cross(&second_vec);
        let dot_prod = cross.dot_unit(&first_pt_constr.towards_origin);
        if (dot_prod < 0.0) {
            cross = cross.negate();
        }
        let unit_normal = cross.as_unit_vec();
        first_pt_constr.normals.push(unit_normal);
        //constr_vec.vec[0].normals.push(unit_normal);
    }
}
