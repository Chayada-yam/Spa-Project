import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { pool } from './db'

const app = new Hono()
app.use('/*', cors())

app.get('/services', async (c) => {
  const [rows] = await pool.query('SELECT * FROM services')
  return c.json(rows)
})

export default app