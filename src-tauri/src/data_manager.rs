// FM24 Scout - Rust Data Manager
// Handles role data and player file processing in the Tauri backend

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use tauri::command;

// Role structure matching the JSON data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Role {
    #[serde(rename = "Role")]
    pub role: String,
    #[serde(rename = "RoleCode")]
    pub role_code: String,
    #[serde(rename = "1v1")]
    pub one_v_one: u8,
    #[serde(rename = "Acc")]
    pub acceleration: u8,
    #[serde(rename = "Aer")]
    pub aerial_reach: u8,
    #[serde(rename = "Agg")]
    pub aggression: u8,
    #[serde(rename = "Agi")]
    pub agility: u8,
    #[serde(rename = "Ant")]
    pub anticipation: u8,
    #[serde(rename = "Bal")]
    pub balance: u8,
    #[serde(rename = "Bra")]
    pub bravery: u8,
    #[serde(rename = "Cmd")]
    pub command_of_area: u8,
    #[serde(rename = "Cnt")]
    pub concentration: u8,
    #[serde(rename = "Cmp")]
    pub composure: u8,
    #[serde(rename = "Cro")]
    pub crossing: u8,
    #[serde(rename = "Dec")]
    pub decisions: u8,
    #[serde(rename = "Det")]
    pub determination: u8,
    #[serde(rename = "Dri")]
    pub dribbling: u8,
    #[serde(rename = "Fin")]
    pub finishing: u8,
    #[serde(rename = "Fir")]
    pub first_touch: u8,
    #[serde(rename = "Fla")]
    pub flair: u8,
    #[serde(rename = "Han")]
    pub handling: u8,
    #[serde(rename = "Hea")]
    pub heading: u8,
    #[serde(rename = "Jum")]
    pub jumping_reach: u8,
    #[serde(rename = "Kic")]
    pub kicking: u8,
    #[serde(rename = "Ldr")]
    pub leadership: u8,
    #[serde(rename = "Lon")]
    pub long_shots: u8,
    #[serde(rename = "Mar")]
    pub marking: u8,
    #[serde(rename = "OtB")]
    pub off_the_ball: u8,
    #[serde(rename = "Pac")]
    pub pace: u8,
    #[serde(rename = "Pas")]
    pub passing: u8,
    #[serde(rename = "Pos")]
    pub positioning: u8,
    #[serde(rename = "Ref")]
    pub reflexes: u8,
    #[serde(rename = "Sta")]
    pub stamina: u8,
    #[serde(rename = "Str")]
    pub strength: u8,
    #[serde(rename = "Tck")]
    pub tackling: u8,
    #[serde(rename = "Tea")]
    pub teamwork: u8,
    #[serde(rename = "Tec")]
    pub technique: u8,
    #[serde(rename = "Thr")]
    pub throwing: u8,
    #[serde(rename = "TRO")]
    pub tendency_to_rush_out: u8,
    #[serde(rename = "Vis")]
    pub vision: u8,
    #[serde(rename = "Wor")]
    pub work_rate: u8,
    #[serde(rename = "Cor")]
    pub corners: u8,
}

// Player data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    pub name: String,
    pub nationality: String,
    pub club: String,
    pub position: String,
    pub attributes: HashMap<String, f32>,
    pub calculated_attributes: CalculatedAttributes,
    pub role_scores: HashMap<String, f32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalculatedAttributes {
    pub speed: f32,
    pub work_rate: f32,
    pub set_pieces: f32,
}

// Import result structure
#[derive(Debug, Serialize, Deserialize)]
pub struct ImportResult {
    pub success: bool,
    pub player_count: usize,
    pub players: Vec<Player>,
    pub error: Option<String>,
}

// Embed the roles.json file at compile time
const ROLES_JSON: &str = include_str!("../data/roles.json");

// Static roles data loaded once
lazy_static::lazy_static! {
    static ref ROLES: Vec<Role> = {
        serde_json::from_str(ROLES_JSON)
            .expect("Failed to parse embedded roles.json")
    };
}

// Get all roles
#[command]
pub fn get_roles() -> Vec<Role> {
    ROLES.clone()
}

// Get role by code
#[command]
pub fn get_role_by_code(code: String) -> Option<Role> {
    ROLES.iter().find(|r| r.role_code == code).cloned()
}

// Get roles by duty
#[command]
pub fn get_roles_by_duty(duty: String) -> Vec<Role> {
    ROLES
        .iter()
        .filter(|r| r.role.contains(&duty))
        .cloned()
        .collect()
}

// Import player file (HTML or CSV)
#[command]
pub async fn import_player_file(file_path: String) -> Result<ImportResult, String> {
    let content = fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    
    let players = if file_path.ends_with(".html") || file_path.ends_with(".htm") {
        parse_html_file(&content)?
    } else if file_path.ends_with(".csv") {
        parse_csv_file(&content)?
    } else {
        return Err("Unsupported file format. Please use HTML or CSV files.".to_string());
    };
    
    // Check player count limit
    if players.len() > 20000 {
        return Err(format!(
            "File too large: {} players found (maximum 20,000)",
            players.len()
        ));
    }
    
    Ok(ImportResult {
        success: true,
        player_count: players.len(),
        players,
        error: None,
    })
}

