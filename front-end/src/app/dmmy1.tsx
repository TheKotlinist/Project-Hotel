// package main

// import (
// 	"database/sql"
// 	"log"

// 	_ "github.com/go-sql-driver/mysql"
// 	"github.com/gofiber/fiber/v2"
// 	"github.com/gofiber/fiber/v2/middleware/cors"
// )

// // ===== STRUCTS =====

// type User struct {
// 	ID   int    `json:"id"`
// 	Name string `json:"name"`
// }

// type Booking struct {
// 	ID        int    `json:"id"`
// 	Name      string `json:"name"`
// 	Email     string `json:"email"`
// 	RoomID    int    `json:"room_id"`
// 	RoomName  string `json:"room_name"`
// 	Guests    int    `json:"guests"`
// 	CheckIn   string `json:"check_in"`
// 	CheckOut  string `json:"check_out"`
// 	CreatedAt string `json:"created_at"`
// }

// type Facility struct {
// 	ID          int    `json:"id"`
// 	Name        string `json:"name"`
// 	Description string `json:"description"`
// 	Image       string `json:"image"`
// }

// // ===== DATABASE VAR =====

// var db *sql.DB

// // ===== MAIN =====

// func main() {
// 	var err error
// 	db, err = sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/bisfordb")
// 	if err != nil {
// 		log.Fatal("Gagal konek DB:", err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		log.Fatal("DB tidak merespon:", err)
// 	}

// 	app := fiber.New()

// 	app.Use(cors.New(cors.Config{
// 		AllowOrigins: "http://localhost:3000", // frontend Next.js
// 		AllowHeaders: "Origin, Content-Type, Accept",
// 		AllowMethods: "GET, POST, DELETE",
// 	}))

// 	// === Routes ===
// 	app.Get("/", func(c *fiber.Ctx) error {
// 		return c.SendString("🚀 API Hotel jalan, siap pakai!")
// 	})

// 	app.Get("/users", getUsers)
// 	app.Post("/users", createUser)

// 	app.Get("/rooms", getRooms)

// 	app.Get("/bookings", getAllBookings)
// 	app.Post("/bookings", createBooking)
// 	app.Delete("/bookings/:id", deleteBooking) // ✅ Tambahan endpoint DELETE

// 	app.Get("/api/facilities", getFacilities)

// 	log.Println("Server running on http://localhost:3001")
// 	log.Fatal(app.Listen(":3001"))
// }

// // ===== HANDLERS =====

// func getUsers(c *fiber.Ctx) error {
// 	rows, err := db.Query("SELECT id, name FROM users")
// 	if err != nil {
// 		return err
// 	}
// 	defer rows.Close()

// 	var users []User
// 	for rows.Next() {
// 		var user User
// 		rows.Scan(&user.ID, &user.Name)
// 		users = append(users, user)
// 	}
// 	return c.JSON(users)
// }

// func createUser(c *fiber.Ctx) error {
// 	user := new(User)
// 	if err := c.BodyParser(user); err != nil {
// 		return err
// 	}
// 	_, err := db.Exec("INSERT INTO users (name) VALUES (?)", user.Name)
// 	if err != nil {
// 		return err
// 	}
// 	return c.SendStatus(fiber.StatusCreated)
// }

// func getRooms(c *fiber.Ctx) error {
// 	rows, err := db.Query("SELECT id, name, price, capacity, stock, image_url, description FROM rooms")
// 	if err != nil {
// 		return err
// 	}
// 	defer rows.Close()

// 	var rooms []map[string]interface{}
// 	for rows.Next() {
// 		var id, price, capacity, stock int
// 		var name, imageURL, description string

// 		err := rows.Scan(&id, &name, &price, &capacity, &stock, &imageURL, &description)
// 		if err != nil {
// 			return err
// 		}

// 		room := map[string]interface{}{
// 			"id":          id,
// 			"name":        name,
// 			"price":       price,
// 			"capacity":    capacity,
// 			"stock":       stock,
// 			"image_url":   imageURL,
// 			"description": description,
// 		}

// 		rooms = append(rooms, room)
// 	}
// 	return c.JSON(rooms)
// }

// func createBooking(c *fiber.Ctx) error {
// 	booking := new(Booking)
// 	if err := c.BodyParser(booking); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 			"error": "Invalid booking data",
// 		})
// 	}

// 	_, err := db.Exec(`
// 		INSERT INTO bookings (name, email, room_id, guests, check_in, check_out)
// 		VALUES (?, ?, ?, ?, ?, ?)`,
// 		booking.Name, booking.Email, booking.RoomID, booking.Guests, booking.CheckIn, booking.CheckOut,
// 	)
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Gagal simpan booking",
// 		})
// 	}

// 	return c.SendStatus(fiber.StatusCreated)
// }

// func getAllBookings(c *fiber.Ctx) error {
// 	rows, err := db.Query(`
// 		SELECT 
// 			b.id, b.name, b.email, b.room_id, r.name as room_name,
// 			b.guests, b.check_in, b.check_out, b.created_at
// 		FROM bookings b
// 		JOIN rooms r ON b.room_id = r.id
// 		ORDER BY b.created_at DESC
// 	`)
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Gagal mengambil data bookings",
// 		})
// 	}
// 	defer rows.Close()

// 	var bookings []Booking
// 	for rows.Next() {
// 		var b Booking
// 		err := rows.Scan(&b.ID, &b.Name, &b.Email, &b.RoomID, &b.RoomName, &b.Guests, &b.CheckIn, &b.CheckOut, &b.CreatedAt)
// 		if err != nil {
// 			return err
// 		}
// 		bookings = append(bookings, b)
// 	}

// 	return c.JSON(bookings)
// }

// func deleteBooking(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	_, err := db.Exec("DELETE FROM bookings WHERE id = ?", id)
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Gagal hapus booking",
// 		})
// 	}
// 	return c.JSON(fiber.Map{"message": "Booking berhasil dihapus"})
// }

// func getFacilities(c *fiber.Ctx) error {
// 	rows, err := db.Query("SELECT id, name, description, image FROM facilities")
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Gagal ambil data fasilitas",
// 		})
// 	}
// 	defer rows.Close()

// 	var facilities []Facility
// 	for rows.Next() {
// 		var f Facility
// 		if err := rows.Scan(&f.ID, &f.Name, &f.Description, &f.Image); err != nil {
// 			return err
// 		}
// 		facilities = append(facilities, f)
// 	}

// 	return c.JSON(fiber.Map{
// 		"facilities": facilities,
// 	})
// }
