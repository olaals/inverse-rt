use crate::geometry::constraint_vec::*;
use crate::geometry::optim::kdtree_handler::PtKdTree;
use core::num;
use nalgebra::{Norm, Point};
use rand::Rng;
use rayon::prelude::*;

use crate::geometry::common::vec::*;
use crate::geometry::constraint_vec::*;
use crate::geometry::optim::kdtree_handler::*;
use crate::geometry::optim::kdtree_scan_vec::*;

pub fn estimate_normals_ind_scan(constr_vec: &mut ConstraintVec, kdtree_scan_vec: &KdTreeScanVec) {
    //for i in 0..constr_vec.vec.len() {
    let all_normals_vec = constr_vec
        .vec
        .par_iter()
        .enumerate()
        .map(|(idx, pt_constr)| get_normals_paralell(idx, &constr_vec, &kdtree_scan_vec))
        .collect::<Vec<_>>();
    for (idx, normals) in all_normals_vec.into_iter().enumerate() {
        let pt_constraint = &mut constr_vec.vec.get_mut(idx).unwrap();
        pt_constraint.normals = normals;
    }
}

fn get_normals_paralell(
    index: usize,
    constr_vec: &ConstraintVec,
    kdtree_scan_vec: &KdTreeScanVec,
) -> Vec<NormalVec> {
    let (from_same_scan, from_other_scan) =
        get_close_points(index, constr_vec, kdtree_scan_vec, 0.01);
    sample_point_normals(index, constr_vec, from_same_scan, from_other_scan)
}

fn get_close_points(
    index: usize,
    constr_vec: &ConstraintVec,
    kdtree: &KdTreeScanVec,
    radius: f64,
) -> (Vec<(Point3, usize)>, Vec<(Point3, usize)>) {
    let constr_pt = &constr_vec.vec[index];
    let pt = &constr_pt.pt;
    let scan_idx = constr_pt.from_scan;
    let mut other_scan_pts: Vec<(Point3, usize)> = Vec::new();
    let mut same_scan_pts: Vec<(Point3, usize)> = Vec::new();
    if scan_idx != 0 {
        fill_vector_close_pts(
            &mut other_scan_pts,
            &pt,
            30,
            &kdtree.kdtrees[scan_idx - 1],
            &constr_vec,
        )
    }
    fill_vector_close_pts(
        &mut same_scan_pts,
        &pt,
        50,
        &kdtree.kdtrees[scan_idx],
        &constr_vec,
    );
    if scan_idx != kdtree.kdtrees.len() - 1 {
        fill_vector_close_pts(
            &mut other_scan_pts,
            &pt,
            30,
            &kdtree.kdtrees[scan_idx + 1],
            &constr_vec,
        )
    }

    return (same_scan_pts, other_scan_pts);
}

fn fill_vector_close_pts(
    vec: &mut Vec<(Point3, usize)>,
    pt: &Point3,
    num_points: usize,
    kdtree: &PtKdTree,
    constr_vec: &ConstraintVec,
) {
    let close_query = kdtree.nearest_k(&pt, num_points);
    for idx in close_query {
        let pt_constr = &constr_vec.vec[idx];
        vec.push((pt_constr.pt.clone(), idx));
    }
}

fn sample_point_normals(
    index: usize,
    constr_vec: &ConstraintVec,
    from_same_scan: Vec<(Point3, usize)>,
    from_other_scan: Vec<(Point3, usize)>,
) -> Vec<NormalVec> {
    let first_pt_constr = &constr_vec.vec[index];
    let mut ret_vec: Vec<NormalVec> = Vec::new();
    let len_same = from_same_scan.len();
    let len_other = from_other_scan.len();
    //println!(
    //    "sample_point_normals: index: {}, len_same: {}, len_other: {}",
    //    index, len_same, len_other
    //);
    let max_normals = 20;
    let num_normals = std::cmp::min(std::cmp::min(len_same, len_other), max_normals);
    let mut rng = rand::thread_rng();
    //assert!(num_normals > 0);
    for i in 0..num_normals {
        let (sampled_same, same_idx) = &from_same_scan[rng.gen_range(0..len_same)];
        let (sampled_other, other_idx) = &from_other_scan[rng.gen_range(0..len_other)];
        let mut normal_vec = cross_to_normal(&first_pt_constr, &sampled_same, &sampled_other);
        normal_vec.same_scan_idx = *same_idx;
        normal_vec.other_scan_idx = *other_idx;
        ret_vec.push(normal_vec);
        //first_pt_constr.normals.push(unit_normal);
    }
    return ret_vec;
}

fn cross_to_normal(
    orig_pt_constr: &PtConstraint,
    sampled_same: &Point3,
    sampled_other: &Point3,
) -> NormalVec {
    let origin_pt = &orig_pt_constr.pt;
    let towards_orig = &orig_pt_constr.towards_origin;
    let first_vec = origin_pt - sampled_same;
    let second_vec = origin_pt - sampled_other;
    let mut cross = first_vec.cross(&second_vec);
    let dot_prod = cross.dot_unit(towards_orig);
    if dot_prod < 0.0 {
        cross = cross.negate();
    }
    let unit_normal = cross.as_unit_vec();
    let normal_vec = NormalVec::new(0, 0, unit_normal);
    return normal_vec;
}
