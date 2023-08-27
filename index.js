const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

app.get('/students' , (req,res) => {
    fs.readFile('./db.json','utf-8',(err,data) => {
        if(err){
            console.log(err)
        }
        else{
            const parsedData = JSON.parse(data)
            const reqData = parsedData.students
            res.send(JSON.stringify(reqData))
        }
    })
})
app.get('/feetransactions' , (req,res) => {
    fs.readFile('./db.json','utf-8',(err,data) => {
        if(err){
            console.log(err)
        }
        else{
            const parsedData = JSON.parse(data)
            const reqData = parsedData.fee_transactions
            res.send(JSON.stringify(reqData))
        }
    })
})

app.post('/addstudents',(req,res) => {
    const new_student = req.body
    console.log(new_student)

    fs.readFile('./db.json','utf-8',(err,data) => {
        if(err){
            console.log(err)
        }
        else{
            const parsedData = JSON.parse(data)
            const reqData = parsedData.students

            reqData.push(new_student)
            const result = JSON.stringify(parsedData)

            // Writing the file
            fs.writeFile('./db.json',result,'utf-8',(err) => {
                if(err){
                    console.log(err)
                }
                else{
                console.log("Data updated successfully")
                }
            })
            res.send("Data updated")
        }
    })
})

app.patch('/students/:id',(req,res) => {
    const userStudentId = parseInt(req.params.id)
    const updatedStudent = req.body

    fs.readFile('./db.json' , 'utf-8' , (err,data) => {
        if(err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        }
        else{
            let parsedData = JSON.parse(data)
            let reqDataStudents = parsedData.students
            
            let studentIndex = reqDataStudents.findIndex((student) => student.id === userStudentId)
            if(studentIndex === -1){
                res.status(404).send('Student not found')
            }
            else{
                // update the required student array
                reqDataStudents[studentIndex] = {...reqDataStudents[studentIndex],...updatedStudent}

                fs.writeFile('./db.json',JSON.stringify(parsedData),'utf-8',(err) => {
                    if(err){
                        console.log(err)
                        res.status(500).send("Internal server error")
                    }
                    else{
                        console.log("Data updated successfully")
                        res.send('student updated')
                    }
                })
            }
        }
    })
})

app.delete('/students/:id',(req,res) => {
    const userStudentId = parseInt(req.params.id)
    
    fs.readFile('./db.json','utf-8',(err,data) => {
        if(err){
            console.log(err)
            res.status(500).send("Internal server error")
        }
        else{
            const parsedData = JSON.parse(data)
            const reqDataStudents = parsedData.students

            const studentIndex = reqDataStudents.findIndex((student) => student.id === userStudentId)

            if(studentIndex === -1){
                res.status(404).send("Student not found")
            }
            else{
                // remove the required element from a particular index
                reqDataStudents.splice(studentIndex,1)
                fs.writeFile('./db.json',JSON.stringify(parsedData),'utf-8',(err) => {
                    if(err){
                        console.log(err)
                        res.status(500).send("Internal Server error")
                    }
                    else{
                        console.log("Student deleted successfully")
                        res.send("Student deleted")
                    }
                })
            }
        }
    })
})




app.listen(8080, () => {
    console.log("Server started successfully")
})