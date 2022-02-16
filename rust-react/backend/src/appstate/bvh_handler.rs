#[allow(unused_imports)]
use bvh::aabb::{Bounded, AABB};
use bvh::bounding_hierarchy::{BHShape, BoundingHierarchy};
use bvh::bvh::BVH;
use bvh::ray::Ray;
use bvh::{Point3, Vector3};

#[derive(Debug)]
pub struct Sphere {
    position: Point3,
    radius: f32,
    node_index: usize,
    index: usize,
}

impl Sphere {
    pub fn new(position: Point3, radius: f64, node_index: usize, index: usize) -> Sphere {
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
        let half_size = Vector3::new(self.radius, self.radius, self.radius);
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

    pub fn build(&mut self, pointcloud: &Vec<Vec<Vec<f64>>>, radius: f64) {
        let mut spheres_vec = Vec::new();
        for (i, scan) in pointcloud.iter().enumerate() {
            for (j, point) in scan.iter().enumerate() {
                let pt3 = Point3::new(point[0] as f32, point[1] as f32, point[2] as f32);
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
        let mut bvh = SphereBvh::new();
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

        bvh.build(&pc, 0.5);

        let ray = Ray::new(Point3::new(0.0, 0.0, 10.0), Vector3::new(0.0, 0.0, -1.0));
        let ret = bvh.intersect(&ray);
        assert_eq!(ret.len(), 1);
        assert_eq!(ret[0].index, 0);
    }

    #[test]
    fn ray_test_2() {
        let mut bvh = SphereBvh::new();
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

        bvh.build(&pc, 0.5);

        let ray = Ray::new(Point3::new(0.0, 0.0, 10.0), Vector3::new(0.0, 0.0, -1.0));
        let ret = bvh.intersect_idx(&ray);
        println!("{:?}", ret);
        assert_eq!(ret.len(), 1);
        assert_eq!(ret[0], 0);

        let ray = Ray::new(Point3::new(0.0, 0.0, 10.0), Vector3::new(0.0, 0.0, 1.0));
        let ret = bvh.intersect_idx(&ray);
        assert_eq!(ret.len(), 0);
    }
}

