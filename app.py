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
engine = create_engine("sqlite:///flight_cancellations.sqlite")

# reflect an existing database into a new model
#Base = automap_base()
# reflect the tables
#Base.prepare(autoload_with=engine)


# Create our session (link) from Python to the DB
session = Session(engine)

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
       "base.html", pages={
        "airport": "",
        "airline": "",
        "compare": "active",
        "app3": "",
        "appcanc": ""
    })

@app.route("/airline")
def airline():
    return render_template("airline.html", pages={
        "airport": "",
        "airline": "active",
        "compare": "",
        "app3": "",
        "appcanc": ""
    })

@app.route("/airport")
def airport():
    return render_template("airport.html", pages={
        "airport": "active",
        "airline": "",
        "compare": "",
        "app3": "",
        "appcanc": ""
    })

@app.route("/compare")
def compare():
    return render_template(
       "base.html", pages={
        "airport": "",
        "airline": "",
        "compare": "active",
        "app3": "",
        "appcanc": ""
    })

@app.route("/delays")
def heatmap():
    return render_template("indexsample.html", pages={
        "airport": "",
        "airline": "",
        "compare": "",
        "app3": "active",
        "appcanc": ""
    })

@app.route("/cancellations")
def cancels():
    return render_template("indexcanc.html", pages={
        "airport": "",
        "airline": "",
        "compare": "",
        "app3": "",
        "appcanc": "active"
    })

@app.route("/api/airline_delay_cause.json")
def airline_delay_cause():
    results = engine.execute("SELECT * FROM airline_delay_cause")
    return jsonify ([dict(_) for _ in results])


if __name__ == '__main__':
    force = False
    app.run(debug=True)
