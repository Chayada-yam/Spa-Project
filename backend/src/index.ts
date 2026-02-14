export default {
  async fetch(request: Request, env: any) {
    if (request.method === "POST") {
      const body = await request.json()

      await env.DB.prepare(
        "INSERT INTO bookings (name, phone, service, date, time) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(body.name, body.phone, body.service, body.date, body.time)
        .run()

      return new Response("Booking saved")
    }

    if (request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM bookings"
      ).all()

      return Response.json(results)
    }

    return new Response("Not found", { status: 404 })
  },
}
