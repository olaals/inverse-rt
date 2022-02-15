use actix_files::NamedFile;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
struct MeshRequest {
    project: String,
}

#[get("/get-mesh")]
async fn get_mesh(req: web::Query<MeshRequest>) -> Result<NamedFile> {
    println!("{}", req.project);
    let path = format!("scan-projects/{}/object.obj", req.project);
    println!("{}", path);
    let file = NamedFile::open(path).unwrap();
    Ok(file)
}

#[get("assets/{filename:.*}")]
async fn get_asset(filename: web::Path<String>) -> Result<NamedFile> {
    let path = format!("assets/{}", filename);
    let file = NamedFile::open(path).unwrap();
    Ok(file)
}
