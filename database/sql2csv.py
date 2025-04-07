import pymysql
from pathlib import Path 
import csv
import json
from datetime import datetime


home = Path.home()/'WelcomeSQL'
outCSV = home/'output.csv'
outJSON = home/'output.json'

connection = pymysql.connect(
    host = 'localhost',
    user = 'root',
    password = 'example',
    db = 'Welcome',
    charset = 'utf8mb4',
    # cursorclass = pymysql.cursors.DictCursor 
)

try:
    with connection.cursor() as cursor:
        sql = "SELECT u.userID, u.firstName, SUM(a.balance) as totalBalance FROM Users u LEFT JOIN Accounts a ON u.userID = a.userID LEFT JOIN Contacts c ON a.userID = c.userID AND c.celluer = 'main' GROUP BY u.userID, u.firstName, u.lastName, c.celluer ORDER BY u.userID;"
        cursor.execute(sql)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
    

        with open(outCSV, 'w', newline = '') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerow(columns)
            writer.writerows(rows)
            print(f"{columns}\n{rows}")
            
finally:
    connection.close() 


