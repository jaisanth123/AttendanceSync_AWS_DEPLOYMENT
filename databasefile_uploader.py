import pandas as pd
from pymongo import MongoClient
import json

# Load Excel file
excel_file = "AIDS-A_2nd_year.xls"
data = pd.read_excel(excel_file)

# Convert DataFrame to JSON
data_json = json.loads(data.to_json(orient="records"))

# MongoDB Atlas connection (replace with your URI and collection details)
client = MongoClient("mongodb+srv://krrashmika2004:vppCejSTFgfm51dn@cluster0.9cpfc.mongodb.net/?retryWrites=true")
db = client["Attendence_Monitering"]  # Replace with your database name
collection = db["sample"]  # Replace with your collection name

# Insert data into MongoDB
try:
    collection.insert_many(data_json)
    print("Data uploaded successfully to MongoDB Atlas.")
except Exception as e:
    print("An error occurred:", e)
