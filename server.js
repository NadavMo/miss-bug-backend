import express from "express"
import {bugService} from "./services/bug.service.js"

const app = express()
const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174'
    ],
    credentials: true
}
app.use(cors(corsOptions))
// app.use(express.static('public'))

app.get('/api/bug', async (req,res) =>{
    try {
        const bugs = await bugService.query()
        res.send(bugs)
    } catch (error) {
        console.log('error', error)
        res.status(400).send("Couldn't retrieve bugs")
    }
})

app.get('/api/bug/save', async (req,res) =>{
    const {_id,title,severity} = req.query
    const bugToSave = {_id,title,severity, createAt: Date.now()}
    try {
        const savedData = await bugService.save(bugToSave)
        res.send(savedData)
    } catch (error) {
        console.log('error', error)

    }
})

app.get('/api/bug/:bugId', async (req,res) =>{
    const {bugId} = req.params
    console.log(req.params)
    try {
        const bugs = await bugService.query()
        let bug = bugs.find(bug => bug._id === bugId)
        res.send(bug)
    } catch (error) {
        console.log('error', error)
        res.status(400).send("Couldn't retrieve the bug")
    }
})

app.get('/api/bug/:bugId/remove', async (req,res) =>{
    const {bugId} = req.params
    try {
        await bugService.remove(bugId)
        res.send(`Deleted bug`)
    } catch (error) {
        console.log('error:', error)
        res.status(400).send(`Couldn't delete the bug ${bugId}`)
    }
})



