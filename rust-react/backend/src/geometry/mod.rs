pub mod common;
pub mod constraint_vec;
pub mod normal_est;
pub mod optim;
pub mod project_pc;
use actix_web::http::Error;
use common::common_types::*;
use common::vec::*;
use constraint_vec::*;
use itertools::izip;
use optim::bvh_handler::SphereBvh;
use optim::kdtree_handler::PtKdTree;

pub struct GeometryHandler {
    pub kdtree: PtKdTree,
    pub bvh: SphereBvh,
    pub constr_vec: ConstraintVec,
    pub raw_scans: Vec<Vec<Point3>>,
    pub scan_params_vec: ScanParamsVec,
}

impl GeometryHandler {
    pub fn new() -> GeometryHandler {
        GeometryHandler {
            kdtree: PtKdTree::new(),
            bvh: SphereBvh::new(),
            constr_vec: ConstraintVec::new(),
            raw_scans: Vec::new(),
            scan_params_vec: ScanParamsVec::new(),
        }
    }
    pub fn build_from_project(&mut self, project_name: &str) {
        self.scan_params_vec.fill_from_project(project_name);
        let (all_scans, toward_orig) = project_pc::project_from_dir(project_name);
        let radius = 0.02;
        self.build(all_scans, toward_orig, radius);
    }

    pub fn build(&mut self, pc: Vec<Vec<Point3>>, orig_vec: Vec<Vec<UnitVec3>>, radius: f64) {
        for (idx, (scan, towards_orig_scan)) in izip!(pc.iter(), orig_vec.iter()).enumerate() {
            for (pt, towards_orig) in izip!(scan.iter(), towards_orig_scan.iter()) {
                let pt_constraint = PtConstraint::new(pt.clone(), idx, towards_orig.clone());
                self.constr_vec.push(pt_constraint);
            }
        }
        self.kdtree.build(&pc);
        self.bvh.build(&pc, radius);
        self.raw_scans = pc;
    }

    pub fn get_vec_towards_orig(&self, idx: usize) -> Option<UnitVec3> {
        let pt_constraint = &self.constr_vec.vec.get(idx)?;
        return Some(pt_constraint.towards_origin.clone());
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
