from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import pymysql.cursors

app = Flask(__name__)
CORS(app)

# MySQL connection setup with PyMySQL
conn = pymysql.connect(
    host="localhost",
    user="root",
    password="example",  
    database="Welcome",
    cursorclass=pymysql.cursors.DictCursor
)
cursor = conn.cursor()


@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT * FROM Users")
    users = cursor.fetchall()
    return jsonify(users)


@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    try:
        cursor.execute("""
            INSERT INTO Users (userID, email, username, passkey, firstName, lastName)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['userID'], data['email'], data['username'], data['passkey'], 
              data['firstName'], data['lastName']))
        conn.commit()
        return jsonify({"message": "User added successfully"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route('/users/<int:userID>', methods=['PUT'])
def update_user(userID):
    data = request.json
    try:
        # Build update query dynamically based on provided fields
        update_fields = []
        params = []
        
        for field in ['firstName', 'lastName', 'email', 'username', 'passkey']:
            if field in data and data[field]:
                update_fields.append(f"{field} = %s")
                params.append(data[field])
        
        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400
            
        query = f"UPDATE Users SET {', '.join(update_fields)} WHERE userID = %s"
        params.append(userID)
        
        cursor.execute(query, params)
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"message": "No user found with that ID"}), 404
            
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route('/users/<int:userID>', methods=['DELETE'])
def delete_user(userID):
    try:
        cursor.execute("DELETE FROM Users WHERE userID = %s", (userID,))
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({"message": "User deleted successfully"}), 200
        else:
            return jsonify({"message": "No user found with that ID"}), 404
            
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

# Add full user with contact and account details
@app.route('/add_user_full', methods=['POST'])
def add_user_full():
    data = request.json
    user = data['user']
    contact = data['contact']
    account = data['account']

    try:
        # Insert user
        cursor.execute("""
            INSERT INTO Users (userID, email, username, passkey, firstName, lastName)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user['userID'], user['email'], user['username'], user['passkey'], 
              user['firstName'], user['lastName']))

        # Insert contact
        cursor.execute("""
            INSERT INTO Contacts (userID, phoneType, cellular, isPrimary)
            VALUES (%s, %s, %s, %s)
        """, (user['userID'], contact['phoneType'], contact['cellular'], contact['isPrimary']))

        # Insert account
        cursor.execute("""
            INSERT INTO Accounts (userID, bankID, accountType, balance, holding, isPrimary)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user['userID'], account['bankID'], account['accountType'], 
              account['balance'], account['holding'], account['isPrimary']))

        conn.commit()
        return jsonify({"message": "User added successfully with contact and account details."}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    

# Additional endpoints for working with contacts and accounts
@app.route('/contacts/<int:userID>', methods=['GET'])
def get_user_contacts(userID):
    cursor.execute("SELECT * FROM Contacts WHERE userID = %s", (userID,))
    contacts = cursor.fetchall()
    return jsonify(contacts)


@app.route('/accounts/<int:userID>', methods=['GET'])
def get_user_accounts(userID):
    cursor.execute("SELECT * FROM Accounts WHERE userID = %s", (userID,))
    accounts = cursor.fetchall()
    return jsonify(accounts)


@app.route('/banks', methods=['GET'])
def get_banks():
    cursor.execute("SELECT * FROM Banks")
    banks = cursor.fetchall()
    return jsonify(banks)


@app.route('/banks', methods=['POST'])
def add_bank():
    data = request.json
    try:
        if data.get('bankID') is None:
            # If bankID is not provided, rely on auto-increment
            cursor.execute("""
                INSERT INTO Banks (bankName, bankBranch, bankCountry)
                VALUES (%s, %s, %s)
            """, (data['bankName'], data['bankBranch'], data['bankCountry']))
        else:
            # If bankID is provided, use it
            cursor.execute("""
                INSERT INTO Banks (bankID, bankName, bankBranch, bankCountry)
                VALUES (%s, %s, %s, %s)
            """, (data['bankID'], data['bankName'], data['bankBranch'], data['bankCountry']))
        
        conn.commit()
        bank_id = cursor.lastrowid or data.get('bankID')
        return jsonify({"message": "Bank added successfully", "bankID": bank_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route('/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # Get users count
        cursor.execute("SELECT COUNT(*) as totalUsers FROM Users")
        users_count = cursor.fetchone()['totalUsers']
        
        # Get accounts count
        cursor.execute("SELECT COUNT(*) as totalAccounts FROM Accounts")
        accounts_count = cursor.fetchone()['totalAccounts']
        
        # Get total balance
        cursor.execute("SELECT SUM(balance) as totalBalance FROM Accounts")
        total_balance = cursor.fetchone()['totalBalance'] or 0
        
        # Get contacts count
        cursor.execute("SELECT COUNT(*) as totalContacts FROM Contacts")
        contacts_count = cursor.fetchone()['totalContacts']
        
        return jsonify({
            'totalUsers': users_count,
            'totalAccounts': accounts_count,
            'totalBalance': total_balance,
            'totalContacts': contacts_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



# Close database connection when application terminates
@app.teardown_appcontext
def close_db(error):
    if hasattr(app, 'db'):
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
