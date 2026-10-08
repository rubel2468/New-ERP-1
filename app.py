"""Main Flask application for cash/credit customer management.

Features:
- Create customer (cash or credit) – generates a UUID.
- View customer details.
- Update payment status via form.
"""

import uuid
import sqlite3
from flask import Flask, request, render_template, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'replace-with-secure-key'
DB_PATH = "customer.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT CHECK(type IN ('cash','credit')) NOT NULL,
            amount_due REAL NOT NULL,
            paid INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    conn = sqlite3.connect(DB_PATH)
    customers = conn.execute("SELECT * FROM customers").fetchall()
    conn.close()
    return render_template('index.html', customers=customers)

@app.route('/customer/new', methods=['GET', 'POST'])
def new_customer():
    if request.method == 'POST':
        name = request.form['name']
        cust_type = request.form['type']
        amount = float(request.form['amount'])
        cust_id = str(uuid.uuid4())
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            "INSERT INTO customers (id, name, type, amount_due) VALUES (?,?,?,?)",
            (cust_id, name, cust_type, amount),
        )
        conn.commit()
        conn.close()
        flash(f"Customer created with ID {cust_id}")
        return redirect(url_for('index'))
    return render_template('new_customer.html')

@app.route('/payment', methods=['GET', 'POST'])
def payment():
    if request.method == 'POST':
        cust_id = request.form['id']
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT * FROM customers WHERE id = ?", (cust_id,))
        customer = cur.fetchone()
        if customer:
            cur.execute("UPDATE customers SET paid = 1 WHERE id = ?", (cust_id,))
            conn.commit()
            flash(f"Payment recorded for customer {cust_id}")
        else:
            flash('Customer ID not found')
        conn.close()
        return redirect(url_for('index'))
    return render_template('payment.html')

if __name__ == '__main__':
    app.run(debug=True)