// Parse HTML file
fn parse_html_file(content: &str) -> Result<Vec<Player>, String> {
    use scraper::{Html, Selector};
    
    let document = Html::parse_document(content);
    let table_selector = Selector::parse("table").unwrap();
    let row_selector = Selector::parse("tr").unwrap();
    let cell_selector = Selector::parse("td, th").unwrap();
    
    let table = document
        .select(&table_selector)
        .next()
        .ok_or("No table found in HTML file")?;
    
    let mut rows = table.select(&row_selector);
    
    // Get headers from first row
    let header_row = rows.next().ok_or("No header row found")?;
    let headers: Vec<String> = header_row
        .select(&cell_selector)
        .map(|cell| cell.text().collect::<String>().trim().to_string())
        .collect();
    
    // Parse player rows
    let mut players = Vec::new();
    
    for row in rows {
        let cells: Vec<String> = row
            .select(&cell_selector)
            .map(|cell| cell.text().collect::<String>().trim().to_string())
            .collect();
        
        if cells.len() != headers.len() {
            continue;
        }
        
        let mut attributes = HashMap::new();
        let mut name = String::new();
        let mut nationality = String::new();
        let mut club = String::new();
        let mut position = String::new();
        
        for (i, header) in headers.iter().enumerate() {
            let value = &cells[i];
            
            match header.as_str() {
                "Name" => name = value.clone(),
                "Nationality" => nationality = value.clone(),
                "Club" => club = value.clone(),
                "Position" => position = value.clone(),
                _ => {
                    let parsed_value = parse_attribute_value(value);
                    attributes.insert(header.clone(), parsed_value);
                }
            }
        }
        
        if name.is_empty() || name == "-" {
            continue;
        }
        
        let calculated_attributes = calculate_derived_attributes(&attributes);
        let role_scores = calculate_role_scores(&attributes);
        
        players.push(Player {
            name,
            nationality,
            club,
            position,
            attributes,
            calculated_attributes,
            role_scores,
        });
    }
    
    if players.is_empty() {
        return Err("No valid player data found in HTML file".to_string());
    }
    
    Ok(players)
}

// Parse CSV file
fn parse_csv_file(content: &str) -> Result<Vec<Player>, String> {
    let mut reader = csv::Reader::from_reader(content.as_bytes());
    let headers = reader
        .headers()
        .map_err(|e| format!("Failed to read CSV headers: {}", e))?
        .clone();
    
    let mut players = Vec::new();
    
    for result in reader.records() {
        let record = result.map_err(|e| format!("Failed to read CSV record: {}", e))?;
        
        let mut attributes = HashMap::new();
        let mut name = String::new();
        let mut nationality = String::new();
        let mut club = String::new();
        let mut position = String::new();
        
        for (i, field) in record.iter().enumerate() {
            if let Some(header) = headers.get(i) {
                match header {
                    "Name" => name = field.to_string(),
                    "Nationality" => nationality = field.to_string(),
                    "Club" => club = field.to_string(),
                    "Position" => position = field.to_string(),
                    _ => {
                        let parsed_value = parse_attribute_value(field);
                        attributes.insert(header.to_string(), parsed_value);
                    }
                }
            }
        }
        
        if name.is_empty() || name == "-" {
            continue;
        }
        
        let calculated_attributes = calculate_derived_attributes(&attributes);
        let role_scores = calculate_role_scores(&attributes);
        
        players.push(Player {
            name,
            nationality,
            club,
            position,
            attributes,
            calculated_attributes,
            role_scores,
        });
    }
    
    if players.is_empty() {
        return Err("No valid player data found in CSV file".to_string());
    }
    
    Ok(players)
}

// Parse attribute value (handle ranges and missing values)
fn parse_attribute_value(value: &str) -> f32 {
    if value == "-" || value.is_empty() {
        return 0.0;
    }
    
    // Handle range values like "14-16"
    if value.contains('-') && !value.starts_with('-') {
        let parts: Vec<&str> = value.split('-').collect();
        if parts.len() == 2 {
            if let (Ok(min), Ok(max)) = (parts[0].parse::<f32>(), parts[1].parse::<f32>()) {
                return (min + max) / 2.0;
            }
        }
    }
    
    value.parse::<f32>().unwrap_or(0.0)
}

// Calculate derived attributes
fn calculate_derived_attributes(attributes: &HashMap<String, f32>) -> CalculatedAttributes {
    let pace = attributes.get("Pac").unwrap_or(&0.0);
    let acceleration = attributes.get("Acc").unwrap_or(&0.0);
    let speed = (pace + acceleration) / 2.0;
    
    let work_rate_attr = attributes.get("Wor").unwrap_or(&0.0);
    let stamina = attributes.get("Sta").unwrap_or(&0.0);
    let work_rate = (work_rate_attr + stamina) / 2.0;
    
    let corners = attributes.get("Cor").unwrap_or(&0.0);
    let free_kicks = attributes.get("Fre").unwrap_or(&0.0);
    let penalties = attributes.get("Pen").unwrap_or(&0.0);
    let throw_ins = attributes.get("Thr").unwrap_or(&0.0);
    
    let set_pieces_values: Vec<f32> = vec![*corners, *free_kicks, *penalties, *throw_ins]
        .into_iter()
        .filter(|&v| v > 0.0)
        .collect();
    
    let set_pieces = if set_pieces_values.is_empty() {
        0.0
    } else {
        set_pieces_values.iter().sum::<f32>() / set_pieces_values.len() as f32
    };
    
    CalculatedAttributes {
        speed,
        work_rate,
        set_pieces,
    }
}

