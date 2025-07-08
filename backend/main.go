package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// ===== STRUCTS =====

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Booking struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	RoomID    int    `json:"room_id"`
	RoomName  string `json:"room_name"`
	Guests    int    `json:"guests"`
	CheckIn   string `json:"check_in"`
	CheckOut  string `json:"check_out"`
	CreatedAt string `json:"created_at"`
}

type Facility struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type RoomUpdate struct {
	Price int `json:"price"`
}

type Room struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Price       int    `json:"price"`
}

// ===== DATABASE VAR =====

var db *sql.DB

// ===== MAIN =====

func main() {
	var err error
	db, err = sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/bisfordb")
	if err != nil {
		log.Fatal("Gagal konek DB:", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal("DB tidak merespon:", err)
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	app.Static("/images", "./public/images")

	// === Routes ===
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("🚀 API Hotel jalan, siap pakai!")
	})

	app.Get("/users", getUsers)
	app.Post("/users", createUser)

	app.Get("/rooms", getRooms)
	app.Put("/rooms/:id", updateRoomPrice)
	app.Delete("/rooms/:id", deleteRoom)

	app.Get("/bookings", getAllBookings)
	app.Post("/bookings", createBooking)
	app.Delete("/bookings/:id", deleteBooking)

	app.Get("/api/facilities", getFacilities)

	app.Post("/rooms/upload", uploadRoomWithImage)

	app.Post("/rooms", createRoom)

	log.Println("Server running on http://localhost:3001")
	log.Fatal(app.Listen(":3001"))
}

// ===== HANDLERS =====

func getUsers(c *fiber.Ctx) error {
	rows, err := db.Query("SELECT id, name FROM users")
	if err != nil {
		return err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		rows.Scan(&user.ID, &user.Name)
		users = append(users, user)
	}
	return c.JSON(users)
}

func createUser(c *fiber.Ctx) error {
	user := new(User)
	if err := c.BodyParser(user); err != nil {
		return err
	}
	_, err := db.Exec("INSERT INTO users (name) VALUES (?)", user.Name)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusCreated)
}

func getRooms(c *fiber.Ctx) error {
	rows, err := db.Query("SELECT id, name, price, image_url, description FROM rooms")
	if err != nil {
		log.Println("Gagal query rooms:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Gagal ambil data kamar",
		})
	}
	defer rows.Close()

	var rooms []Room
	for rows.Next() {
		var r Room
		err := rows.Scan(&r.ID, &r.Name, &r.Price, &r.ImageURL, &r.Description)
		if err != nil {
			log.Println("Gagal scan room:", err)
			return c.Status(500).JSON(fiber.Map{
				"error": "Gagal parsing data kamar",
			})
		}
		rooms = append(rooms, r)
	}

	return c.JSON(rooms)
}

func updateRoomPrice(c *fiber.Ctx) error {
	id := c.Params("id")
	var payload RoomUpdate
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
	}

	_, err := db.Exec("UPDATE rooms SET price = ? WHERE id = ?", payload.Price, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal update harga kamar"})
	}

	return c.JSON(fiber.Map{"message": "Harga kamar berhasil diupdate"})
}

func deleteRoom(c *fiber.Ctx) error {
	id := c.Params("id")

	// Ambil dulu path image dari DB
	var imageURL string
	err := db.QueryRow("SELECT image_url FROM rooms WHERE id = ?", id).Scan(&imageURL)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal ambil data gambar"})
	}

	// Hapus record dari database
	_, err = db.Exec("DELETE FROM rooms WHERE id = ?", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal hapus kamar"})
	}

	// Ambil nama file dari imageURL (misal: "http://localhost:3001/images/abc.jpg")
	filename := filepath.Base(imageURL) // hasil: "abc.jpg"
	relPath := filepath.Join("public/images", filename)
	absPath, err := filepath.Abs(relPath)
	if err != nil {
		log.Println("❌ Gagal buat path absolut:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Gagal buat path gambar"})
	}

	// Hapus file-nya
	log.Println("🗑️ Menghapus file:", absPath)
	if err := os.Remove(absPath); err != nil && !os.IsNotExist(err) {
		log.Println("❌ Gagal hapus gambar:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Kamar dihapus, tapi gagal hapus gambar"})
	}

	return c.JSON(fiber.Map{"message": "Kamar dan gambar berhasil dihapus"})
}

