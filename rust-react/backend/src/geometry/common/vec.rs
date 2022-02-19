extern crate nalgebra as na;
use ndarray::{array, Array2};
use ndarray_npy::{ReadNpyError, ReadNpyExt, WriteNpyError, WriteNpyExt};
use std::fs::File;
use std::path::Path;

pub struct Point3(na::Point3<f64>);

impl Point3 {
    pub fn new(x: f64, y: f64, z: f64) -> Point3 {
        Point3(na::Point3::new(x, y, z))
    }
    pub fn x(&self) -> f64 {
        self.0.x
    }
    pub fn y(&self) -> f64 {
        self.0.y
    }
    pub fn z(&self) -> f64 {
        self.0.z
    }
    pub fn as_array(&self) -> [f64; 3] {
        [self.x(), self.y(), self.z()]
    }
    pub fn from_vec(vec: &Vec3) -> Point3 {
        Point3::new(vec.x(), vec.y(), vec.z())
    }
}

pub struct Vec3(na::Vector3<f64>);

impl Vec3 {
    pub fn new(x: f64, y: f64, z: f64) -> Vec3 {
        Vec3(na::Vector3::new(x, y, z))
    }
    pub fn x(&self) -> f64 {
        self.0.x
    }
    pub fn y(&self) -> f64 {
        self.0.y
    }
    pub fn z(&self) -> f64 {
        self.0.z
    }
    pub fn dot(&self, other: &Vec3) -> f64 {
        self.0.dot(&other.0)
    }
    pub fn cross(&self, other: &Vec3) -> Vec3 {
        Vec3(self.0.cross(&other.0))
    }
    pub fn norm(&self) -> f64 {
        self.0.norm()
    }
    pub fn normalize(&self) -> Vec3 {
        Vec3(self.0.normalize())
    }
    pub fn dot_unit(&self, other: &UnitVec3) -> f64 {
        self.0.dot(&other.0)
    }
    pub fn from_inner(vec: &na::Vector3<f64>) -> Vec3 {
        Vec3(na::Vector3::new(vec.x, vec.y, vec.z))
    }
    pub fn scale(&self, scale: f64) -> Vec3 {
        Vec3(self.0 * scale)
    }
}

pub struct UnitVec3(na::Unit<na::Vector3<f64>>);
impl UnitVec3 {
    pub fn from_inner(inner: na::Unit<na::Vector3<f64>>) -> UnitVec3 {
        UnitVec3(inner)
    }
    pub fn new(x: f64, y: f64, z: f64) -> UnitVec3 {
        UnitVec3(na::Unit::new_normalize(na::Vector3::new(x, y, z)))
    }
    pub fn new_from(vec: Vec3) -> UnitVec3 {
        UnitVec3(na::Unit::new_normalize(vec.0))
    }
    pub fn x(&self) -> f64 {
        self.0.into_inner().x
    }
    pub fn y(&self) -> f64 {
        self.0.into_inner().y
    }
    pub fn z(&self) -> f64 {
        self.0.into_inner().z
    }
    pub fn dot(&self, other: &UnitVec3) -> f64 {
        self.0.dot(&other.0)
    }
    pub fn cross_to_normal(&self, other: &UnitVec3) -> UnitVec3 {
        let other_norm = &other.0;
        let res = self.0.cross(other_norm);
        return UnitVec3(na::Unit::new_normalize(res));
    }
    pub fn cross(&self, other: &UnitVec3) -> Vec3 {
        Vec3(self.0.cross(&other.0))
    }
    pub fn cross_vec(&self, other: &Vec3) -> Vec3 {
        Vec3(self.0.cross(&other.0))
    }

    pub fn norm(&self) -> f64 {
        self.0.norm()
    }
    pub fn dot_vec(&self, other: &Vec3) -> f64 {
        self.0.dot(&other.0)
    }
    pub fn scale(&self, other: f64) -> Vec3 {
        Vec3(self.0.into_inner() * other)
    }
}

