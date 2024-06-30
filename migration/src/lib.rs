#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20220101_000001_users;
mod m20231103_114510_notes;

mod m20240624_160829_posts;
mod m20240626_170111_articles;
mod m20240627_134905_comments;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20231103_114510_notes::Migration),
            Box::new(m20240624_160829_posts::Migration),
            Box::new(m20240626_170111_articles::Migration),
            Box::new(m20240627_134905_comments::Migration),
        ]
    }
}