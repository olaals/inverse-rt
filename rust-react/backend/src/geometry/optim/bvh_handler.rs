use crate::geometry::common::vec::*;
#[allow(unused_imports)]
use bvh::aabb::{Bounded, AABB};
use bvh::bounding_hierarchy::{BHShape, BoundingHierarchy};
use bvh::bvh::BVH;
use bvh::ray::Ray;

#[derive(Debug)]
pub struct Sphere {
    position: bvh::Point3,
    radius: f32,
    node_index: usize,
    index: usize,
}

impl Sphere {
    pub fn new(position: bvh::Point3, radius: f64, node_index: usize, index: usize) -> Sphere {
        Sphere {
            position: position,
            radius: radius as f32,
            node_index: node_index,
            index: index,
        }
    }
}

impl Bounded for Sphere {
    fn aabb(&self) -> AABB {
        let half_size = bvh::Vector3::new(self.radius, self.radius, self.radius);
        let min = self.position - half_size;
        let max = self.position + half_size;
        AABB::with_bounds(min, max)
    }
}

impl BHShape for Sphere {
    fn set_bh_node_index(&mut self, index: usize) {
        self.node_index = index;
    }

    fn bh_node_index(&self) -> usize {
        self.node_index
    }
}

pub struct SphereBvh {
    bvh: Option<BVH>,
    spheres: Vec<Sphere>,
}

impl SphereBvh {
    pub fn new() -> SphereBvh {
        SphereBvh {
            bvh: None,
            spheres: Vec::new(),
        }
    }

    pub fn build(&mut self, pointcloud: &Vec<Vec<Point3>>, radius: f64) {
        let mut spheres_vec = Vec::new();
        for (i, scan) in pointcloud.iter().enumerate() {
            for (j, point) in scan.iter().enumerate() {
                let pt3 = bvh::Point3::new(point.x() as f32, point.y() as f32, point.z() as f32);
                let node_index = i * scan.len() + j;
                let sphere = Sphere::new(pt3, radius, node_index, node_index);
                spheres_vec.push(sphere);
            }
        }

        let bvh = BVH::build(&mut spheres_vec);
        self.bvh = Some(bvh);
        self.spheres = spheres_vec;
    }

    pub fn intersect(&self, ray: &Ray) -> Vec<&Sphere> {
        self.bvh.as_ref().unwrap().traverse(ray, &self.spheres)
    }

    pub fn intersect_idx(&self, ray: &Ray) -> Vec<usize> {
        let res = self.bvh.as_ref().unwrap().traverse(ray, &self.spheres);
        res.iter()
            .map(|sphere| sphere.index)
            .collect::<Vec<usize>>()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn build_bvh() {
        assert!(true);
    }

    #[test]
    fn ray_test_2() {
        assert!(true);
    }
}
