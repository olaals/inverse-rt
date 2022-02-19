struct ConstraintVec {
    pts: Vec<Point>,
    from_scan: usize,
    likelihood: f64,
    //est normals:
    laser_constraints: Vec<usize>,
    camera_constraints: Vec<usize>,
}
