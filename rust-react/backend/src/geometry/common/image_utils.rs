extern crate lodepng as lpng;
use crate::geometry::common::view_geo::ImgCoord;
use lodepng::Bitmap;
use rgb::{RGB, RGB8};

pub fn load_image(path: &str) -> Bitmap<RGB<u8>> {
    println!("Loading image: {}", path);
    match lodepng::decode24_file(path) {
        Ok(image) => {
            println!("Loaded image: {}", path);
            return image;
        }
        Err(error) => {
            println!("Error loading image: {}", path);
            println!("{}", error);
            panic!("Could not load image: {}", path);
        }
    }
}

pub fn filter_image(image: &Bitmap<RGB<u8>>, threshold: u8) -> Vec<ImgCoord> {
    let buffer = &image.buffer;
    let mut img_coord_vec: Vec<ImgCoord> = Vec::new();
    for y in 0..image.height {
        for x in 1..(image.width - 1) {
            let prev_red = buffer[y * image.width + x - 1].r;
            let red = buffer[y * image.width + x].r;
            let next_red = buffer[y * image.width + x + 1].r;
            if prev_red > threshold && red > threshold && next_red > threshold {
                img_coord_vec.push(ImgCoord::new(x as u32, y as u32));
            }
        }
    }
    return img_coord_vec;
}

pub fn load_and_filter_image(path: &str, threshold: u8) -> Vec<ImgCoord> {
    let image = load_image(path);
    return filter_image(&image, threshold);
}

fn img_coords_to_image(img_coords: &Vec<ImgCoord>, width: usize, height: usize) {
    let mut image_vec: Vec<RGB8> = vec![RGB::new(0, 0, 0); (width * height) as usize];
    for y in 0..height {
        for x in 0..width {
            if img_coords.contains(&ImgCoord::new(x as u32, y as u32)) {
                image_vec[(y * width + x) as usize] = RGB::new(255, 255, 255);
            }
        }
    }
    lpng::encode24_file("out.png", &image_vec, width, height).unwrap();
}
