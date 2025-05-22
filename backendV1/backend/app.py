from flask import Flask, request, jsonify
from lockerScript.lockercontrol import open_locker, check_relay
from repositories.DataRepository import DataRepository
from flask_cors import CORS
import requests
import jwt
import datetime

HCAPTCHA_SECRET = "ES_6e6f4832fdf54318bcfbd5ce6f158bb1"
SECRET_KEY = "your_secret_key"  # Use a strong secret and keep it safe!

app = Flask(__name__)
# Configure CORS to properly handle credentials
CORS(app, 
     supports_credentials=True,  # This is crucial for 'credentials: "include"' requests
     origins=["http://localhost:3000"],  # Specify your frontend origin
     max_age=600,  # Cache preflight requests for 10 minutes
     allow_headers=["Content-Type", "Authorization"])

def verify_token(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # You can return user info from the token if needed
    except Exception:
        return None

def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@app.route("/open_locker", methods=["POST"])
def api_open_locker():
    data = request.get_json()
    relay = data.get("relay")
    host = "172.20.48.30"
    user = "admin"
    password = "TD669224"

    if check_relay(host) != 1:
        return jsonify({"success": False, "message": "Relay niet bereikbaar"}), 503

    open_locker(host, user, password, relay-1)
    return jsonify({"success": True, "message": f"Locker {relay} geopend"}), 200

@app.route("/lockers", methods=["GET"])
def api_get_lockers():
    lockers = DataRepository.get_lockers()
    return jsonify(lockers), 200

@app.route("/lockers/<int:locker_id>", methods=["GET"])
def api_get_locker(locker_id):
    locker = DataRepository.get_locker_by_id(locker_id)
    if locker:
        return jsonify(locker), 200
    else:
        return jsonify({"success": False, "message": "Locker niet gevonden"}), 404

@app.route("/items/lockers", methods=["GET"])
def api_get_items_lockers():
    if request.method == "GET":
        items = DataRepository.get_lockers_items()
        if items:
            return jsonify(items), 200
        else:
            return jsonify({"success": False, "message": "Geen items gevonden"}), 404

@app.route("/items/lockers/<int:item_id>", methods=["GET"])
def api_get_item_lockers(item_id):
    if request.method == "GET":
        lockers = DataRepository.get_locker_item(item_id)
        if lockers:
            return jsonify(lockers), 200
        else:
            return jsonify({"success": False, "message": "Geen lockers gevonden voor dit item"}), 404

@app.route("/lockers/<int:locker_id>", methods=["PUT"])
def api_reserve_locker(locker_id):
    # Token check
    if not verify_token(request):
        return jsonify({"success": False, "message": "Ongeldige of ontbrekende token"}), 401

    if request.method == "PUT":
        locker = DataRepository.get_locker_by_id(locker_id)
        if not locker:
            return jsonify({"success": False, "message": "Locker niet gevonden"}), 404

        # status: 0 = gereserveerd, 1 = beschikbaar
        if locker["status"] == 0:
            # Already reserved, so release first
            released = DataRepository.release_locker(locker_id)
            if released:
                return jsonify({"success": True, "message": "Locker vrijgegeven"}), 200
            else:
                return jsonify({"success": False, "message": "Fout bij vrijgeven van locker"}), 500

        elif locker["status"] == 1:
            data = request.get_json()
            code = data.get("code") if data else None
            if not code:
                return jsonify({"success": False, "message": "Code ontbreekt"}), 400
            reserved = DataRepository.reserve_locker(locker_id, code)
            if reserved:
                return jsonify({"success": True, "message": "Locker gereserveerd"}), 200
            else:
                return jsonify({"success": False, "message": "Fout bij reserveren van locker"}), 500

        else:
            return jsonify({"success": False, "message": "Ongeldige locker status"}), 400

@app.route("/register", methods=["POST"])
def api_register():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Geen gegevens ontvangen"}), 400

    voornaam = data.get("voornaam")
    achternaam = data.get("achternaam")
    email = data.get("email")
    wachtwoord = data.get("wachtwoord")
    # captcha_token = data.get("captcha")

    # if not captcha_token:
    #     return jsonify({"success": False, "message": "Captcha is verplicht"}), 400
    
    # # hCaptcha verificatie
    # verify_response = requests.post(
    #     "https://hcaptcha.com/siteverify",
    #     data={
    #         "secret": HCAPTCHA_SECRET,
    #         "response": captcha_token
    #     }
    # )
    
    # result = verify_response.json()
    # print(result)
    # if not result.get("success"):
    #     return jsonify({"success": False, "message": "Captcha verificatie mislukt"}), 400
    
    # registratie uitvoeren
    created_token, user = DataRepository.registreer_gebruiker(voornaam,achternaam,email, wachtwoord)
    if created_token:
        token = generate_token(user["userid"])
        return jsonify({"userId": user["userid"], "success": True, "token": token}), 201
    else:
        return jsonify({"success": False, "message": "Registratie mislukt"}), 400
#
    
@app.route("/login", methods=["POST"])
def api_login():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Geen gegevens ontvangen"}), 400
    email = data.get("email")
    wachtwoord = data.get("wachtwoord")
    user = DataRepository.login(email, wachtwoord)
    if user:
        token = generate_token(user["userid"])
        return jsonify({"success": True, "token": token, "userId": user["userid"]}), 200
    else:
        return jsonify({"success": False, "message": "Login mislukt"}), 401



##nieuwe routes --> Wout
@app.route("/registration", methods=["POST"])
def api_add_registration():
    # Token check
    if not verify_token(request):
        return jsonify({"success": False, "message": "Ongeldige of ontbrekende token"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Geen gegevens ontvangen"}), 400

    user_id = data.get("user_id")
    item_id = data.get("item_id")
    # start_date en end_date worden hier bepaald
    start_date = datetime.datetime.utcnow()
    end_date = start_date + datetime.timedelta(weeks=1)

    if not all([user_id, item_id]):
        return jsonify({"success": False, "message": "Onvolledige gegevens"}), 400

    result, reservation_code = DataRepository.add_reservation(user_id, item_id, start_date, end_date)
    if result:
        return jsonify({"success": True, "message": "Registratie toegevoegd", "code": reservation_code}), 201
    else:
        return jsonify({"success": False, "message": "Fout bij toevoegen registratie"}), 500

@app.route("/registrations/<string:userid>", methods=["GET"])
def api_get_registrations(userid):
    registrations = DataRepository.get_registrations_by_user(userid)
    if registrations:
        return jsonify(registrations), 200
    else:
        return jsonify({"message": "Geen reserveringen gevonden"}), 200

@app.route("/pickup/<int:registration_code>", methods=["GET"])
def api_item_pickup(registration_code):
    result = DataRepository.item_pickup(registration_code)
    if result:
        #check if paid then 
        #open locker with id locker_id
        return jsonify({"success": True, "message": "Item opgehaald"}), 200
        
    else:
        return jsonify({"success": False, "message": "Fout bij ophalen item"}), 500

    

@app.route("/return/<int:registration_code>", methods=["GET"])
def api_item_return(registration_code):
    result = DataRepository.item_return(registration_code)
    if result:
        #check if paid then 
        #open locker with id locker_id --> result["locker_id"]
        return jsonify({"success": True, "message": "Item teruggebracht"}), 200
        
    else:
        return jsonify({"success": False, "message": "Fout bij terugbrengen item"}), 500    

@app.route("/auth/validate", methods=["GET"])
def validate_token():
    if not verify_token(request):
        return jsonify({"valid": False}), 401
    return jsonify({"valid": True}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