pub struct SO3(na::Rotation3<f64>);
impl SO3 {
    fn from_inner(inner: na::Rotation3<f64>) -> SO3 {
        SO3(inner)
    }
    pub fn new_angle_axis(angle: f64, axis: &UnitVec3) -> SO3 {
        let scaled_vec = axis.scale(angle);
        SO3(na::Rotation3::new(scaled_vec.0))
    }
    pub fn as_axis_angle(&self) -> (UnitVec3, f64) {
        let axis = self.0.axis().unwrap();
        let axis_unit = UnitVec3::from_inner(axis);
        let angle = self.0.angle();
        return (axis_unit, angle);
    }
    pub fn get_x_vec(&self) -> UnitVec3 {
        let rx = self.0.matrix();
        let x = rx.row(0);
        UnitVec3::new(x[0], x[1], x[2])
    }
    pub fn get_y_vec(&self) -> UnitVec3 {
        let ry = self.0.matrix();
        let y = ry.row(1);
        UnitVec3::new(y[0], y[1], y[2])
    }
    pub fn get_z_vec(&self) -> UnitVec3 {
        let rz = self.0.matrix();
        let z = rz.row(2);
        UnitVec3::new(z[0], z[1], z[2])
    }
}
pub struct SE3(na::IsometryMatrix3<f64>);
impl SE3 {
    pub fn from_inner(inner: na::IsometryMatrix3<f64>) -> SE3 {
        SE3(inner)
    }

    pub fn new_from_rot_vec(rot: SO3, transl: Vec3) -> SE3 {
        let transl = na::Translation3::from(transl.0);
        let new = na::IsometryMatrix3::from_parts(transl, rot.0);
        return SE3::from_inner(new);
    }
    pub fn decompose(&self) -> (SO3, Vec3) {
        let rot = SO3::from_inner(self.0.rotation.clone());
        let transl = Vec3::new(
            self.0.translation.x,
            self.0.translation.y,
            self.0.translation.z,
        );
        return (rot, transl);
    }
    pub fn transform_point(&self, point: &Point3) -> Point3 {
        let o_pt = self.0.transform_point(&point.0);
        let x = o_pt.coords.get(0).unwrap();
        let y = o_pt.coords.get(1).unwrap();
        let z = o_pt.coords.get(2).unwrap();
        let pt = Point3::new(*x, *y, *z);
        return pt;
    }
    pub fn transform_SE3(&self, other: &SE3) -> SE3 {
        let new_rot = self.0.rotation * &other.0.rotation;
        let other_transl_comp = self.0.rotation * other.0.translation;
        let new_transl = na::Translation3::<f64>::new(
            other_transl_comp.translation.vector.get(0).unwrap()
                + self.0.translation.vector.get(0).unwrap(),
            other_transl_comp.translation.vector.get(1).unwrap()
                + self.0.translation.vector.get(1).unwrap(),
            other_transl_comp.translation.vector.get(2).unwrap()
                + self.0.translation.vector.get(2).unwrap(),
        );
        let new_isom = na::IsometryMatrix3::from_parts(new_transl, new_rot);
        return SE3::from_inner(new_isom);
    }

    pub fn invert(&self) -> SE3 {
        SE3(self.0.inverse())
    }
    pub fn from_npy(path: &str) -> SE3 {
        let reader = File::open(path).unwrap();
        let arr = Array2::<f64>::read_npy(reader).unwrap();
        let arr_mat3: na::Matrix3<f64> = na::Matrix3::new(
            arr[[0, 0]],
            arr[[0, 1]],
            arr[[0, 2]],
            arr[[1, 0]],
            arr[[1, 1]],
            arr[[1, 2]],
            arr[[2, 0]],
            arr[[2, 1]],
            arr[[2, 2]],
        );
        let rot = na::Rotation3::from_matrix(&arr_mat3);
        let rot_so3 = SO3::from_inner(rot);
        let transl = Vec3::new(arr[[0, 3]], arr[[1, 3]], arr[[2, 3]]);
        SE3::new_from_rot_vec(rot_so3, transl)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn create_point() {
        let p = Point3::new(1.0, 2.0, 3.0);
        assert_eq!(p.x(), 1.0);
        assert_eq!(p.y(), 2.0);
        assert_eq!(p.z(), 3.0);
    }

    #[test]
    fn point_to_array() {
        let p = Point3::new(1.0, 2.0, 3.0);
        assert_eq!(p.as_array(), [1.0, 2.0, 3.0]);
    }
}
