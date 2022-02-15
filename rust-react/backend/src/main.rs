use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use backend::expose_assets::*;
use backend::main_api::get_arg;
use backend::main_api::*;
use backend::project_pc::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(get_mesh)
            .service(hello)
            .service(echo)
            .service(get_pc)
            .service(get_project_names)
        //.route("/arg", web::get().to(get_arg))
    })
    .workers(2)
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
