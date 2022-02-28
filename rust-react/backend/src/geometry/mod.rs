pub mod common;
pub mod constraint_vec;
pub mod normal_estimation;
pub mod optim;
pub mod project_pc;
use actix_web::http::Error;
use common::common_types::*;
use common::vec::*;
use constraint_vec::*;
use itertools::izip;
use normal_estimation::normal_est::estimate_normals;
use normal_estimation::normal_est_ind_scan::estimate_normals_ind_scan;
use optim::bvh_handler::SphereBvh;
use optim::kdtree_handler::PtKdTree;
use optim::kdtree_scan_vec::*;

pub struct GeometryHandler {
    pub kdtree: PtKdTree,
    pub bvh: SphereBvh,
    pub constr_vec: ConstraintVec,
    pub raw_scans: Vec<Vec<Point3>>,
    pub scan_params_vec: ScanParamsVec,
    pub scan_kdtree: KdTreeScanVec,
}

impl GeometryHandler {
    pub fn new() -> GeometryHandler {
        GeometryHandler {
            kdtree: PtKdTree::new(),
            bvh: SphereBvh::new(),
            constr_vec: ConstraintVec::new(),
            raw_scans: Vec::new(),
            scan_params_vec: ScanParamsVec::new(),
            scan_kdtree: KdTreeScanVec::new(),
        }
    }
    pub fn build_from_project(&mut self, project_name: &str) {
        self.scan_params_vec.fill_from_project(project_name);
        let (all_scans, toward_orig) = project_pc::project_from_dir(project_name);
        let radius = 0.02;
        self.build(all_scans, toward_orig, radius);
        println!("estimate normals");
        //estimate_normals(&mut self.constr_vec, &self.kdtree);
        estimate_normals_ind_scan(&mut self.constr_vec, &self.scan_kdtree);
        println!("estimate normals done");
    }

    pub fn build(&mut self, pc: Vec<Vec<Point3>>, orig_vec: Vec<Vec<UnitVec3>>, radius: f64) {
        println!("building constraint vec");
        for (idx, (scan, towards_orig_scan)) in izip!(pc.iter(), orig_vec.iter()).enumerate() {
            for (pt, towards_orig) in izip!(scan.iter(), towards_orig_scan.iter()) {
                let pt_constraint = PtConstraint::new(pt.clone(), idx, towards_orig.clone());
                self.constr_vec.push(pt_constraint);
            }
        }
        println!("building kdtree");
        self.kdtree.build(&pc);
        println!("building scan kdtree");
        self.scan_kdtree.build(&pc);
        println!("building bvh");
        self.bvh.build(&pc, radius);
        self.raw_scans = pc;
    }

    pub fn estimate_normals(&mut self) {
        estimate_normals(&mut self.constr_vec, &self.kdtree);
    }

    pub fn get_vec_towards_orig(&self, idx: usize) -> Option<UnitVec3> {
        let pt_constraint = &self.constr_vec.vec.get(idx)?;
        return Some(pt_constraint.towards_origin.clone());
    }

    pub fn get_pt_constr_from_index(&self, idx: usize) -> Option<&PtConstraint> {
        return self.constr_vec.vec.get(idx);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn build_geometry_handler() {
        let mut geo_handler = GeometryHandler::new();
        geo_handler.build_from_project("corner01");
    }
}
