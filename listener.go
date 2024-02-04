package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"sync"
	"time"

	"github.com/gorilla/mux"
)

type Agent struct{}

type Listener struct {
	name       string
	port       string
	ipAddress  string
	path       string
	keyPath    string
	filePath   string
	agentsPath string
	isRunning  bool
	key        string
	server     *http.Server
	mu         sync.Mutex
}

func generateKey() string {
	return "dummy_key"
}

func success(message string) {
	fmt.Println(message)
}

func writeToDatabase(agentsDB []Agent, agent Agent) {
}

func clearAgentTasks(name string) {
}

func displayResults(name, result string) {
}

func main() {
	listener := NewListener("example", "8080", "localhost")
	listener.Start()
	defer listener.Stop()

	time.Sleep(time.Second * 2)

	resp, err := http.Post(fmt.Sprintf("http://%s:%s/reg", listener.ipAddress, listener.port), "application/x-www-form-urlencoded", nil)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}

	fmt.Printf("Agent registered with name: %s\n", string(body))
}

func NewListener(name, port, ipAddress string) *Listener {
	l := &Listener{
		name:      name,
		port:      port,
		ipAddress: ipAddress,
		path:      fmt.Sprintf("data/listeners/%s/", name),
	}
	l.keyPath = path.Join(l.path, "key")
	l.filePath = path.Join(l.path, "files")
	l.agentsPath = path.Join(l.path, "agents")
	l.isRunning = false
	l.key = generateKey()

	os.MkdirAll(l.path, os.ModePerm)
	os.MkdirAll(l.agentsPath, os.ModePerm)
	os.MkdirAll(l.filePath, os.ModePerm)

	if _, err := os.Stat(l.keyPath); os.IsNotExist(err) {
		ioutil.WriteFile(l.keyPath, []byte(l.key), os.ModePerm)
	}

	router := mux.NewRouter()
	router.HandleFunc("/reg", l.registerAgent).Methods("POST")
	router.HandleFunc("/tasks/{name}", l.serveTasks).Methods("GET")
	router.HandleFunc("/results/{name}", l.receiveResults).Methods("POST")
	router.HandleFunc("/download/{name}", l.sendFile).Methods("GET")
	router.HandleFunc("/sc/{name}", l.sendScript).Methods("GET")

	l.server = &http.Server{
		Addr:    fmt.Sprintf("%s:%s", l.ipAddress, l.port),
		Handler: router,
	}

	return l
}

func (l *Listener) registerAgent(w http.ResponseWriter, r *http.Request) {
}

func (l *Listener) serveTasks(w http.ResponseWriter, r *http.Request) {
}

func (l *Listener) receiveResults(w http.ResponseWriter, r *http.Request) {
}

func (l *Listener) sendFile(w http.ResponseWriter, r *http.Request) {
}

func (l *Listener) sendScript(w http.ResponseWriter, r *http.Request) {
}

func (l *Listener) run() {
	fmt.Printf("Server running on http://%s:%s\n", l.ipAddress, l.port)
	if err := l.server.ListenAndServe(); err != nil {
		fmt.Println("Error:", err)
	}
}

func (l *Listener) Start() {
	l.mu.Lock()
	defer l.mu.Unlock()

	if l.isRunning {
		return
	}

	go l.run()
	l.isRunning = true
}

func (l *Listener) Stop() {
	l.mu.Lock()
	defer l.mu.Unlock()

	if !l.isRunning {
		return
	}

	if err := l.server.Shutdown(nil); err != nil {
		fmt.Println("Error shutting down server:", err)
	}
	l.isRunning = false
}
