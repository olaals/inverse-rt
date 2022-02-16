use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use backend::expose_assets::*;
use backend::main_api::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .service(get_mesh)
            .service(hello)
            .service(echo)
            .service(get_pc)
            .service(get_project_names)
            .service(get_asset)
            .service(get_camera_poses)
            .service(get_laser_poses)
            .service(get_camera_laser_poses)
        //.route("/arg", web::get().to(get_arg))
    })
    .workers(2)
    .bind("127.0.0.1:5000")?
    .run()
    .await
}