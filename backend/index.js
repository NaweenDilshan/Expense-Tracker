const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");

const app=express()

app.use(cors())
app.use(express.json())

const PORT=process.env.PORT||8080



//regiser crud
const trackerregister=mongoose.Schema({
   fname:String,
   lname:String,
   email:String,
   password:String,
   Bankbalance:Number

    

},{
    timestamps:true

})

const registermodel=mongoose.model("Users",trackerregister)



app.get("/",async(req,res)=>{
    const data= await registermodel.find({})
  
    res.json({success:true,data:data})
})


app.post("/create",async(req,res)=>{
    const data=new registermodel(req.body)
    await data.save()
    res.send({success:true,message:"data created successfuly"})
})


app.put("/update",async(req,res)=>{
    const {id,...rest}=req.body
    const data=await registermodel.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
})

//update
app.put("/user/update/:id", async (req, res) => {
  try {
      const id = req.params.id;
      const updates = req.body; // New data to update

      // Find the document by ID and update it
      const updatedData = await registermodel.findByIdAndUpdate(id, updates, { new: true });

      if (!updatedData) {
          return res.status(404).json({ success: false, message: "Data not found" });
      }

      res.json({ success: true, message: "Data updated successfully", data: updatedData });
  } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.delete("/delete/:id",async(req,res)=>{
const id=req.params.id
const data=await registermodel.deleteOne({_id:id})
res.send({success:true,message:"deleted successfully",data:data})
})




//update second
app.get("/user/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const discount = await registermodel.findById(id);

        if (!discount) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        res.send({ success: true, message: "User fetched successfully", data: discount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});


////Login 
app.post("/login", async (req, res) => {
    console.log('in-------------------------------');
    const { email, password } = req.body;
  
    try {
        console.log(email);  
      const user = await registermodel.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
    
     // const isPasswordValid = await bcrypt.compare(password, user.password);
     const isPasswordValid1 = user.password===password;

      console.log('Input password:', password);
      console.log('Stored hashed password:', user.password);
      console.log('isPasswordValid:', isPasswordValid1);
      
      if (isPasswordValid1===false) { // Fixed condition
        console.log('Request body:', req.body);
        return res.status(401).json({ success: false, message: "Incorrect password" });
      

      }
  
      // If password is valid, send success message and user data
      res.status(200).json({ success: true, message: "Login successful", data: user });
    } catch (error) {
        console.log('Retrieved user:', user);

      console.error("Login error:", error);
      res.status(500).json({ success: false, message: error });
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Add expence crud
const expenceschema=mongoose.Schema({
    expense_amount:Number,
    expense_type:String,
    expense_bank_type:String,
    expense_remark:String,
 
     
 
 },{
     timestamps:true
 
 })
 
 const expencsemodel=mongoose.model("Expense",expenceschema)
 
 
 
 app.get("/get-expenses",async(req,res)=>{
     const data= await expencsemodel.find({})
   
     res.json({success:true,data:data})
 })
 
 
 app.post("/create_expense",async(req,res)=>{
     const data=new expencsemodel(req.body)
     await data.save()
     res.send({success:true,message:"data created successfuly"})
 })
 
 
 app.put("/update_expense",async(req,res)=>{
     const {id,...rest}=req.body
     const data=await expencsemodel.updateOne({_id:id},rest)
     res.send({success:true,message:"updated successfuly",data:data})
 })
 
 
 
 
 app.delete("/delete_expense/:id",async(req,res)=>{
 const id=req.params.id
 const data=await expencsemodel.deleteOne({_id:id})
 res.send({success:true,message:"deleted successfully",data:data})
 })
 
 //get store data as count
 app.get("/count_expense",async(req,res)=>{
    try{
        const users=await expencsemodel.find({});

        return res.status(200).json({
            count:users.length,
            data:users
        })

    }catch(err){
            console.log(err.message);
            res.json({success:true,message:"feedback count successfully",data:data})
    }

})

 
 //update second
 app.get("/user_expense/:id", async (req, res) => {
     const id = req.params.id;
 
     try {
         const discount = await expencsemodel.findById(id);
 
         if (!discount) {
             return res.status(404).send({ success: false, message: "User not found" });
         }
 
         res.send({ success: true, message: "User fetched successfully", data: discount });
     } catch (error) {
         console.error(error);
         res.status(500).send({ success: false, message: "Internal Server Error" });
     }
 });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Add income crud
mongoose.connect("mongodb+srv://shehan:Shehan99@cluster0.t3v3psz.mongodb.net/Tracker?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const incomeSchema = mongoose.Schema({
  income_amount: Number,
  income_type: String,
  income_bank_type: String,
  income_remark: String,
}, {
  timestamps: true
});

const IncomeModel = mongoose.model("Income", incomeSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/create_income", async (req, res) => {
  try {
    const newData = new IncomeModel(req.body);
    await newData.save();
    res.send({ success: true, message: "Data created successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

app.get("/get-incomes", async (req, res) => {
    try {
      const data = await IncomeModel.find({});
      res.json({ success: true, data: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.put("/update_income/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const { income_amount, income_type, income_bank_type, income_remark } = req.body;
      const updatedIncome = await IncomeModel.findByIdAndUpdate(id, { income_amount, income_type, income_bank_type, income_remark }, { new: true });
  
      if (!updatedIncome) {
        return res.status(404).json({ success: false, message: "Income not found" });
      }
  
      res.status(200).json({ success: true, message: "Income updated successfully", data: updatedIncome });
    } catch (error) {
      console.error("Error updating income:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  

app.delete("/delete_income/:id",async(req,res)=>{
 const id=req.params.id;
 try{
     const data=await IncomeModel.findByIdAndDelete(id);
     res.send({ success: true, message: "deleted successfully", data: data });
 }catch(error){
     res.status(500).send({ success: false, message: error.message });
 }
});

app.get("/count_income",async(req,res)=>{
    try{
        const count=await IncomeModel.countDocuments();
        const data=await IncomeModel.find({});
        res.status(200).json({ count: count, data: data });
    }catch(error){
        res.status(500).send({ success: false, message: error.message });
    }
});

app.get("/user_income/:id", async (req, res) => {
     const id = req.params.id;
 
     try {
         const data = await IncomeModel.findById(id);
 
         if (!data) {
             return res.status(404).send({ success: false, message: "User not found" });
         }
 
         res.send({ success: true, message: "User fetched successfully", data: data });
     } catch (error) {
         console.error(error);
         res.status(500).send({ success: false, message: "Internal Server Error" });
     }
 });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Notification Crud  
const { Schema } = mongoose;

const notificationSchema = new Schema({
  description: String,
  amount: Number,
  date: Date,
  email: String,
});

const Notification = mongoose.model('Notification', notificationSchema);

// Middleware
app.use(bodyParser.json());

// Route handler to create a new notification
app.post('/notifications', async (req, res) => {
  try {
    const { description, amount, date, email } = req.body;

    const newNotification = new Notification({
      description,
      amount,
      date,
      email,
    });

    await newNotification.save();
    res.status(201).json({ success: true, message: 'Notification created successfully' });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
});

// Route handler to get all notifications
app.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});
app.put('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date, email } = req.body;

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { description, amount, date, email },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedNotification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});


// Route handler to delete a notification by ID
app.delete('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Add saving target crud
const targetSchema=mongoose.Schema({
    target_amount:Number,
    target_remark:String,
    target_date:String,
    target_email:String,
   
 
     
 
 },{
     timestamps:true
 
 })
 
 const targetmodel=mongoose.model("Target",targetSchema)
 
 
 
 app.get("/target",async(req,res)=>{
     const data= await targetmodel.find({})
   
     res.json({success:true,data:data})
 })
 
 
 app.post("/create_target",async(req,res)=>{
     const data=new targetmodel(req.body)
     await data.save()
     res.send({success:true,message:"data created successfuly"})
 })
 
 
 
 app.delete("/delete_target/:id",async(req,res)=>{
 const id=req.params.id
 const data=await targetmodel.deleteOne({_id:id})
 res.send({success:true,message:"deleted successfully",data:data})
 })
 
 app.put("/update_target/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const updatedData = await targetmodel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedData) {
          return res.status(404).json({ success: false, message: "Data not found" });
      }
      res.json({ success: true, message: "Data updated successfully", data: updatedData });
  } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
});
 
 app.get("/user_target/:id", async (req, res) => {
     const id = req.params.id;
 
     try {
         const discount = await targetmodel.findById(id);
 
         if (!discount) {
             return res.status(404).send({ success: false, message: "User not found" });
         }
 
         res.send({ success: true, message: "User fetched successfully", data: discount });
     } catch (error) {
         console.error(error);
         res.status(500).send({ success: false, message: "Internal Server Error" });
     }
 });





 //Databse connection
mongoose.connect("mongodb+srv://shehan:Shehan99@cluster0.t3v3psz.mongodb.net/Tracker?retryWrites=true&w=majority")
.then(()=>{
  
    console.log(`🚀💀 Server is started on port ${PORT}!`);
    app.listen(PORT,()=> console.log("💻 Database is synced!"))
}).catch((err)=>{
    console.log(err)
})

