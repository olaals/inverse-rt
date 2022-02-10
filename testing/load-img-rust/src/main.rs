use glob::glob;
use lodepng::Bitmap;
use rgb::*;
use std::path::Path;

fn load_image(path: &str) -> Bitmap<RGB<u8>> {
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

fn filter_image(image: &Bitmap<RGB<u8>>) {
    let buffer = &image.buffer;
    let mut new_image = image.clone();
    let threshold = 60;
    for y in 0..image.height {
        for x in 1..(image.width - 1) {
            let prev_red = buffer[y * image.width + x - 1].r;
            let red = buffer[y * image.width + x].r;
            let next_red = buffer[y * image.width + x + 1].r;
            if prev_red > threshold && red > threshold && next_red > threshold {
                new_image.buffer[y * image.width + x].r = 255;
                new_image.buffer[y * image.width + x].g = 255;
                new_image.buffer[y * image.width + x].b = 255;
            } else {
                new_image.buffer[y * image.width + x].r = 0;
                new_image.buffer[y * image.width + x].g = 0;
                new_image.buffer[y * image.width + x].b = 0;
            }
        }
    }
    let res = lodepng::encode24_file(
        "out.png",
        &new_image.buffer,
        new_image.width,
        new_image.height,
    );
    match res {
        Ok(_) => println!("Saved image"),
        Err(error) => println!("Error saving image: {}", error),
    }
}

fn main() {
    let mut paths = glob("scans/scan*/*.png").expect("Failed to read glob pattern");

    let first_path = paths.next().expect("No files found").unwrap();
    println!("{:?}", first_path);
    let image = load_image(first_path.as_os_str().to_str().as_ref().unwrap());
    for i in 0..100 {
        filter_image(&image);
    }
}
