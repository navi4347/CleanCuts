use mysql::*;
use mysql::prelude::*;
use serde::Serialize;
use tauri::command;

#[derive(Serialize)]
struct Category {
    id: i32,
    name: String,
    purchased_stock: f32,
    sold_stock: f32,
    available_stock: f32,
    purchased_price: f32,
    sold_price: f32,
    available_stock_price: f32,
    scrap: f32,
    scrap_value: f32,
}

#[command]
fn fetch_categories() -> Result<Vec<Category>, String> {
    let url = "mysql://root:toor@localhost:3306/cleancuts";
    let pool = Pool::new(url).map_err(|e| e.to_string())?;
    let mut conn = pool.get_conn().map_err(|e| e.to_string())?;

    let categories = conn
        .query_map(
            r#"SELECT 
                category_id, 
                category_name, 
                purchased_stock, 
                sold_stock, 
                available_stock, 
                purchased_price, 
                sold_price, 
                available_stock_price, 
                scrap, 
                scrap_value 
            FROM categories ORDER BY category_id"#,
            |(
                id, name, purchased_stock, sold_stock, available_stock,
                purchased_price, sold_price, available_stock_price,
                scrap, scrap_value
            )| Category {
                id,
                name,
                purchased_stock,
                sold_stock,
                available_stock,
                purchased_price,
                sold_price,
                available_stock_price,
                scrap,
                scrap_value,
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(categories)
}

#[command]
fn total_chicken_purchased_june() -> Result<f32, String> {
    let url = "mysql://root:toor@localhost:3306/cleancuts";
    let pool = Pool::new(url).map_err(|e| e.to_string())?;
    let mut conn = pool.get_conn().map_err(|e| e.to_string())?;

    let total: Option<f32> = conn
        .query_first(
            "SELECT SUM(received_stock) FROM daily_stock_chicken WHERE MONTH(stock_date) = 6 AND YEAR(stock_date) = 2025"
        )
        .map_err(|e| e.to_string())?;

    Ok(total.unwrap_or(0.0))
}

#[command]
fn total_chicken_sold_june() -> Result<f32, String> {
    let url = "mysql://root:toor@localhost:3306/cleancuts";
    let pool = Pool::new(url).map_err(|e| e.to_string())?;
    let mut conn = pool.get_conn().map_err(|e| e.to_string())?;

    let total: Option<f32> = conn
        .query_first(
            "SELECT SUM(sold_stock) FROM daily_stock_chicken WHERE MONTH(stock_date) = 6 AND YEAR(stock_date) = 2025"
        )
        .map_err(|e| e.to_string())?;

    Ok(total.unwrap_or(0.0))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            fetch_categories,
            total_chicken_purchased_june,
            total_chicken_sold_june
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
