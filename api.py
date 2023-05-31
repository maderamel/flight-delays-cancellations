# Import the dependencies.
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
from flask_cors import CORS

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///flight_cancellation_data/flight_cancellations.sqlite")
engine_1 = create_engine("sqlite:///airline_financial_data/airline_financial.sqlite")

# reflect an existing database into a new model
#Base = automap_base()
# reflect the tables
#Base.prepare(autoload_with=engine)


# Create our session (link) from Python to the DB
session = Session(engine)
session_1 = Session(engine_1)
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)


#################################################
# Flask Routes
#################################################
@app.route("/")
def index():
    return render_template(
       "index.html", pages={
        "airport": "active",
        "airline": ""
    })

@app.route("/airline")
def airline():
    return render_template("airline.html", pages={
        "airport": "",
        "airline": "active"
    })

@app.route("/api/airline_delay_cause.json")
def airline_delay_cause():
    results = engine.execute("SELECT * FROM airline_delay_cause")
    return jsonify ([dict(_) for _ in results])

@app.route("/api/airline_financial.json")
def airline_financial():
    results = engine_1.execute("SELECT * FROM airline_financial")
    return jsonify([dict(_) for _ in results])


if __name__ == '__main__':
    app.run(debug=True)