// Calculate role scores for a player
fn calculate_role_scores(attributes: &HashMap<String, f32>) -> HashMap<String, f32> {
    let mut scores = HashMap::new();
    
    for role in ROLES.iter() {
        let mut total_score = 0.0;
        let mut weight_sum = 0.0;
        
        // Map role attributes to player attributes
        let role_weights = vec![
            ("1v1", role.one_v_one),
            ("Acc", role.acceleration),
            ("Aer", role.aerial_reach),
            ("Agg", role.aggression),
            ("Agi", role.agility),
            ("Ant", role.anticipation),
            ("Bal", role.balance),
            ("Bra", role.bravery),
            ("Cmd", role.command_of_area),
            ("Cnt", role.concentration),
            ("Cmp", role.composure),
            ("Cro", role.crossing),
            ("Dec", role.decisions),
            ("Det", role.determination),
            ("Dri", role.dribbling),
            ("Fin", role.finishing),
            ("Fir", role.first_touch),
            ("Fla", role.flair),
            ("Han", role.handling),
            ("Hea", role.heading),
            ("Jum", role.jumping_reach),
            ("Kic", role.kicking),
            ("Ldr", role.leadership),
            ("Lon", role.long_shots),
            ("Mar", role.marking),
            ("OtB", role.off_the_ball),
            ("Pac", role.pace),
            ("Pas", role.passing),
            ("Pos", role.positioning),
            ("Ref", role.reflexes),
            ("Sta", role.stamina),
            ("Str", role.strength),
            ("Tck", role.tackling),
            ("Tea", role.teamwork),
            ("Tec", role.technique),
            ("Thr", role.throwing),
            ("TRO", role.tendency_to_rush_out),
            ("Vis", role.vision),
            ("Wor", role.work_rate),
            ("Cor", role.corners),
        ];
        
        for (attr_name, weight) in role_weights {
            if weight > 0 {
                let player_value = attributes.get(attr_name).unwrap_or(&0.0);
                // Normalize to 0-1 range (assuming max attribute is 20)
                let normalized_value = (player_value / 20.0).min(1.0);
                total_score += normalized_value * weight as f32;
                weight_sum += weight as f32;
            }
        }
        
        let score = if weight_sum > 0.0 {
            (total_score / weight_sum) * 100.0
        } else {
            0.0
        };
        
        scores.insert(role.role_code.clone(), score);
    }
    
    scores
}

// Calculate scores for selected roles only
#[command]
pub fn calculate_player_scores(
    players: Vec<HashMap<String, serde_json::Value>>,
    selected_roles: Vec<String>,
) -> Result<Vec<HashMap<String, serde_json::Value>>, String> {
    let mut results = Vec::new();
    
    for player_data in players {
        let mut attributes = HashMap::new();
        
        // Extract attributes from player data
        for (key, value) in &player_data {
            if let Some(num) = value.as_f64() {
                attributes.insert(key.clone(), num as f32);
            } else if let Some(s) = value.as_str() {
                attributes.insert(key.clone(), parse_attribute_value(s));
            }
        }
        
        // Calculate scores for selected roles
        let mut role_scores = HashMap::new();
        for role_code in &selected_roles {
            if let Some(role) = ROLES.iter().find(|r| r.role_code == *role_code) {
                let score = calculate_single_role_score(&attributes, role);
                role_scores.insert(role_code.clone(), score);
            }
        }
        
        // Add scores to player data
        let mut result = player_data.clone();
        result.insert(
            "roleScores".to_string(),
            serde_json::to_value(role_scores).unwrap(),
        );
        
        results.push(result);
    }
    
    Ok(results)
}

// Calculate score for a single role
fn calculate_single_role_score(attributes: &HashMap<String, f32>, role: &Role) -> f32 {
    let mut total_score = 0.0;
    let mut weight_sum = 0.0;
    
    let role_weights = vec![
        ("1v1", role.one_v_one),
        ("Acc", role.acceleration),
        ("Aer", role.aerial_reach),
        // ... (same as above)
    ];
    
    for (attr_name, weight) in role_weights {
        if weight > 0 {
            let player_value = attributes.get(attr_name).unwrap_or(&0.0);
            let normalized_value = (player_value / 20.0).min(1.0);
            total_score += normalized_value * weight as f32;
            weight_sum += weight as f32;
        }
    }
    
    if weight_sum > 0.0 {
        (total_score / weight_sum) * 100.0
    } else {
        0.0
    }
}