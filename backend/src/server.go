package src

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
)

type Server struct {
	quotes *[]Quote
}

func NewServer(quotes *[]Quote) *Server {
	return &Server{quotes}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func (s *Server) quoteController(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	randomSource := rand.NewSource(int64(rand.Uint64()))
	random := rand.New(randomSource)
	rIndex := random.Intn(len(*s.quotes))

	randomQuote := (*s.quotes)[rIndex]

	js, err := json.Marshal(randomQuote)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (s *Server) Run(port string) {
	httpServer := &http.Server{
		Addr:    ":" + port,
		Handler: s.Handler(),
	}

	fmt.Println("Running quotes server on localhost:" + port)
	log.Fatal(httpServer.ListenAndServe())
}

func (s *Server) Handler() http.Handler {
	r := http.NewServeMux()

	r.HandleFunc("/api/v1/quote", s.quoteController)

	return r
}