func createBooking(c *fiber.Ctx) error {
	booking := new(Booking)
	if err := c.BodyParser(booking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid booking data",
		})
	}

	_, err := db.Exec(`
		INSERT INTO bookings (name, email, room_id, guests, check_in, check_out)
		VALUES (?, ?, ?, ?, ?, ?)`,
		booking.Name, booking.Email, booking.RoomID, booking.Guests, booking.CheckIn, booking.CheckOut,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal simpan booking",
		})
	}

	return c.SendStatus(fiber.StatusCreated)
}

func getAllBookings(c *fiber.Ctx) error {
	rows, err := db.Query(`
		SELECT 
			b.id, b.name, b.email, b.room_id, r.name as room_name,
			b.guests, b.check_in, b.check_out, b.created_at
		FROM bookings b
		JOIN rooms r ON b.room_id = r.id
		ORDER BY b.created_at DESC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal mengambil data bookings",
		})
	}
	defer rows.Close()

	var bookings []Booking
	for rows.Next() {
		var b Booking
		err := rows.Scan(&b.ID, &b.Name, &b.Email, &b.RoomID, &b.RoomName, &b.Guests, &b.CheckIn, &b.CheckOut, &b.CreatedAt)
		if err != nil {
			return err
		}
		bookings = append(bookings, b)
	}

	return c.JSON(bookings)
}

func deleteBooking(c *fiber.Ctx) error {
	id := c.Params("id")
	_, err := db.Exec("DELETE FROM bookings WHERE id = ?", id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal hapus booking",
		})
	}
	return c.JSON(fiber.Map{"message": "Booking berhasil dihapus"})
}

func getFacilities(c *fiber.Ctx) error {
	rows, err := db.Query("SELECT id, name, description, image FROM facilities")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal ambil data fasilitas",
		})
	}
	defer rows.Close()

	var facilities []Facility
	for rows.Next() {
		var f Facility
		if err := rows.Scan(&f.ID, &f.Name, &f.Description, &f.Image); err != nil {
			return err
		}
		facilities = append(facilities, f)
	}

	return c.JSON(fiber.Map{
		"facilities": facilities,
	})
}

func createRoom(c *fiber.Ctx) error {
	// ambil data text
	name := c.FormValue("name")
	description := c.FormValue("description")
	priceStr := c.FormValue("price")
	price, _ := strconv.Atoi(priceStr)

	// ambil file
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Gagal ambil file"})
	}

	// Simpan file ke ./public/images/
	imagePath := fmt.Sprintf("./public/images/%s", file.Filename)
	if err := c.SaveFile(file, imagePath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan gambar"})
	}

	// Simpan ke DB, simpan path relative: /images/namafile.jpg
	_, err = db.Exec(`INSERT INTO rooms (name, description, image_url, price) VALUES (?, ?, ?, ?)`,
		name, description, "/images/"+file.Filename, price,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan kamar"})
	}

	return c.JSON(fiber.Map{"message": "Kamar berhasil ditambahkan"})
}

func uploadRoomWithImage(c *fiber.Ctx) error {
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Gambar tidak ditemukan"})
	}

	// Buat folder jika belum ada
	uploadDir := "./public/images"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Gunakan nama unik agar tidak bentrok
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
	savePath := filepath.Join(uploadDir, filename)
	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan gambar"})
	}

	// Simpan full URL ke database
	imageURL := "http://localhost:3001/images/" + filename

	// Ambil data lainnya
	name := c.FormValue("name")
	description := c.FormValue("description")
	priceStr := c.FormValue("price")
	price, _ := strconv.Atoi(priceStr)

	// Simpan ke database
	_, err = db.Exec(`INSERT INTO rooms (name, description, image_url, price) VALUES (?, ?, ?, ?)`,
		name, description, imageURL, price)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal simpan kamar"})
	}

	return c.JSON(fiber.Map{"message": "Kamar ditambahkan", "image_url": imageURL})
}
