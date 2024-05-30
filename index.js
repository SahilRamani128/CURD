const express = require('express')
const cors = require('cors')
const router = express.Router();
const mongoose = require('mongoose')
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const authMiddleware = require('../middleware/authMiddleware');


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8080

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

const schemaData = mongoose.Schema({
    name : String,
    email : String,
    mobile : String,
},
{
    timestamps : true
})

const userModel = mongoose.model("user",schemaData)

app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success : true , data : data})
})

app.post("/create",async(req,res)=>{
    console.log(req.body)
    const data = new userModel(req.body)
    await data.save()
    res.send({success : true, message : "data save successfully", data : data})
})

app.put("/update",async(req,res)=>{
    console.log(req.body)
    const {_id,...rest} = req.body
    console.log(rest)
    const data = await userModel.updateOne({_id: _id},rest)
    res.send({success : true, message : "data updated successfully", data : data})
})

app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id : id})
    res.send({success : true, message : "data deleted successfully", data : data})
})

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  }, { timestamps: true });
  
  const taskModel = mongoose.model('Task', taskSchema);
  
  module.exports = taskModel;

router.get('/', async (req, res) => {
    try {
      const tasks = await taskModel.find({}).populate('assignedUsers', 'name email');
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  
  router.post('/create', async (req, res) => {
    try {
      const task = new taskModel(req.body);
      await task.save();
      res.status(201).json({ success: true, message: 'Task created successfully', data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  
  router.put('/update/:id', async (req, res) => {
    try {
      const task = await taskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  
  router.delete('/delete/:id', async (req, res) => {
    try {
      await taskModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  
  module.exports = router;

mongoose.connect("mongodb+srv://SahilRamani128:Sahil128@cluster0.rboke9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("connect to DB")
    app.listen(PORT,()=>console.log("Server is running"))
})
.catch((err)=>console.log(err));

