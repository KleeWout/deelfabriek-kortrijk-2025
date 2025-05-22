import datetime
import uuid

import jwt
from .Database import Database
import bcrypt

SECRET_KEY = "jouw_geheime_string"  

class DataRepository:

    @staticmethod
    def json_or_formdata(request):
        if request.method != 'GET' and request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def generate_six_digit_code():
        """
        Generate a 6-digit numeric code derived from a UUID
        
        Returns:
            str: A 6-digit numeric code
        """
        # Generate a UUID and convert to integer
        random_int = int(uuid.uuid4().int) % 1000000  # Get last 6 digits
        # Format as 6-digit string with leading zeros if needed
        return f"{random_int:06d}"


    @staticmethod
    def get_lockers():
        sql = "SELECT * FROM deelfabriek.lockers;"
        result = Database.get_rows(sql)
        return result
    
    @staticmethod
    def get_locker_by_id(locker_id):
        sql = "SELECT * FROM deelfabriek.lockers WHERE idLocker = %s;"
        params = [locker_id]
        result = Database.get_one_row(sql, params)
        return result
    @staticmethod
    def reserve_locker(locker_id, code):
        sql = "UPDATE deelfabriek.lockers SET status = %s, code = %s WHERE idLocker = %s;"
        params = [0,code, locker_id]
        result = Database.execute_sql(sql, params)
        return result
    @staticmethod
    def release_locker(locker_id):
        sql = "UPDATE deelfabriek.lockers SET status = %s, code = %s WHERE idLocker = %s;"
        params = [1, None, locker_id]
        result = Database.execute_sql(sql, params)
        return result
    
    @staticmethod
    def registreer_gebruiker(voornaam, achternaam, email, wachtwoord):
        sql_check = "SELECT * FROM users WHERE email = %s"
        bestaande_gebruiker = Database.get_one_row(sql_check, (email,))
        if bestaande_gebruiker:
            print("❌ Email is al in gebruik.")
            return None  # Changed from False to None for consistency

        wachtwoord_hash = bcrypt.hashpw(wachtwoord.encode('utf-8'), bcrypt.gensalt())
        sql_insert = "INSERT INTO users (userid, voornaam,achternaam,email, wachtwoord_hash) VALUES (UUID(),%s, %s, %s, %s)"
        params = [voornaam, achternaam, email, wachtwoord_hash]
        resultaat = Database.execute_sql(sql_insert, params)
        print("resultaat", resultaat)
        if resultaat:
            print("✅ Gebruiker geregistreerd en token aangemaakt.")
            # Token aanmaken

            # Ophalen van de nieuw aangemaakte gebruiker (id)
            sql_get_user = "SELECT userid FROM users WHERE email = %s"
            user = Database.get_one_row(sql_get_user, (email,))
            if user:
                payload = {
                    "user_id": user["userid"],
                    "email": email,
                    "exp": datetime.datetime.now() + datetime.timedelta(hours=1),
                    "jti": str(uuid.uuid4())
                }
                token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
                return token, user
            else:
                print("❌ Gebruiker registratie gelukt, maar ophalen id mislukt.")
                return None
        else:
            print("❌ Registratie mislukt.")
            return None

    @staticmethod
    def login(email, wachtwoord):
        sql_select = "SELECT userid, wachtwoord_hash FROM users WHERE email = %s"
        user = Database.get_one_row(sql_select, (email,))
        
        if user is None:
            print("❌ user niet gevonden.")
            return None

        wachtwoord_hash = user["wachtwoord_hash"]
        if bcrypt.checkpw(wachtwoord.encode('utf-8'), wachtwoord_hash):
            payload = {
                "user_id": user["userid"],
                "email": email,
                "exp": datetime.datetime.now() + datetime.timedelta(hours=1),
                "jti": str(uuid.uuid4())  # Unieke token id
            } 
            user['token'] = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            print("✅ Login geslaagd.")
            return user
        else:
            print("❌ Fout wachtwoord.")
            return None
        


    @staticmethod
    def add_reservation(user_id, item_id, start_date, end_date):
        sql = "INSERT INTO deelfabriek.registrations (userid,itemid,startdate, enddate) VALUES (%s, %s, %s, %s);"
        params = [user_id, item_id, start_date, end_date]
        result = Database.execute_sql(sql, params)
        if result:
            # Generate a 6-digit code derived from UUID
            short_code = DataRepository.generate_six_digit_code()
            
            # Ensure code is unique
            while True:
                check_sql = "SELECT COUNT(*) as count FROM deelfabriek.registrations WHERE reservationcode = %s;"
                check_result = Database.get_one_row(check_sql, [short_code])
                
                if check_result["count"] == 0:
                    break
                    
                short_code = DataRepository.generate_six_digit_code()
        
        sql_update = "UPDATE deelfabriek.registrations SET reservationcode = %s WHERE registrationid = %s;"
        params_update = [short_code, result]
        Database.execute_sql(sql_update, params_update)
        
        return result, short_code
        
    @staticmethod
    def item_pickup(registration_code):
        sql = "SELECT * FROM deelfabriek.registrations WHERE reservationcode = %s;"
        params = [registration_code]
        result = Database.get_one_row(sql, params)

        if result:
            item_id = result["itemid"]
            sql_update = "UPDATE deelfabriek.lockers SET availability = %s WHERE itemid = %s;"
            params_update = [0, item_id]
            Database.execute_sql(sql_update, params_update)

            # Todo: add loan history

        return result
    

    @staticmethod
    def item_return(registration_code):
        sql = "SELECT * FROM deelfabriek.registrations WHERE reservationcode = %s;"
        params = [registration_code]
        result = Database.get_one_row(sql, params)
        if result:
            item_id = result["itemid"]
            sql_update = "UPDATE deelfabriek.lockers SET availability = %s WHERE itemid = %s;"
            params_update = [1, item_id]
            Database.execute_sql(sql_update, params_update)
             #remove loan history?

            sql_delete = "DELETE FROM deelfabriek.registrations WHERE reservationcode = %s;"
            params_delete = [registration_code]
            Database.execute_sql(sql_delete, params_delete)
        else:
            print("❌ Geen registratie gevonden met deze code.")
            return None
        
        return result
    
    @staticmethod
    def get_lockers_items():
        sql = "SELECT i.itemid,itemname,description,img,price,idLocker,availability FROM deelfabriek.items AS i LEFT JOIN deelfabriek.lockers AS l ON i.itemid = l.itemid;"
        result = Database.get_rows(sql)
        return result

    @staticmethod
    def get_registrations_by_user(user_id):
        sql = "SELECT * FROM deelfabriek.registrations WHERE userid = %s;"
        params = [user_id]
        result = Database.get_rows(sql, params)
        return result