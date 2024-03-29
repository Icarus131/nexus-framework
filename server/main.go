package main

import (
	"bufio"
	"bytes"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/joho/godotenv"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var (
	users    []User
	usersMtx sync.Mutex
	apiKey   string
)

func main() {
	absPath, err := filepath.Abs("../.env")
	if err != nil {
		log.Fatal("Error getting absolute path to .env file:", err)
	}

	if err := godotenv.Load(absPath); err != nil {
		log.Fatal("Error loading .env file")
	}
	apiKey = generateAPIKey()
	fmt.Println("API Key:", apiKey)
	go startServer()

	fmt.Println(" -> Welcome to the Nexus-Framework Setup. Use 'r' to register a new user or 'q' to quit.\n")
	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print(" ┬─[Nexus-Framework]\n ╰─> ")
		input, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Error reading input:", err)
			continue
		}
		input = strings.TrimSpace(input)
		switch input {
		case "r":
			registerUser()
		case "q":
			fmt.Println("Exiting...")
			os.Exit(0)
		default:
			fmt.Println("\nInvalid input. Press 'r' to register a new user or 'q' to quit.\n")
		}
	}
}

func startServer() {
	http.HandleFunc("/users", createUser)
	http.HandleFunc("/login", login)
	http.ListenAndServe(":8080", nil)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	if !isValidAPIKey(r) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	const maxBodyBytes = 1024
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)

	var newUser User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if newUser.Username == "" || newUser.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	usersMtx.Lock()
	defer usersMtx.Unlock()

	for _, user := range users {
		if user.Username == newUser.Username {
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}
	}

	users = append(users, newUser)

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User created successfully"))
}

func login(w http.ResponseWriter, r *http.Request) {
	var creds User
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("Received login request for user:", creds.Username)
	fmt.Println("Provided password:", creds.Password)

	usersMtx.Lock()
	defer usersMtx.Unlock()

	for _, user := range users {
		fmt.Println("Checking user:", user.Username)
		if user.Username == creds.Username && user.Password == creds.Password {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Login successful"))
			fmt.Println("Login successful for user:", creds.Username)
			return
		}
	}

	fmt.Println("User not found or incorrect password for user:", creds.Username)
	http.Error(w, "Unauthorized", http.StatusUnauthorized)
}

func isValidAPIKey(r *http.Request) bool {
	apiKeyHeader := r.Header.Get("X-API-Key")
	fmt.Println("Received API Key:", apiKeyHeader)
	return apiKeyHeader == apiKey
}

func generateAPIKey() string {
	apiKeySize := 32
	apiKeyBytes := make([]byte, apiKeySize)
	_, err := io.ReadFull(rand.Reader, apiKeyBytes)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(apiKeyBytes)
}

func generateSalt() string {
	const saltSize = 16
	salt := make([]byte, saltSize)
	_, err := io.ReadFull(rand.Reader, salt)
	if err != nil {
		panic(err)
	}
	return fmt.Sprintf("%x", salt)
}

func hashPassword(password, salt string) string {
	hashed := sha256.Sum256([]byte(password + salt))
	return fmt.Sprintf("%x", hashed)
}

func registerUser() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Println("Register a new user:")
	fmt.Print("Enter username: ")
	username, _ := reader.ReadString('\n')
	username = strings.TrimSpace(username)

	fmt.Print("Enter password: ")
	password, _ := reader.ReadString('\n')
	password = strings.TrimSpace(password)

	user := User{
		Username: username,
		Password: password,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	port := os.Getenv("PORT")
	host := os.Getenv("HOST")

	regurl := "http://" + host + ":" + port + "/users"

	req, err := http.NewRequest("POST", regurl, bytes.NewBuffer(userJSON))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")

	req.Header.Set("X-API-Key", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusCreated {
		fmt.Println("User registered successfully!")
	} else {
		fmt.Println("Failed to register user. Status code:", resp.StatusCode)
	}
}

type Listener struct {
	Port int `json:"port"`
}

var listeners []Listener

func addListener(w http.ResponseWriter, r *http.Request) {
	var newListener Listener
	err := json.NewDecoder(r.Body).Decode(&newListener)
	if err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	listeners = append(listeners, newListener)
	fmt.Fprintf(w, "Listener added successfully")
}
