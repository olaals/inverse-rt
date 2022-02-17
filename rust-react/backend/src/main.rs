use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use backend::appstate::*;
use backend::expose_assets::*;
use backend::main_api::*;
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState::new());
    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .app_data(app_state.clone())
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
