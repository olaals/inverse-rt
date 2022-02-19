pub mod common;
pub mod normal_est;
pub mod optim;
pub mod project_pc;
use optim::bvh_handler::SphereBvh;
use optim::kdtree_handler::PtKdTree;

pub struct Pt3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub incompatible_index: Vec<usize>,
    pub from_scan: usize,
}

pub struct GeometryHandler {
    kdtree: PtKdTree,
    bvh: SphereBvh,
    ptVec: Vec<Pt3>,
}

impl GeometryHandler {
    pub fn new() -> GeometryHandler {
        GeometryHandler {
            kdtree: PtKdTree::new(),
            bvh: SphereBvh::new(),
            ptVec: Vec::new(),
        }
    }

    pub fn build(&mut self, pc: &Vec<Vec<Vec<f64>>>, radius: f64) {
        let mut ptVec: Vec<Pt3> = Vec::new();
        for i in 0..pc.len() {
            for j in 0..pc[i].len() {
                let mut pt = Pt3 {
                    x: pc[i][j][0],
                    y: pc[i][j][1],
                    z: pc[i][j][2],
                    incompatible_index: Vec::new(),
                    from_scan: i,
                };
                ptVec.push(pt);
            }
        }
        self.ptVec = ptVec;
        self.kdtree.build(&pc);
        self.bvh.build(&pc, radius);
    }
}
