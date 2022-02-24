use crate::geometry::common::vec::*;

#[derive(Debug)]
pub struct NormalVec {
    pub same_scan_idx: usize,
    pub other_scan_idx: usize,
    pub vec: UnitVec3,
}
impl NormalVec {
    pub fn new(same_scan_idx: usize, other_scan_idx: usize, normal_vec: UnitVec3) -> NormalVec {
        NormalVec {
            same_scan_idx,
            other_scan_idx,
            vec: normal_vec,
        }
    }
}

#[derive(Debug)]
pub struct PtConstraint {
    pub pt: Point3,
    pub from_scan: usize,
    pub likelihood: f64,
    pub towards_origin: UnitVec3,
    //est normals:
    pub laser_constraints: Vec<usize>,
    pub camera_constraints: Vec<usize>,
    pub normals: Vec<NormalVec>,
}
impl PtConstraint {
    pub fn new(pt: Point3, from_scan: usize, towards_origin: UnitVec3) -> PtConstraint {
        PtConstraint {
            pt,
            from_scan,
            likelihood: 0.0,
            towards_origin: towards_origin,
            laser_constraints: Vec::new(),
            camera_constraints: Vec::new(),
            normals: Vec::new(),
        }
    }
}

pub struct ConstraintVec {
    pub vec: Vec<PtConstraint>,
}
impl ConstraintVec {
    pub fn new() -> ConstraintVec {
        ConstraintVec { vec: Vec::new() }
    }
    pub fn push(&mut self, pt_constraint: PtConstraint) {
        self.vec.push(pt_constraint);
    }
    pub fn iter(&self) -> std::slice::Iter<PtConstraint> {
        self.vec.iter()
    }
}
