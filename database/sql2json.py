import pymysql
from pathlib import Path 
import json
from datetime import datetime

home = Path.home()/'WelcomeSQL'
outJSON = home/'output.json'

connection = pymysql.connect(
    host = 'localhost',
    user = 'root',
    password = 'example',
    db = 'Welcome',
    charset = 'utf8mb4',
    cursorclass = pymysql.cursors.DictCursor 
)

try:
    
    with connection.cursor() as cursor:
        sql = "SELECT u.userID, u.firstName, SUM(a.balance) as totalBalance FROM Users u LEFT JOIN Accounts a ON u.userID = a.userID LEFT JOIN Contacts c ON a.userID = c.userID AND c.celluer = 'main' GROUP BY u.userID, u.firstName, u.lastName, c.celluer ORDER BY u.userID;"
        cursor.execute(sql)
        rows = cursor.fetchall()
        fRows = []     
        for row in rows:
            row['totalBalance'] = float(row['totalBalance']) if row['totalBalance'] else 0
            fRows.append(row)

        with open(outJSON, 'w') as jsonFile:
            json.dump(fRows, jsonFile, indent = 4)

finally:
    connection.close()