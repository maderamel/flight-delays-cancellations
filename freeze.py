from flask_frozen import Freezer
from app import app
from config import base_url

@freezer.register_generator
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

@freezer.register_generator
@app.route("/airline")
def airline():
    return render_template("airline.html", pages={
        "airport": "",
        "airline": "active",
        "compare": "",
        "app3": "",
        "appcanc": ""
    })

@freezer.register_generator
@app.route("/airport")
def airport():
    return render_template("airport.html", pages={
        "airport": "active",
        "airline": "",
        "compare": "",
        "app3": "",
        "appcanc": ""
    })

@freezer.register_generator
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

@freezer.register_generator
@app.route("/cancellations")
def cancels():
    return render_template("indexcanc.html", pages={
        "airport": "",
        "airline": "",
        "compare": "",
        "app3": "",
        "appcanc": "active"
    })

@freezer.register_generator
@app.route("/api/airline_delay_cause.json")
def airline_delay_cause():
    results = engine.execute("SELECT * FROM airline_delay_cause")
    return jsonify ([dict(_) for _ in results])

if __name__ == '__main__':
    app.config["FREEZER_BASE_URL"] = base_url
    freezer = Freezer(app)
    freezer.freeze()
