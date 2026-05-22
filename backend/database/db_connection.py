import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Load variabel dari file .env
load_dotenv()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error saat menyambungkan ke MySQL: {e}")
        return None

def create_database_if_not_exists():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        if connection.is_connected():
            cursor = connection.cursor()
            db_name = os.getenv("DB_NAME")
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
            print(f"Database '{db_name}' berhasil disiapkan.")
            cursor.close()
            connection.close()
    except Error as e:
        print(f"Error saat membuat database: {e}")