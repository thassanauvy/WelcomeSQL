from flask import Flask, jsonify
from flask_cors import CORS 
import pymysql
from pathlib import Path
from datetime import datetime

app = Flask(__name__)
CORS(app)

def dbConnect():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='example',
        db='Welcome',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )



@app.route('/api/users', methods=['GET'])
def getUsers():

    try:
        connection = dbConnect()
        with connection.cursor() as cursor:
            sql = """
                SELECT 
                    u.userID, 
                    u.firstName, 
                    SUM(a.balance) as totalBalance 
                FROM Users u 
                LEFT JOIN Accounts a ON u.userID = a.userID 
                LEFT JOIN Contacts c ON a.userID = c.userID 
                    AND c.celluer = 'main' 
                GROUP BY u.userID, u.firstName, u.lastName, c.celluer 
                ORDER BY u.userID;
            """
            cursor.execute(sql)
            rows = cursor.fetchall()

            for row in rows:
                row['totalBalance'] = float(row['totalBalance']) if row['totalBalance'] else 0
                
            return jsonify({
                'status': 'success',
                'data': rows,
                'count': len(rows)
            })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
        
    finally:
        connection.close()

@app.route('/api/user/<int:user_id>', methods=['GET'])
def getUser(user_id):

    try:
        connection = dbConnect()
        with connection.cursor() as cursor:
            sql = """
                SELECT 
                    u.userID,
                    u.firstName,
                    u.lastName,
                    c.celluer as phone,
                    SUM(a.balance) as totalBalance
                FROM Users u
                LEFT JOIN Accounts a ON u.userID = a.userID
                LEFT JOIN Contacts c ON u.userID = c.userID
                WHERE u.userID = %s
                GROUP BY u.userID, u.firstName, u.lastName, c.celluer
            """
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()

            if user:
                user['totalBalance'] = float(user['totalBalance']) if user['totalBalance'] else 0
                return jsonify({
                    'status': 'success',
                    'data': user
                })
            else:
                return jsonify({
                    'status': 'error',
                    'message': 'User not found'
                }), 404

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
        
    finally:
        connection.close()
"""
@app.route('/')
def index():
    return app.send_static_file('index.html')
"""
if __name__ == '__main__':
    app.run(debug=True, port=5000)
