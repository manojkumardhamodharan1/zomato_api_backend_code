var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const mysql = require("mysql")


var app = express()
app.use(cors())


//DB connection _____________________________________________________________

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Lathadhamu$2020",
    database: "zomato"

});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('DB is connected')
});

//_______________________________________________________________________________

// parse application/json
app.use(bodyParser.json())


// getting username and password __________________________________________________________

app.post("/signup", (req, res) => {

    console.log("recieved data from front-end", req.body)
  
    const username = req.body.username
    const password = req.body.password

    db.query(`INSERT INTO users (Username, password, UserID)VALUES 
                        ('${username}','${password}' )`,

        (err, result) => {

            console.log(err);

        })

    const responseData = {
        userId: uuidv4(),
        name: req.body.username
    }
    res.json({ success: true, message: "Signup success", data: responseData })
})

/*
* To check Login
* @param : req - {logname: string, logpass:string}
* @returns : res - {success: boolean, message: string, data: {}}
*/
app.post("/headerlogin", (req, res) => {
    console.log("recieved data from front-end", req.body)
    const logname = req.body.logname
    const logpass = req.body.logpass
    const query = `select * FROM users WHERE Username='${logname}' AND password='${logpass}'`;
    db.query(query,
        (err, result) => {
            if (err) {
                res.json({ success: false, message: "Login Failed", err: err })
            }
            if (result && result.length > 0) {
                res.json({ success: true, message: "Login Success", data: result[0],err: err })
            }
        }
    )
})/


//________________________________________________________________________

app.post("/HotelSignup", (req, res) => {
    console.log("recieved data from front-end", req.body)
    
    const userId = uuidv4();
    const rest_reg_usernames = req.body.rest_reg_usernames
    const rest_reg_pass = req.body.rest_reg_pass
    const query = `select UserID FROM restaurantregister WHERE RestaurantUsername='${rest_reg_usernames}' AND ReataurantPassword='${rest_reg_pass}'`;
    db.query(query,
        (err, result) => {  
            if(result == ""){    
               
                const userId = uuidv4();
                db.query(`INSERT INTO restaurantregister(RestaurantUsername, ReataurantPassword, UserID)VALUES 
                ('${rest_reg_usernames}','${rest_reg_pass}','${userId}' )`)
          
                res.json({ data: userId})   
                
            }
            else  {
                console.log(result ) 
                res.json({data : result[0]})
            }
        }  
    )

})


app.post("/HotelNameEntry", (req, res) => {
    console.log("recieved data from front-end", req.body)

    const HotelId = uuidv4();

   const User_Primary_ID = req.body.unID
    const cafe_name = req.body.rest_name
    const query = `select * FROM hotel_name WHERE UserID='${User_Primary_ID}' AND Hotel_name='${cafe_name}'`;
    db.query(query,
        (err, result) => {  
            if(result == ""){
                db.query(`INSERT INTO hotel_name(UserID, Hotel_ID , Hotel_name)VALUES 
                ('${User_Primary_ID}','${HotelId}','${cafe_name}' )`)
                res.json({ data: HotelId})    
                  
            }
            if (result && result.length > 0) {
                res.json({ success: false, message: "Login fail"})
            }
        }  
    )
})

app.post("/DishDetailEntry", (req, res) => {
    console.log("recieved data from front-end", req.body)
    const Hotel_primary_key = req.body.Hotel_UnID   
    const foods_name = req.body.dish_name
    const foods_price = req.body.dish_price
    const query = `INSERT INTO dish_details(Hotel_ID , FOOD_NAME , FOOD_PRICE)VALUES 
    ('${Hotel_primary_key}','${foods_name}','${foods_price}' )`;
    db.query(query,
        (err, result) => {
            if (err) {
                res.json({ success: false, message: "Failed to insert", err: err })
            }

            if (result && result.length > 0) {
                res.json({ success: true, message: "inserted Success" })
            }
        }   
    )
})

//____________________***************************________________________________***************************

app.post("/ListAllHotel", (req, res) => {
    console.log("recieved data from front-end", req.body)
    const UID = req.body.unique_ID4
    console.log(UID)
    if(req.body.unique_ID4)
{
    console.log(UID)
    const query = `select * FROM hotel_name WHERE UserID='${UID}' `;
    db.query(query, 
        (err, result) => {
            if (err) {     
                res.json({ success: false, message: "Failed to insert", err: err })
            }
  
            if (result && result.length > 0) {  
                console.log(result)
                res.json({ result })
            }  
        })
}
else{
    const query = `select * FROM hotel_name`;
    db.query(query,
        (err, result) => {
            if (err) {      
                res.json({ success: false, message: "Failed to insert", err: err })
            }
  
            if (result && result.length > 0) {  
                console.log(result)
                res.json({ result })  
            }  
        })
}
        
})

//________________**********************______________________*********************_______________



app.post("/Get_MY_Dishes", (req, res) => {
  
    console.log(req.body.cafe_ID)
    const CAFE_ID = req.body.cafe_ID
    
    const query = `SELECT * FROM dish_details WHERE Hotel_ID = '${CAFE_ID}'`;
    console.log(query)
    db.query(query,
        (err, result) => {
            if (err) {      
                res.json({ success: false, message: "Failed to insert", err: err })
            }
  
            if (result) {  
             
                res.json({ result })
           
            }
        }  
    )
})  



app.listen(8081, () => {
    console.log("port is listening")
})